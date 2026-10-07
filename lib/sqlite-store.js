const fs = require("fs");
const path = require("path");
const { DatabaseSync } = require("node:sqlite");
const { BufferJSON } = require("@whiskeysockets/baileys");
const lidMap = require("./lid.js");

const MEMORY_CAP = 2000;

const str = v => JSON.stringify(v, BufferJSON.replacer);
const parse = v => {
  try {
    return JSON.parse(v, BufferJSON.reviver);
  } catch {
    return undefined;
  }
};

const num = v => {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "bigint") return Number(v);
  if (typeof v === "string" && v.trim() !== "" && Number.isFinite(Number(v))) return Number(v);
  if (v && typeof v === "object" && v.low !== undefined) {
    const low = Number(v.low);
    if (Number.isFinite(low)) return v.high ? low + Number(v.high) * 4294967296 : low;
  }
  return Date.now();
};

const contacts = {};
const messages = {};
const chats = {};
const allgroup = {};
const labels = {};
const labelAssociations = {};

// __dirname is lib/, so the project-root data dir is one level up.
const dbPath = path.join(__dirname, "../data/store/store.db");
const db = new DatabaseSync(dbPath);
db.exec("PRAGMA journal_mode = WAL");
db.exec("PRAGMA synchronous = NORMAL");
db.exec(`
  CREATE TABLE IF NOT EXISTS chats (id TEXT PRIMARY KEY, payload TEXT NOT NULL);
  CREATE TABLE IF NOT EXISTS contacts (lid TEXT PRIMARY KEY, payload TEXT NOT NULL);
  CREATE TABLE IF NOT EXISTS groups (id TEXT PRIMARY KEY, payload TEXT NOT NULL);
  CREATE TABLE IF NOT EXISTS labels (id TEXT PRIMARY KEY, payload TEXT NOT NULL);
  CREATE TABLE IF NOT EXISTS label_assoc (id TEXT PRIMARY KEY, payload TEXT NOT NULL);
  CREATE TABLE IF NOT EXISTS messages (
    chat TEXT NOT NULL,
    id TEXT NOT NULL,
    ts INTEGER,
    payload TEXT NOT NULL,
    PRIMARY KEY (chat, id)
  );
  CREATE INDEX IF NOT EXISTS messages_ts ON messages (ts);
  -- The per-chat prune does "WHERE chat = ? AND id NOT IN (SELECT id ... WHERE chat = ? ORDER BY
  -- ts DESC LIMIT ?)". With only the ts index that inner sort scans every row of the table for each
  -- chat, so it got slower as messages accumulated.
  CREATE INDEX IF NOT EXISTS messages_chat_ts ON messages (chat, ts);
`);

const q = {
  putChats: db.prepare("INSERT OR REPLACE INTO chats (id, payload) VALUES (?, ?)"),
  delChats: db.prepare("DELETE FROM chats WHERE id = ?"),
  allChats: db.prepare("SELECT payload FROM chats"),
  putContacts: db.prepare("INSERT OR REPLACE INTO contacts (lid, payload) VALUES (?, ?)"),
  allContacts: db.prepare("SELECT payload FROM contacts"),
  putGroups: db.prepare("INSERT OR REPLACE INTO groups (id, payload) VALUES (?, ?)"),
  allGroups: db.prepare("SELECT payload FROM groups"),
  putLabels: db.prepare("INSERT OR REPLACE INTO labels (id, payload) VALUES (?, ?)"),
  allLabels: db.prepare("SELECT payload FROM labels"),
  putAssoc: db.prepare("INSERT OR REPLACE INTO label_assoc (id, payload) VALUES (?, ?)"),
  allAssoc: db.prepare("SELECT payload FROM label_assoc"),
  putMsg: db.prepare("INSERT OR REPLACE INTO messages (chat, id, ts, payload) VALUES (?, ?, ?, ?)"),
  delMsg: db.prepare("DELETE FROM messages WHERE chat = ? AND id = ?"),
  getMsg: db.prepare("SELECT payload FROM messages WHERE chat = ? AND id = ?"),
  trimChat: db.prepare(
    "DELETE FROM messages WHERE chat = ? AND id NOT IN (SELECT id FROM messages WHERE chat = ? ORDER BY ts DESC LIMIT ?)"
  )
};

// A persistence problem must never take down the bot, so every write goes through here.
const safeWrite = (label, fn) => {
  try {
    fn();
  } catch (err) {
    if (!global.__storeWarned) {
      global.__storeWarned = true;
      console.log(`store: ${label} persist failed, continuing in memory only: ${err.message}`);
    }
  }
};

