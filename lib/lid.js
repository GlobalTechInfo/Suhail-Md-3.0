const lidToJid = new Map();
const numberToLid = new Map();

/** Bare phone number from anything: "…:91@s.whatsapp.net", "+92 305…", "923…". */
const bare = v => String(v ?? "").split("@")[0].split(":")[0].replace(/\D/g, "");

const digits = v => String(v ?? "").replace(/\D/g, "");

const normalizeJid = jid => {
  if (!jid) return "";
  try {
    return require("@whiskeysockets/baileys").jidNormalizedUser(String(jid));
  } catch (err) {
    return String(jid).split("@")[0].split(":")[0] + "@" + String(jid).split("@")[1];
  }
};

let db = null;
try {
  const { DatabaseSync } = require("node:sqlite");
  const path = require("path");
  const fs = require("fs");
  const dir = path.dirname(path.join(__dirname, "../data/lid/lidmap.db"));
  fs.mkdirSync(dir, { recursive: true });
  db = new DatabaseSync(path.join(dir, "lidmap.db"));
  db.exec("PRAGMA journal_mode = WAL");
  db.exec("CREATE TABLE IF NOT EXISTS lidmap (lid TEXT PRIMARY KEY, jid TEXT NOT NULL, num TEXT NOT NULL)");
  const ins = db.prepare("INSERT OR REPLACE INTO lidmap (lid, jid, num) VALUES (?, ?, ?)");
  
  for (const r of db.prepare("SELECT lid, jid FROM lidmap").all()) {
    const key = normalizeJid(r.lid);
    const value = normalizeJid(r.jid);
    if (!key || !value) continue;
    lidToJid.set(key, value);
    numberToLid.set(bare(value), key);
    if (key !== r.lid || value !== r.jid) {
      try {
        db.prepare("DELETE FROM lidmap WHERE lid = ?").run(r.lid);
      } catch (err) {}
    }
  }
  db._ins = ins;
} catch (err) {
  db = null;
  const report = typeof global.log === "function" ? global.log : console.error;
  report("[lid-map] persistence disabled:", err && err.message);
}

const isPhoneJid = jid => /@(s\.whatsapp\.net|c\.us)$/i.test(String(jid));

const remember = (lid, jid) => {
  if (!lid || !jid) return;
  
  const key = normalizeJid(lid);
  const value = normalizeJid(jid);
  if (!/@lid$/i.test(key)) return;
  if (!isPhoneJid(value)) return;
  lidToJid.set(key, value);
  numberToLid.set(bare(value), key);
  try {
    db?._ins?.run(key, value, bare(value));
  } catch {}
};

/** Learn from a Contact / GroupParticipant shaped object. */
const learn = c => {
  if (!c) return;
  remember(c.lid, c.jid);
 
  if (c.id && c.jid) remember(c.id, c.jid);
  
  if (c.lid && c.phoneNumber) remember(c.lid, String(c.phoneNumber).includes("@") ? c.phoneNumber : `${digits(c.phoneNumber)}@s.whatsapp.net`);
};

const learnAll = list => (Array.isArray(list) ? list : []).forEach(learn);

/** Resolve a jid to its phone jid when known. Falls back to the input. */
const resolve = jid => {
  if (!jid || !isLid(jid)) return jid;
  return lidToJid.get(normalizeJid(jid)) || jid;
};

/** Resolve if we know it, otherwise hand back the phone jid unchanged. */
const resolveOrSelf = jid => resolve(jid) || jid;

const isLid = jid => Boolean(jid && /@lid$/i.test(normalizeJid(jid)) || /@lid$/i.test(String(jid)));

/**
 * The phone number behind a jid, or the raw id when unknown.
 * This is what creator / owner checks must use.
 */
const numberOf = jid => {
  const resolved = resolve(jid);
  return String(resolved).split("@")[0].split(":")[0] || String(jid);
};

/**
 * Human-facing number for a jid. Prefers the resolved phone number, falls back to the LID.
 * Use this for display so we never print a raw `@lid` to a user.
 */
const displayJid = jid => {
  if (!jid) return "";
  const resolved = resolve(jid);
  if (!isLid(resolved)) return String(resolved).split("@")[0];
  return String(jid).split("@")[0];
};

/** True when `jid` is, or resolves to, `phone`. */
const matchesNumber = (jid, phone) => {
  if (!jid) return false;
  const want = digits(phone);
  if (!want) return false;
  return numberOf(jid) === want || bare(resolve(jid)) === want;
};

/** Seed the owner's own LIDs so DM-based creator checks work before any group is touched. */
const seedNumbers = async (sock, numbers) => {
  const wanted = [...new Set((numbers || []).map(bare).filter(Boolean))];
  const missing = wanted.filter(n => !numberToLid.has(n));
  if (!sock?.onWhatsApp || !missing.length) return;
  try {
    const res = await sock.onWhatsApp(...missing);
    learnAll(res);
  } catch {
    // Offline / not entitled — fall back to whatever we already learned.
  }
};

/** All known phone jids for a list of numbers (used to seed owners from config). */
const knownFor = numbers => (numbers || []).map(bare).filter(Boolean).map(n => lidToJid.get(numberToLid.get(n))).filter(Boolean);

/**
 * Turn "@123…" tokens in text into jids WITHOUT corrupting LIDs.
 * A LID such as `@12927918694546` is 14 digits and used to be silently rewritten into
 * `12927918694546@s.whatsapp.net`, a jid that does not exist.
 */
const mentionJid = digitsStr => {
  const d = String(digitsStr || "").replace(/\D/g, "");
  if (!d) return d + "@s.whatsapp.net";
  
  if (numberToLid.has(d)) return numberToLid.get(d);
  
  if (lidToJid.size && [...lidToJid.values()].some(j => String(j).split("@")[0] === d)) return d + "@s.whatsapp.net";
  return d + "@s.whatsapp.net";
};

const size = () => lidToJid.size;
const all = () => Object.fromEntries(lidToJid);

module.exports = {
  learn,
  learnAll,
  resolve,
  resolveOrSelf,
  numberOf,
  displayJid,
  matchesNumber,
  isLid,
  isPhoneJid,
  seedNumbers,
  knownFor,
  mentionJid,
  size,
  all,
  bare,
  digits
};