const hydrate = () => {
  for (const { payload } of q.allChats.all()) {
    const c = parse(payload);
    if (c?.id) chats[c.id] = c;
  }
  for (const { payload } of q.allContacts.all()) {
    const c = parse(payload);
    if (c) {
      contacts[c.lid || c.id] = c;
      if (c.lid && c.jid) lidMap.learn({ lid: c.lid, jid: c.jid });
    }
  }
  for (const { payload } of q.allGroups.all()) {
    const g = parse(payload);
    if (g?.id) allgroup[g.id] = g;
  }
  for (const { payload } of q.allLabels.all()) {
    const l = parse(payload);
    if (l?.id) labels[l.id] = l;
  }
  for (const { payload } of q.allAssoc.all()) {
    const l = parse(payload);
    if (l?.id) labelAssociations[l.id] = l;
  }
  for (const { payload } of db.prepare("SELECT payload FROM messages ORDER BY ts ASC").all()) {
    const m = parse(payload);
    if (!m?.key?.remoteJid) continue;
    (messages[m.key.remoteJid] ||= { array: [] }).array.push(m);
  }
};
hydrate();

const storeMessage = m => {
  if (!m?.key?.id) return;
  const chat = m.key.remoteJid;
  if (!chat) return;
  // Persistence must never take down the bot's message loop.
  try {
    q.putMsg.run(String(chat), String(m.key.id), num(m.messageTimestamp), str(m));
  } catch (err) {
    if (!global.__storeWarned) {
      global.__storeWarned = true;
      console.log("store: message persist failed once, continuing in-memory:", err.message);
    }
  }
  const bucket = (messages[chat] ||= { array: [] });
  const at = bucket.array.findIndex(x => x.key?.id === m.key.id);
  if (at >= 0) bucket.array[at] = m;
  else bucket.array.push(m);
  if (bucket.array.length > MEMORY_CAP) {
    bucket.array.splice(0, bucket.array.length - MEMORY_CAP);
    try {
      q.trimChat.run(String(chat), String(chat), MEMORY_CAP);
    } catch {}
  }
};

// deleted messages unreachable in LID chats.
const chatCandidates = remoteJid => {
  const base = String(remoteJid).split("@")[0];
  const server = String(remoteJid).split("@")[1] || "";
  const out = [remoteJid];
  if (server === "lid") {
    const known = lidMap.resolve(remoteJid);
    if (known && known !== remoteJid) out.push(known);
    out.push(`${base}@s.whatsapp.net`);
  } else if (server === "s.whatsapp.net" || server === "c.us") {
    out.push(`${base}@lid`);
    out.push(`${base}@g.us`);
  } else if (!server) {
    out.push(`${base}@lid`, `${base}@s.whatsapp.net`, `${base}@g.us`);
  }
  return [...new Set(out)];
};

const loadMessage = async (remoteJid, id) => {
  if (!remoteJid || !id) return undefined;
  for (const chat of chatCandidates(remoteJid)) {
    const hit = messages[chat]?.array?.find(m => m.key?.id === id);
    if (hit) return hit;
    const row = q.getMsg.get(chat, id);
    if (row) {
      const m = parse(row.payload);
      if (m) return m;
    }
  }
  return undefined;
};

const upsertMessage = (...msgs) => msgs.flat().forEach(storeMessage);

const bind = ev => {
  if (!ev?.on) return;
  ev.on("messages.upsert", ({ messages: msgs }) => msgs.forEach(storeMessage));
  ev.on("messaging-history.set", ({ messages: msgs, chats: histChats, contacts: histContacts } = {}) => {
    try {
      db.exec("BEGIN");
      for (const m of msgs || []) {
        storeMessage(m);
      }
      for (const c of histChats || []) {
        if (!c?.id) continue;
        chats[c.id] = { ...(chats[c.id] || {}), ...c };
        q.putChats.run(String(c.id), str(chats[c.id]));
      }
      for (const c of histContacts || []) {
        const lid = c?.lid || c?.id;
        if (!lid) continue;
        contacts[lid] = { ...(contacts[lid] || {}), ...c, id: c.id, lid: c.lid || c.id };
        q.putContacts.run(String(lid), str(contacts[lid]));
      }
      db.exec("COMMIT");
    } catch (err) {
      try {
        db.exec("ROLLBACK");
      } catch (e) {}
    }
  });

  ev.on("chats.upsert", list => {
    for (const c of list || []) {
      if (!c?.id) continue;
      chats[c.id] = { ...(chats[c.id] || {}), ...c };
      safeWrite("chat", () => q.putChats.run(String(c.id), str(chats[c.id])));
    }
  });

  ev.on("contacts.upsert", list => {
    for (const c of list || []) {
      const lid = c?.lid || c?.id;
      if (!lid) continue;
      const phoneJid = c?.jid || (typeof c?.phoneNumber === "string" ? `${c.phoneNumber.replace(/\D/g, "")}@s.whatsapp.net` : undefined) || lidMap.resolve(lid) || undefined;
      contacts[lid] = { ...(contacts[lid] || {}), ...c, id: c.id, lid: c.lid || c.id, jid: phoneJid };
      if (phoneJid && lidMap.isLid(lid)) lidMap.learn({ lid, jid: phoneJid });
      safeWrite("contact", () => q.putContacts.run(String(lid), str(contacts[lid])));
    }
  });

  ev.on("messages.update", updates => {
    for (const u of updates) {
      const chat = u.key?.remoteJid;
      if (!chat) continue;
      if (u.update === "delete") {
        if (messages[chat]) messages[chat].array = messages[chat].array.filter(m => m.key?.id !== u.key.id);
        safeWrite("msgDelete", () => q.delMsg.run(String(chat), String(u.key.id)));
        continue;
      }
      const prev = messages[chat]?.array?.find(m => m.key?.id === u.key.id);
      storeMessage({ ...(prev || { key: u.key }), ...u, messageTimestamp: u.messageTimestamp });
    }
  });

  ev.on("messages.delete", ({ keys }) => {
    for (const k of keys || []) {
      if (!k?.remoteJid || !k?.id) continue;
      const bucket = messages[k.remoteJid];
      if (bucket) bucket.array = bucket.array.filter(m => m.key?.id !== k.id);
      safeWrite("msgDelete", () => q.delMsg.run(String(k.remoteJid), String(k.id)));
    }
  });

  ev.on("chats.update", updates => {
    for (const c of updates) {
      if (!c?.id) continue;
      chats[c.id] = { ...(chats[c.id] || {}), ...c, conversationTimestamp: c.conversationTimestamp || chats[c.id]?.conversationTimestamp };
      safeWrite("chat", () => q.putChats.run(String(c.id), str(chats[c.id])));
    }
  });

  ev.on("chats.delete", deletions => {
    for (const d of deletions) {
      if (!d?.id) continue;
      delete chats[d.id];
      safeWrite("chat", () => q.delChats.run(String(d.id)));
    }
  });

  ev.on("contacts.update", updates => {
    for (const c of updates) {
      const lid = c?.lid || c?.id;
      if (!lid) continue;
      
      const phoneJid = c?.jid || (typeof c?.phoneNumber === "string" ? `${c.phoneNumber.replace(/\D/g, "")}@s.whatsapp.net` : undefined) || lidMap.resolve(lid) || undefined;
      contacts[lid] = { ...(contacts[lid] || {}), ...c, id: c.id, lid: c.lid || c.id, jid: phoneJid };
      if (phoneJid && lidMap.isLid(lid)) lidMap.learn({ lid, jid: phoneJid });
      safeWrite("contact", () => q.putContacts.run(String(lid), str(contacts[lid])));
    }
  });

  ev.on("groups.update", updates => {
    for (const g of updates) {
      if (!g?.id) continue;
      allgroup[g.id] = g;
      safeWrite("group", () => q.putGroups.run(String(g.id), str(g)));
    }
  });

  ev.on("labels.update", updates => {
    for (const l of updates) {
      if (!l?.id) continue;
      labels[l.id] = l;
      safeWrite("label", () => q.putLabels.run(String(l.id), str(l)));
    }
  });

  ev.on("labelAssociations.update", updates => {
    for (const a of updates) {
      if (!a?.id) continue;
      labelAssociations[a.id] = a;
      safeWrite("labelAssoc", () => q.putAssoc.run(String(a.id), str(a)));
    }
  });
};

const snapshot = () => ({ chats, contacts, messages, labels, labelAssociations });

const migrateIfNeeded = () => {
 const legacy = path.join(__dirname, "../data/store/store.json");
  if (!fs.existsSync(legacy)) return;
  try {
    const raw = JSON.parse(fs.readFileSync(legacy, "utf8"));
    for (const [id, c] of Object.entries(raw.chats || {})) {
      chats[id] = c;
      q.putChats.run(id, str(c));
    }
    for (const [id, c] of Object.entries(raw.contacts || {})) {
      contacts[id] = c;
      q.putContacts.run(id, str(c));
    }
    for (const [chat, entry] of Object.entries(raw.messages || {})) {
      for (const m of entry?.array || []) storeMessage(m);
    }
    for (const [id, l] of Object.entries(raw.labels || {})) {
      labels[id] = l;
      q.putLabels.run(id, str(l));
    }
    fs.renameSync(legacy, `${legacy}.migrated`);
    console.log("✅ migrated store.json -> store.db");
  } catch (err) {
    console.log("store.json migration skipped:", err.message);
  }
};
migrateIfNeeded();

Object.defineProperty(chats, "all", { value: () => Object.values(chats), enumerable: false });

module.exports = {
  bind,
  loadMessage,
  upsertMessage,
  snapshot,
  contacts,
  messages,
  chats,
  allgroup,
  labels,
  labelAssociations,
  db,
  dbPath
};
