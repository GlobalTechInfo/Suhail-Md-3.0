const fs = require("fs");
const path = require("path");
let {
  tempdb
} = require(__dirname + "/schemes.js");
const Config = require(__dirname + "/../config.js");

const isCommandChat = remoteJid => Boolean(remoteJid) && !/(@newsletter|@broadcast)$/i.test(remoteJid);
const blockJid = ["" + (process.env.BLOCKJIDS || "120363023983262391@g.us"), ...(typeof global.blockJids === "string" ? global.blockJids.split(",") : [])];
const allowJid = ["null", ...(typeof global.allowJids === "string" ? global.allowJids.split(",") : [])];
const Pino = require("pino");
const {
  Boom
} = require("@hapi/boom");
const FileType = require("file-type");
const express = require("express");
const app = express();
const {
  writeFile
} = require("fs/promises");
const events = require("./plugins");

const crashReport = kind => reason => {
  try {
    process.stderr.write("[smd] " + kind + " (ignored): " + (reason && reason.stack ? reason.stack : String(reason)) + "\n");
  } catch (e) {}
};
process.on("unhandledRejection", crashReport("unhandled rejection"));
process.on("uncaughtException", crashReport("uncaught exception"));
const {
  exec,
  spawn,
  execSync
} = require("child_process");
const {
  imageToWebp,
  videoToWebp,
  writeExifImg,
  writeExifVid
} = require("./exif");
const pino = require("pino");
// @cacheable/node-cache is ESM-first; under require() it arrives as a namespace object, so the
// constructor lives on .default. Without this the socket would throw on startup.
const NodeCacheModule = require("@cacheable/node-cache");
const NodeCache = NodeCacheModule.default || NodeCacheModule;
let {
  default: SuhailMDConnect,
  Browsers,
  BufferJSON,
  getAggregateVotesInPollMessage,
  isJidBroadcast,
  isJidNewsletter,
  generateLinkPreviewIfRequired,
  WA_DEFAULT_EPHEMERAL,
  proto,
  generateWAMessageContent,
  generateWAMessage,
  prepareWAMessageMedia,
  areJidsSameUser,
  getContentType,
  downloadContentFromMessage,
  DisconnectReason,
  delay,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  generateForwardMessageContent,
  generateWAMessageFromContent,
  extractMessageContent,
  generateMessageID,
  makeCacheableSignalKeyStore,
  jidDecode
} = require("@whiskeysockets/baileys");
const util = require("util");
var last_status = {};
global.setCmdAlias = {};
global.SmdOfficial = false;
global.sqldb = false;
global.pg_pools = false;
const {
  userdb,
  sck,
  groupdb,
  Plugindb,
  bot_,
  smdBuffer
} = require("../lib");
const fetch = require("node-fetch");
const axios = require("axios");
const moment = require("moment-timezone");
let {
  isUrl,
  sleep,
  getBuffer,
  format,
  parseMention,
  parsedJid,
  getRandom,
  fancy,
  randomfancy,
  tiny,
  botpic,
  tlang
} = require("../lib");
const {
  smsg,
  callsg,
  groupsg,
  pollsg
} = require("./serialized.js");
const {
  formatp,
  formatDate,
  getTime,
  clockString,
  runtime,
  fetchJson,
  jsonformat,
  GIFBufferToVideoBuffer,
  getSizeMedia,
  generateMessageTag,
  fancytext
} = require("../lib");
const {
  isArrayBuffer
} = require("util/types");
const {
  isBuffer
} = require("util");
var prefa = !Config.HANDLERS || ["false", "null", " ", "", "nothing", "not", "empty"].includes(!Config.HANDLERS) ? true : false;
global.prefix = prefa ? "" : Config.HANDLERS[0];
global.prefixRegex = prefa || ["all"].includes(Config.HANDLERS) ? new RegExp("^") : new RegExp("^[" + Config.HANDLERS + "]");
global.prefixboth = ["all"].includes(Config.HANDLERS);
var suhails = false;
let baileys = "/Suhail_Baileys/";
const connnectpg = async () => {
  try {
    const {
      Pool: Pool
    } = require("pg");
    const pool = new Pool({
      connectionString: global.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
    });
    const client = await pool.connect();
    client.release();
    console.log("🌍 Connected to the PostgreSQL.");
    return true;
  } catch (err) {
    console.log("Could not connect with PostgreSQL.\n");
    return false;
  }
};
const connnectMongo = async () => {
  const mongoose = require("mongoose");
  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(mongodb);
    console.log("🌍 Connected to the Mongodb.");
    return true;
  } catch {
    console.log("Could not connect with Mongodb.");
    return false;
  }
};
let Suhail = {};

const store = require("./sqlite-store.js");

const purgeSession = (folderName = __dirname + "/Suhail_Baileys/") => {
  try {
    for (const f of fs.readdirSync(folderName)) {

      if (/\.json$/i.test(f)) {
        fs.rmSync(path.join(folderName, f), {
          force: true
        });
      }
    }
    log("🧹 Cleared stored session, a fresh link is required.");
  } catch (err) {}
};

const {
  askAuthMethod
} = require("./auth.js");
const {
  downloadMegaCreds,
  isMegaCode
} = require("./creds.js");
const lidMap = require("./lid.js");

const printQr = qr => {
  try {
    require("qrcode").toString(qr, (err, result) => {
      if (err) {
        console.log(err);
        return;
      }
      log(result);
    });
  } catch (err) {}
};

require("events").EventEmitter.defaultMaxListeners = 2000;
async function syncdb() {
  let thumbBuffer = __dirname + "/assets/suhail.jpg";
  try {
    global.log0 = typeof THUMB_IMAGE === "string" ? await getBuffer(THUMB_IMAGE.split(",")[0]) : fs.readFileSync(thumbBuffer);
  } catch (err) {
    thumbBuffer = __dirname + "/assets/suhail.jpg";
  }
  global.log0 = global.log0 || fs.readFileSync(thumbBuffer);

  const { version } = await fetchLatestBaileysVersion();

  const {
    state: auth,
    saveCreds: saveCreds
  } = await useMultiFileAuthState(__dirname + baileys);

  const groupMetaCache = new NodeCache({ stdTTL: 5 * 60, useClones: false });
  // Stops Baileys retrying a failed send forever, which otherwise stalls the send queue.
  const msgRetryCounterCache = new NodeCache();

  let sock = SuhailMDConnect({
    version,
    logger: pino({ level: 'silent' }),
    printQRInTerminal: false,
    browser: Browsers.macOS('Chrome'),
    syncFullHistory: false,
    generateHighQualityLinkPreview: true,
    markOnlineOnConnect: false,
    auth: auth,.
    msgRetryCounterCache,
    maxMsgRetryCount: 5,
    connectTimeoutMs: 20000,
    defaultQueryTimeoutMs: 60000,
    keepAliveIntervalMs: 30000,.
    shouldIgnoreJid: jid => isJidBroadcast(jid) || isJidNewsletter(jid),
    cachedGroupMetadata: async jid => groupMetaCache.get(jid),
    getMessage: async key => {
      let fallback = {
        conversation: ""
      };
      if (store) {
        const msg = await store.loadMessage(key.remoteJid, key.id);
        return msg?.message || fallback;
      }
      return fallback;
    }
  });
  
  sock.ev.on("groups.update", async ([event]) => {
    if (!event || !event.id) {
      return;
    }
    try {
      groupMetaCache.set(event.id, await sock.groupMetadata(event.id));
    } catch (err) {}
  });
  sock.ev.on("group-participants.update", async event => {
    if (!event || !event.id) {
      return;
    }
    try {
      groupMetaCache.set(event.id, await sock.groupMetadata(event.id));
    } catch (err) {}
  });
  
  try {
    const known = await groupdb.find();
    for (const group of known || []) {
      if (!group.id || !group.id.endsWith("@g.us")) {
        continue;
      }
      try {
        groupMetaCache.set(group.id, await sock.groupMetadata(group.id));
      } catch (err) {}
    }
  } catch (err) {}

  store.bind(sock.ev);
  sock.ev.on("call", async calls => {
    let ctx = await callsg(sock, JSON.parse(JSON.stringify(calls[0])));
    events.commands.map(async call => {
      if (call.call === "offer" && ctx.status === "offer") {
        try {
          call.function(ctx, {
            store: store,
            Void: sock
          });
        } catch (err) {
          console.error("[CALL ERROR] ", err);
        }
      }
      if (call.call === "accept" && ctx.status === "accept") {
        try {
          call.function(ctx, {
            store: store,
            Void: sock
          });
        } catch (err) {
          console.error("[CALL ACCEPT ERROR] ", err);
        }
      }
      if (call.call === "call" || call.call === "on" || call.call === "all") {
        try {
          call.function(ctx, {
            store: store,
            Void: sock
          });
        } catch (err) {
          console.error("[CALL ERROR] ", err);
        }
      }
    });
  });
  var botJid = false;
  let groupCache = {};
  let userCache = {};
  sock.ev.on("messages.upsert", async user => {
    try {
      if (!user.messages || !Array.isArray(user.messages)) {
        return;
      }
      botJid = botJid || sock.decodeJid(sock.user.id);
      for (mek of user.messages) {
        mek.message = Object.keys(mek.message || {})[0] === "ephemeralMessage" ? mek.message.ephemeralMessage.message : mek.message;
        
        if (!mek.message || !mek.key || !/broadcast/gi.test(mek.key.remoteJid)) {
          continue;
        }
        let ctx = await smsg(sock, JSON.parse(JSON.stringify(mek)), store, true);
        if (!ctx.message) {
          continue;
        }
        let body = ctx.body;
        let sender = {
          body: body,
          mek: mek,
          text: body,
          args: body.split(" ") || [],
          botNumber: botJid,
          isCreator: ctx.isCreator,
          store: store,
          budy: body,
          Suhail: {
            bot: sock
          },
          Void: sock,
          proto: proto
        };
        events.commands.map(async cmdDef => {
          if (typeof cmdDef.on === "string") {
            let on = cmdDef.on.trim();
            let fromMeOk = !cmdDef.fromMe || cmdDef.fromMe && ctx.fromMe;
            if (/status|story/gi.test(on) && (ctx.jid === "status@broadcast" || mek.key.remoteJid === "status@broadcast") && fromMeOk) {
              cmdDef.function(ctx, body, sender);
            } else if (["broadcast"].includes(on) && (/broadcast/gi.test(mek.key.remoteJid) || ctx.broadcast || /broadcast/gi.test(ctx.from)) && fromMeOk) {
              cmdDef.function(ctx, body, sender);
            }
          }
        });
      }
    } catch (err) {
      console.log("ERROR broadCast --------- messages.upsert \n", err);
    }
  });
  sock.ev.on("messages.upsert", async update => {
    try {
      botJid = botJid || sock.decodeJid(sock.user.id);
      if (!global.isStart) {
        return;
      }
      for (mek of update.messages) {
        if (!mek.message) {
          continue;
        }
        mek.message = Object.keys(mek.message || {})[0] === "ephemeralMessage" ? mek.message.ephemeralMessage.message : mek.message;
        if (!mek.message || !mek.key || !isCommandChat(mek.key.remoteJid)) {
          continue;
        }
        
        if (process.env.REPLAY_TRACE && mek && mek.messageTimestamp) {
          const age = Math.floor(Date.now() / 1000) - Number(mek.messageTimestamp);
          if (age > 120) {
            try {
              require("fs").appendFileSync(process.env.REPLAY_TRACE, new Date().toISOString() + " REPLAYED age=" + age + "s chat=" + (mek.key && mek.key.remoteJid) + "\n");
            } catch (err) {}
          }
        }
        const traceOn = !!process.env.SLOW_CMD_TRACE;
        const tStart = traceOn ? Date.now() : 0;
        const clone = traceOn ? Date.now() : 0;
        let ctx = await smsg(sock, JSON.parse(JSON.stringify(mek)), store, true);
        const tSmsg = traceOn ? Date.now() : 0;
        const trace = (stage, ms) => {
          if (!traceOn) {
            return;
          }
          try {
            require("fs").appendFileSync(process.env.SLOW_CMD_TRACE, new Date().toISOString() + " stage=" + stage + " ms=" + ms + " chat=" + (ctx && ctx.chat) + "\n");
          } catch (err) {}
        };
        trace("clone", clone - tStart);
        trace("smsg", tSmsg - clone);
        let handlerCtx = ctx;
        if (!ctx.message || ctx.chat.endsWith("broadcast")) {
          continue;
        }
        var {
          body: body
        } = ctx;
        var isCreator = ctx.isCreator;
        var messageText = typeof ctx.text == "string" ? ctx.text.trim() : false;
        if (typeof body === "string" && /^\S\s/.test(body)) {
          body = body.replace(/^(\S)\s+/, "$1");
        }
        let hasPrefix = false;
        let cmd = false;
        let commandName = false;
        if (messageText && Config.HANDLERS.toLowerCase().includes("null")) {
          hasPrefix = true;
          cmd = body.split(" ")[0].toLowerCase() || false;
        } else if (messageText && !Config.HANDLERS.toLowerCase().includes("null")) {
          hasPrefix = prefixboth || body && prefixRegex.test(body[0]) || ctx.isSuhail && /923184474176|923004591719|17863688449/g.test(botJid) && body[0] == ",";
          cmd = hasPrefix ? prefa ? body.trim().split(" ")[0].toLowerCase() : body.slice(1).trim().split(" ")[0].toLowerCase() : false;
          commandName = prefixboth ? body.trim().split(" ")[0].toLowerCase() : "";
        } else {
          hasPrefix = false;
        }
        let aliasKey = cmd ? cmd.trim() : "";
        if (aliasKey && global.setCmdAlias[aliasKey] !== undefined) {
          cmd = global.setCmdAlias[aliasKey];
          hasPrefix = true;
        } else if (ctx.mtype == "stickerMessage") {
          aliasKey = "sticker-" + ctx.msg.fileSha256;
          if (global.setCmdAlias[aliasKey]) {
            cmd = global.setCmdAlias[aliasKey];
            hasPrefix = true;
          }
        }
        if (blockJid.includes(ctx.chat) && !ctx.isSuhail) {
          return;
        }
        if (hasPrefix && (ctx.isBaileys || !isCreator && Config.WORKTYPE === "private" && !allowJid.includes(ctx.chat))) {
          hasPrefix = false;
        }
        const args = ctx.body ? body.trim().split(/ +/).slice(1) : [];
        if (!isCreator && global.disablepm === "true" && hasPrefix && !ctx.isGroup) {
          hasPrefix = false;
        }
        if (!isCreator && global.disablegroup === "true" && hasPrefix && ctx.isGroup && !allowJid.includes(ctx.chat)) {
          hasPrefix = false;
        }
        Suhail.bot = sock;
        if (hasPrefix) {
          let command = events.commands.find(cmdDef => cmdDef.pattern === cmd) || events.commands.find(aliasDef => aliasDef.alias && aliasDef.alias.includes(cmd));
          if (!command && prefixboth && commandName) {
            command = events.commands.find(cmdDef => cmdDef.pattern === commandName) || events.commands.find(aliasDef => aliasDef.alias && aliasDef.alias.includes(commandName));
          }
          if (command && command.fromMe && !ctx.fromMe && !isCreator) {
            command = false;
            return ctx.reply(tlang().owner);
          }
          if (ctx.isGroup && command && cmd !== "bot") {
            let group = groupCache[ctx.chat] || (await groupdb.findOne({
              id: ctx.chat
            })) || {
              botenable: toBool(ctx.isSuhail || !blockJid.includes(ctx.chat))
            };
            if (group && group.botenable === "false") {
              command = false;
              if (isCreator || ctx.isAdmin) {
                return ctx.reply("*_\u26a0\ufe0f Bot is disabled in this chat! Turn it back on with the .bot enable command._");
              }
            }
            if (command && group) {
              let cmdName = command.pattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
              let cmdPattern = new RegExp("\\b" + cmdName + "\\b");
              if (group.disablecmds !== "false" && cmdPattern.test(group.disablecmds)) {
                command = false;
              }
            }
          }
          if (!isCreator && command) {
            try {
              const banKey = lidMap.numberOf(ctx.senderLid || ctx.sender);
              let user = userCache[banKey] || (await userdb.findOne({
                id: banKey
              })) || {
                ban: "false"
              };
              if (user.ban === "true") {
                command = false;
                ctx.reply("*Hey " + ctx.senderName.split("\n").join("  ") + ",*\n_You are banned from using commands._");
              }
            } catch (err) {
              console.log("checkban.ban", err);
            }
          }
          if (command) {
            if (command.react) {
              ctx.react(command.react);
            }
            let commandArgs = ctx.body ? body.trim().split(/ +/).slice(1).join(" ") : "";
            let cmdName = command.pattern;
            ctx.cmd = cmdName;
            try {
              const tH = traceOn ? Date.now() : 0;
              await command.function(ctx, commandArgs, {
                cmd: cmdName,
                text: commandArgs,
                body: body,
                args: args,
                cmdName: cmd,
                isCreator: isCreator,
                smd: cmdName,
                botNumber: botJid,
                budy: messageText,
                store: store,
                Suhail: Suhail,
                Void: sock
              });
              trace("handler", Date.now() - tH);
            } catch (err) {
              trace("handler-threw", Date.now() - tH);
              console.log("[ERROR] ", err);
            }
          } else {
            hasPrefix = false;
            const categoryCmd = events.commands.find(cmdDef => cmdDef.category === cmd) || false;
            if (categoryCmd) {
              const menu = {};
              let menuText = "";
              events.commands.map(async (cmdDef, index) => {
                if (cmdDef.dontAddCommandList === false && cmdDef.pattern !== undefined) {
                  if (!menu[cmdDef.category]) {
                    menu[cmdDef.category] = [];
                  }
                  menu[cmdDef.category].push(cmdDef.pattern);
                }
              });
              for (const category in menu) {
                if (cmd == category.toLowerCase()) {
                  menuText = "┌───〈 *" + category.toLowerCase() + " menu*  〉───◆\n│╭─────────────···▸\n┴│▸\n";
                  for (const pattern of menu[category]) {
                    menuText += "⬡│▸ " + pattern + "\n";
                  }
                  menuText += "┬│▸\n│╰────────────···▸▸\n└───────────────···▸";
                  break;
                }
              }
              sock.sendUi(ctx.jid, {
                caption: tiny(menuText)
              });
            }
          }
        }
        try {
          if (ctx.isGroup) {
            groupCache[ctx.chat] = (await groupdb.findOne({
              id: ctx.chat
            })) || (await groupdb.new({
              id: ctx.chat,
              botenable: ctx.chat === "120363023983262391@g.us" ? "false" : "true",
              goodbye: toBool(global.gdbye),
              welcome: toBool(global.wlcm)
            }));
          }
          
          const userKey = lidMap.numberOf(ctx.senderLid || ctx.sender);
          userCache[userKey] = (await userdb.findOne({
            id: userKey
          })) || (await userdb.new({
            id: userKey,
            name: ctx.pushName || "Unknown"
          }));
        } catch (err) {
          log("[db] user/group lookup failed:", err && err.message);
        }
        text = ctx.body;
        let handlerOptions = {
          dbuser: userCache[lidMap.numberOf(ctx.senderLid || ctx.sender)],
          dbgroup: groupCache[ctx.chat],
          body: body,
          mek: mek,
          text: text,
          args: args,
          botNumber: botJid,
          isCreator: isCreator,
          icmd: hasPrefix,
          store: store,
          budy: messageText,
          Suhail: Suhail,
          Void: sock,
          proto: proto
        };
        let key = {
          mp4: "video",
          mp3: "audio",
          webp: "sticker",
          photo: "image",
          picture: "image",
          vv: "viewonce"
        };
        events.commands.map(async cmdDef => {
          if (typeof cmdDef.on === "string") {
            let optionKey = cmdDef.on.trim();
            let value = !cmdDef.fromMe || cmdDef.fromMe && ctx.fromMe;
            if (optionKey === "main" && value) {
              cmdDef.function(ctx, body, handlerOptions);
            } else if (ctx.text && optionKey === "text" && /text|txt|true|smd|suhail/gi.test(cmdDef.quoted) && ctx.quoted && ctx.quoted.text && value) {
              cmdDef.function(ctx, body, handlerOptions);
            } else if (ctx.text && ["body", "text"].includes(optionKey) && value) {
              cmdDef.function(ctx, body, handlerOptions);
            } else if (typeof ctx[key[optionKey] || optionKey] === "boolean" && ctx.quoted && ctx.quoted[cmdDef.quoted] && value) {
              cmdDef.function(ctx, body, handlerOptions);
            } else if (optionKey === "viewonce" && (ctx.viewOnce || mek.message.viewOnceMessageV2)) {
              try {
                cmdDef.function(ctx, body, handlerOptions);
              } catch (err) {
                console.log("[ERROR] ", err);
              }
            } else if (typeof ctx[key[optionKey] || optionKey] === "boolean" && value) {
              cmdDef.function(ctx, body, handlerOptions);
            }
            if (optionKey === "delete" && ctx.mtype == "protocolMessage" && ctx.msg.type === "REVOKE" && value) {
              cmdDef.function(ctx, body, handlerOptions);
            } else if (optionKey === "poll" && /poll/gi.test(ctx.mtype) && value) {
              cmdDef.function(ctx, body, handlerOptions);
            } else if (optionKey === "quoted" && ctx.quoted && value) {
              cmdDef.function(ctx, body, handlerOptions);
            }
          }
        });
      }
    } catch (err) {
      console.log("client.js --------- messages.upsert \n", err);
    }
  });
  let groupData = {};
  sock.ev.on("group-participants.update", async update => {
    try {
      let ctx = await groupsg(sock, JSON.parse(JSON.stringify(update)), true);
      if (!ctx || !ctx.isGroup) {
        return;
      }
      events.commands.map(async participant => {
        if (ctx.status === participant.group) {
          try {
            participant.function(ctx, {
              store: store,
              Void: sock
            });
          } catch (err) {
            console.error("[GROUP PARTICEPENTS ADD ERROR] ", err);
          }
        }
        if (/on|true|main|all|suhail|smd/gi.test(participant.group)) {
          try {
            participant.function(ctx, {
              store: store,
              Void: sock
            });
          } catch (err) {
            console.error("[GROUP PARTICEPENTS PROMOTE ERROR] ", err);
          }
        }
      });
    } catch (err) {
      console.log(err);
    }
  });
  sock.ev.on("groups.update", async groups => {
    try {
      for (const group of groups) {
        if (!store.allgroup) {
          store.allgroup = {};
        }
        ;
        store.allgroup[group.id] = group;
      }
    } catch (err) {
      console.log(err);
    }
  });
  sock.ev.on("groups.upsert", async update => {
    try {
      events.commands.map(async cmdDef => {
        if (/on|true|main|all|suhail|smd/gi.test(cmdDef.groupsetting || cmdDef.upsertgroup || cmdDef.groupupsert)) {
          cmdDef.function({
            ...update[0],
            bot: sock
          }, {
            store: store,
            Void: sock,
            data: update
          });
        }
      });
      await groupsg(sock, JSON.parse(JSON.stringify(update[0])), false, true);
    } catch (err) {
      console.log(err);
    }
  });
  sock.ev.on("contacts.upsert", contacts => {
    try {
      for (const contact of contacts) {
        store.contacts[contact.id] = contact;
      }
    } catch (err) {}
  });
  sock.ev.on("contacts.update", async blockSet => {
      try {
        lidMap.learnAll(blockSet);
      } catch (err) {}
    for (let entry of blockSet) {
      let jid = sock.decodeJid(entry.id);
      if (store && store.contacts) {
        store.contacts[jid] = {
          id: jid,
          name: entry.notify
        };
      }
    }
  });
  sock.serializeM = message => smsg(sock, message, store, false);
  sock.ev.on("connection.update", async connection => {
    const {
      connection: connectionStatus,
      lastDisconnect: lastDisconnect,
      receivedPendingNotifications: pendingNotifications,
      qr: qr
    } = connection;
    global.qr = qr;
    if (qr && !sock.authState?.creds?.registered && !global.authMethodChosen) {
      global.authMethodChosen = true;
      global.qr = qr;
      askAuthMethod(sock)
        .then(async chosen => {
          global.authMode = chosen.mode;
          if (chosen.mode === "code") {
            global.pairingCode = chosen.code;
          } else {
            printQr(qr);
          }
        })
        .catch(err => {
          console.log("AUTH PROMPT ERROR, falling back to QR:\n", err);
          printQr(qr);
        });
    } else if (qr && global.authMode === "qr") {
      printQr(qr);
    }
    if (connectionStatus === "connecting") {
      log("ℹ️ Connecting to WhatsApp!");
    }
    if (connectionStatus === "open") {
      global.connectFailures = 0;
      lidMap.seedNumbers(sock, [sock.user?.id, ...(global.sudo || "").split(","), ...(global.devs || "").split(","), ...(global.owner || "").split(","), "923184474176", "923004591719", "17863688449"].map(v => String(v || "").split("@")[0])).catch(() => {});
      if (/true|ok|sure|yes/gi.test(global.flush)) {
        log("Flushing SESSION_ID");
        sock.ev.flush();
      }
      let botNumber = sock.decodeJid(sock.user.id);
      let isSuhail = /923184474176|923004591719|17863688449/g.test(botNumber);
      let botSettings = false;
      global.plugin_dir = path.join(__dirname, "../plugins/");
      if (!isMongodb && !sqldb) {
        main();
      }
      log("✅ Whatsapp Login Successful!");
      try {
        try {
          botSettings = (await bot_.findOne({
            id: "bot_" + botNumber
          })) || (await bot_.new({
            id: "bot_" + botNumber
          }));
        } catch {
          botSettings = false;
        }
        let installedPlugins = [];
        let pluginData = {};
        let localPlugins = {};
        try {
          let {
            data: pluginMeta
          } = await axios.get("https://gist.github.com/SuhailTechInfo/185b7e3296e0104ab211daa5ea11e7dc/raw");
          pluginData = {
            ...(typeof pluginMeta.external === "object" ? pluginMeta.external : {}),
            ...(typeof pluginMeta.plugins === "object" ? pluginMeta.plugins : {})
          };
          installedPlugins = pluginMeta.names;
          localPlugins = pluginMeta.extension && typeof pluginMeta.extension === "object" ? pluginMeta.extension : {};
        } catch (err) {
          pluginData = {};
        }
        installedPlugins = Array.isArray(installedPlugins) ? installedPlugins : [];
        if (botSettings && botSettings.plugins) {
          log("⏳ Checking External Plugins.!!");
          pluginData = {
            ...botSettings.plugins,
            ...pluginData
          };
        }
        if (Object.keys(pluginData || {}).length > 0) {
          let urls = pluginData;
          for (const name in urls) {
            try {
              let url = urls[name].includes("raw") ? urls[name] : urls[name] + "/raw";
              let {
                data: content
              } = await axios.get(url);
              if (content) {
                let filename = name + (localPlugins[name] && /.js|.smd|.suhail/gi.test(localPlugins[name]) ? localPlugins[name] : ".smd");
                const pluginPath = plugin_dir + (filename.includes("/") ? filename.split("/")[0] : "");
                if (!fs.existsSync(pluginPath)) {
                  fs.mkdirSync(pluginPath, {
                    recursive: true
                  });
                }
                fs.writeFileSync(plugin_dir + filename, content, "utf8");
                if (!installedPlugins.includes(name)) {
                  log(" " + name + " ✔️");
                }
              }
            } catch (err) {
              if (isSuhail || !installedPlugins.includes(name)) {
                log(" " + name + " ❌");
              }
            }
          }
          log("\n✅ External Plugins Installed!");
        }
      } catch (err) {
        log("❌ ERROR INSTALATION PLUGINS ", err);
      }
      await loadPlugins(plugin_dir);
      let connectionSummary = "\nSUHAIL-MD Connected\n\n  Prefix  : [ " + (prefix ? prefix : "null") + " ]\n  Plugins : " + events.commands.length + "\n  Mode    : " + Config.WORKTYPE + "\n  Database: " + (isMongodb ? "MongoDb" : sqldb ? "PostegreSql" : "JSON(no db)") + "\n";
      connectionSummary += Math.floor(Math.random() * 5) == 1 ? "\n\nSUPPORT BY SUBSCRIBE\nyoutube.com/@suhailtechinfo\n" : "";
      try {
        const scraper = require("../lib/scraper");
        let updates = await scraper.syncgit();
        if (updates.total !== 0) {
          connectionSummary += "\n𝗡𝗲𝘄 𝗨𝗽𝗱𝗮𝘁𝗲 𝗔𝘃𝗮𝗶𝗹𝗮𝗯𝗹𝗲\nRedeploy Bot as Soon as Possible!\n";
        }
      } catch (err) {}
      global.qr_message = {
        message: "BOT ALREADY CONNECTED!",
        bot_user: botNumber,
        connection: connectionSummary.trim()
      };
      print(connectionSummary);
      await sock.sendMessage(botNumber, {
        text: "```" + ("" + connectionSummary).trim() + "```"
      }, {
        disappearingMessagesInChat: true,
        ephemeralExpiration: 86400
      });
      global.isStart = true;
      let isCreator = true;
      let botInfo = {
        bot: sock,
        user: botNumber,
        isSuhail: isSuhail,
        isCreator: isCreator
      };
      let config = {
        dbbot: botSettings,
        botNumber: botNumber,
        isCreator: isCreator,
        isSuhail: isSuhail,
        store: store,
        Suhail: botInfo,
        Void: sock,
        ...connection
      };
      events.commands.map(async cmd => {});
    }
    if (connectionStatus === "close") {
      await sleep(5000);
      global.isStart = false;
      global.qr_message = {
        message: "CONNECTION CLOSED WITH BOT!"
      };
      let reason = new Boom(lastDisconnect?.error)?.output.statusCode;
      global.connectFailures = (global.connectFailures || 0) + 1;
      const hasStoredCreds = (() => {
        try {
          return fs.existsSync(__dirname + baileys + "creds.json");
        } catch {
          return false;
        }
      })();
      if (hasStoredCreds && global.connectFailures >= 6 && reason !== DisconnectReason.connectionReplaced) {
        reason = DisconnectReason.loggedOut;
      }
      const relinkOnce = () => {
        purgeSession(__dirname + baileys);
        if (global.sessionRelinkTried) {
          print("Could not establish a session. Check your SESSION_ID or link again with QR / pairing code.");
          process.exit(1);
        }
        global.sessionRelinkTried = true;
        global.authMethodChosen = false;
        global.authMode = undefined;
        global.qr = undefined;
        global.pairingCode = undefined;
        print("Re-linking: choose QR or pairing code below.");
        syncdb().catch(err => console.log(err));
      };
      if (reason === DisconnectReason.badSession) {
        print("Bad Session File, Clearing And Re-linking");
        relinkOnce();
      } else if (reason === DisconnectReason.connectionClosed) {
        print("Connection closed, reconnecting....");
        syncdb().catch(err => console.log(err));
      } else if (reason === DisconnectReason.connectionLost) {
        print("Connection Lost from Server, reconnecting...");
        syncdb().catch(err => console.log(err));
      } else if (reason === DisconnectReason.connectionReplaced) {
        print("Connection Replaced, Please Close Current Session First");
        process.exit(1);
      } else if (reason === DisconnectReason.loggedOut) {
        print("Device Logged Out, Clearing Session And Re-linking...");
        relinkOnce();
      } else if (reason === DisconnectReason.restartRequired) {
        print("Restart Required, Restarting...");
        syncdb().catch(err => console.log(err));
      } else if (reason === DisconnectReason.timedOut) {
        print("Connection TimedOut, Reconnecting...");
        syncdb().catch(err => console.log(err));
      } else if (reason === DisconnectReason.multideviceMismatch) {
        print("Multi device mismatch, clearing session and re-linking...");
        relinkOnce();
      } else {
        print("Connection closed with bot. Please put New Session ID again.");
        print(reason);
        process.exit(0);
      }
    }
  });
  sock.ev.on("creds.update", saveCreds);
  sock.lastStatus = async () => {
    console.log("last_status :", last_status);
    return last_status;
  };
  sock.decodeJid = jid => {
    if (!jid) {
      return jid;
    }
    if (/:\d+@/gi.test(jid)) {
      let decoded = jidDecode(jid) || {};
      return decoded.user && decoded.server && decoded.user + "@" + decoded.server || jid;
    } else {
      return jid;
    }
  };
  sock.getName = (jid, raw = false) => {
    const rawJid = sock.decodeJid(jid);
    const lidJid = lidMap.isLid(rawJid) ? rawJid : null;
    
    const decodedJid = lidMap.resolve(rawJid) || rawJid;
    let user;
    const fallback = "+" + lidMap.displayJid(rawJid);
    if (decodedJid.endsWith("@g.us")) {
      return new Promise(async textContent => {
        user = store.contacts[decodedJid] || {};
        if (!user.name?.notify && !user.subject) {
          try {
            user = (await sock.groupMetadata(decodedJid)) || {};
          } catch (err) {}
        }
        textContent(user.subject || user.name || fallback);
      });
    } else {
      // Contacts are keyed by lid OR phone jid depending on what arrived; try both.
      user =
        decodedJid === "0@s.whatsapp.net"
          ? { id: decodedJid, name: "WhatsApp" }
          : lidMap.matchesNumber(lidJid || rawJid, sock.decodeJid(sock.user.id))
            ? sock.user
            : (store.contacts[rawJid] || store.contacts[decodedJid] || {});
    }
    if (user && (user.name || user.subject || user.verifiedName || user.notify)) {
      return user.name || user.subject || user.verifiedName || user.notify || fallback;
    }
    
    return Promise.resolve(userdb.findOne({ id: rawJid }))
      .then(contactUser => contactUser && contactUser.name)
      .catch(() => null)
      .then(name => name || store.contacts[decodedJid]?.notify || fallback);
  };
  sock.sendContact = async (jid, contacts, quoted = "", options = {}) => {
    let vcard = [];
    for (let contact of contacts) {
      vcard.push({
        displayName: await sock.getName(contact + "@s.whatsapp.net"),
        vcard: "BEGIN:VCARD\nVERSION:3.0\nN:" + (await sock.getName(contact + "@s.whatsapp.net")) + "\nFN:" + global.OwnerName + "\nitem1.TEL;waid=" + contact + ":" + contact + "\nitem1.X-ABLabel:Click here to chat\nitem2.EMAIL;type=INTERNET:" + global.email + "\nitem2.X-ABLabel:GitHub\nitem3.URL:" + global.github + "\nitem3.X-ABLabel:GitHub\nitem4.ADR:;;" + global.location + ";;;;\nitem4.X-ABLabel:Region\nEND:VCARD"
      });
    }
    return sock.sendMessage(jid, {
      contacts: {
        displayName: vcard.length + " Contact",
        contacts: vcard
      },
      ...options
    }, {
      quoted: quoted
    });
  };
  sock.setStatus = content => {
    sock.query({
      tag: "iq",
      attrs: {
        to: "@s.whatsapp.net",
        type: "set",
        xmlns: "status"
      },
      content: [{
        tag: "status",
        attrs: {},
        content: Buffer.from(content, "utf-8")
      }]
    });
    return content;
  };
  sock.messageId = (length = 8, id = "SUHAILMD") => {
    const chars = "1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
    for (let i = 0; i < length; i++) {
      const index = Math.floor(Math.random() * chars.length);
      id += chars.charAt(index);
    }
    return id;
  };
  sock.send5ButImg = async (jid, textContent = "", footer = "", image, buttons = [], thumbnail, options = {}) => {
    let message = await prepareWAMessageMedia({
      image: image,
      jpegThumbnail: thumbnail
    }, {
      upload: sock.waUploadToServer
    });
    var msg = generateWAMessageFromContent(jid, proto.Message.fromObject({
      templateMessage: {
        hydratedTemplate: {
          imageMessage: message.imageMessage,
          hydratedContentText: textContent,
          hydratedFooterText: footer,
          hydratedButtons: buttons
        }
      }
    }), options);
    sock.relayMessage(jid, msg.message, {
      messageId: sock.messageId()
    });
  };
  sock.sendButtonText = (jid, buttons = [], textContent, footer, quoted = "", options = {}) => {
    let msg = {
      text: textContent,
      footer: footer,
      buttons: buttons,
      headerType: 2,
      ...options
    };
    sock.sendMessage(jid, msg, {
      quoted: quoted,
      ...options
    });
  };
  sock.sendText = (jid, textContent, quoted = "", options) => sock.sendMessage(jid, {
    text: textContent,
    ...options
  }, {
    quoted: quoted
  });
  sock.sendImage = async (jid, image, caption = "", quoted = "", options) => {
    let imageData = Buffer.isBuffer(image) ? image : /^data:.*?\/.*?;base64,/i.test(image) ? Buffer.from(image.split`,`[1], "base64") : /^https?:\/\//.test(image) ? await await getBuffer(image) : fs.existsSync(image) ? fs.readFileSync(image) : Buffer.alloc(0);
    return await sock.sendMessage(jid, {
      image: imageData,
      caption: caption,
      ...options
    }, {
      quoted: quoted
    });
  };
  sock.sendTextWithMentions = async (jid, textContent, quoted, options = {}) => sock.sendMessage(jid, {
    text: textContent,
    contextInfo: {
      mentionedJid: [...textContent.matchAll(/@(\d{0,16})/g)].map(match => lidMap.mentionJid(match[1]))
    },
    ...options
  }, {
    quoted: quoted
  });
  sock.sendImageAsSticker = async (jid, image, options = {}) => {
    let buffer;
    if (options && (options.packname || options.author)) {
      buffer = await writeExifImg(image, options);
    } else {
      buffer = await imageToWebp(image);
    }
    await sock.sendMessage(jid, {
      sticker: {
        url: buffer
      },
      ...options
    }, options);
  };
  sock.sendVideoAsSticker = async (jid, videoBuffer, options = {}) => {
    let buffer;
    if (options && (options.packname || options.author)) {
      buffer = await writeExifVid(videoBuffer, options);
    } else {
      buffer = await videoToWebp(videoBuffer);
    }
    await sock.sendMessage(jid, {
      sticker: {
        url: buffer
      },
      ...options
    }, options);
  };
  sock.sendMedia = async (jid, url, fileName = "", caption = "", quoted = "", options = {}) => {
    let buffer = await sock.getFile(url, true);
    let {
      mime: fileType,
      ext: ext,
      res: res,
      data: data,
      filename: filename
    } = buffer;
    if (res && res.status !== 200 || file.length <= 65536) {
      try {
        throw {
          json: JSON.parse(file.toString())
        };
      } catch (fileTypeError) {
        if (fileTypeError.json) {
          throw fileTypeError.json;
        }
      }
    }
    let mediaType = "";
    let mimetype = fileType;
    let mediaUrl = filename;
    if (options.asDocument) {
      mediaType = "document";
    }
    if (options.asSticker || /webp/.test(fileType)) {
      let {
        writeExif: writeExif
      } = require("./exif");
      let exifPayload = {
        mimetype: fileType,
        data: data
      };
      mediaUrl = await writeExif(exifPayload, {
        packname: options.packname ? options.packname : Config.packname,
        author: options.author ? options.author : Config.author,
        categories: options.categories ? options.categories : []
      });
      await fs.promises.unlink(filename);
      mediaType = "sticker";
      mimetype = "image/webp";
    } else if (/image/.test(fileType)) {
      mediaType = "image";
    } else if (/video/.test(fileType)) {
      mediaType = "video";
    } else if (/audio/.test(fileType)) {
      mediaType = "audio";
    } else {
      mediaType = "document";
    }
    await sock.sendMessage(jid, {
      [mediaType]: {
        url: mediaUrl
      },
      caption: caption,
      mimetype: mimetype,
      fileName: fileName,
      ...options
    }, {
      quoted: quoted,
      ...options
    });
    return fs.promises.unlink(mediaUrl);
  };
  sock.downloadAndSaveMediaMessage = async (m, filename = "null", saveToTemp = false, quoted = true) => {
    let msg = m.msg ? m.msg : m;
    let mimetype = msg.mimetype || "";
    let mediaType = m.mtype ? m.mtype.split(/Message/gi)[0] : msg.mtype ? msg.mtype.split(/Message/gi)[0] : mimetype.split("/")[0];
    const mediaStream = await downloadContentFromMessage(msg, mediaType);
    let buffer = Buffer.from([]);
    for await (const chunk of mediaStream) {
      buffer = Buffer.concat([buffer, chunk]);
    }
    if (saveToTemp) {
      return buffer;
    }
    let fileType = await FileType.fromBuffer(buffer);
    let filePath = "./temp/" + filename + "." + fileType.ext;
    fs.writeFileSync(filePath, buffer);
    return filePath;
  };
  sock.forward = async (jid, m, contextInfo, quoted, saveToTemp = true) => {
    try {
      let mediaType = m.mtype;
      let msg = {};
      console.log("Forward function Called and Type is : ", mediaType);
      if (mediaType == "conversation") {
        msg = {
          text: m.text,
          contextInfo: contextInfo
        };
        for (let targetJid of parsedJid(jid)) {
          await sock.sendMessage(targetJid, msg, {
            quoted: quoted,
            messageId: sock.messageId()
          });
        }
        return;
      }
      const randomName = ext => {
        return "" + Math.floor(Math.random() * 10000) + ext;
      };
      let mediaMessage = m.msg ? m.msg : m;
      let mimetype = (m.msg || m).mimetype || "";
      let resolvedMediaType = m.mtype ? m.mtype.replace(/Message/gi, "") : mimetype.split("/")[0];
      const mediaStream = await downloadContentFromMessage(mediaMessage, resolvedMediaType);
      let buffer = Buffer.from([]);
      for await (const chunk of mediaStream) {
        buffer = Buffer.concat([buffer, chunk]);
      }
      let fileType = await FileType.fromBuffer(buffer);
      let fileName = await randomName(fileType.ext);
      let filePath = "./temp/" + fileName;
      fs.writeFileSync(filePath, buffer);
      if (mediaType == "videoMessage") {
        msg = {
          video: fs.readFileSync(filePath),
          mimetype: m.mimetype,
          caption: m.text,
          contextInfo: contextInfo
        };
      } else if (mediaType == "imageMessage") {
        msg = {
          image: fs.readFileSync(filePath),
          mimetype: m.mimetype,
          caption: m.text,
          contextInfo: contextInfo
        };
      } else if (mediaType == "audioMessage") {
        msg = {
          audio: fs.readFileSync(filePath),
          mimetype: m.mimetype,
          seconds: 200001355,
          ptt: true,
          contextInfo: contextInfo
        };
      } else if (mediaType == "documentWithCaptionMessage" || fileType == "documentMessage") {
        msg = {
          document: fs.readFileSync(filePath),
          mimetype: m.mimetype,
          caption: m.text,
          contextInfo: contextInfo
        };
      } else {
        fs.unlink(filePath, options => {
          if (options) {
            console.error("Error deleting file:", options);
          } else {
            console.log("File deleted successfully");
          }
        });
      }
      for (let targetJid of parsedJid(jid)) {
        try {
          await sock.sendMessage(targetJid, msg, {
            quoted: quoted,
            messageId: sock.messageId()
          });
        } catch (err) {}
      }
      return fs.unlink(filePath, options => {
        if (options) {
          console.error("Error deleting file:", options);
        } else {
          console.log("File deleted successfully");
        }
      });
    } catch (err) {
      console.log(err);
    }
  };
  sock.downloadMediaMessage = async m => {
    let msg = m.msg ? m.msg : m;
    let mimetype = (m.msg || m).mimetype || "";
    let mediaType = m.mtype ? m.mtype.replace(/Message/gi, "") : mimetype.split("/")[0];
    const mediaStream = await downloadContentFromMessage(msg, mediaType);
    let buffer = Buffer.from([]);
    for await (const chunk of mediaStream) {
      buffer = Buffer.concat([buffer, chunk]);
    }
    return buffer;
  };
  sock.forwardOrBroadCast2 = async (jid, m, options = {}, type = "") => {
    try {
      let mediaType = m.mtype;
      if (mediaType === "videoMessage" && type === "ptv") {
        m = {
          ptvMessage: {
            ...m.msg
          }
        };
      }
      let msgOptions = {
        ...options,
        contextInfo: {
          ...(options.contextInfo ? options.contextInfo : {}),
          ...(options.linkPreview ? {
            linkPreview: {
              ...options.linkPreview
            }
          } : {}),
          ...(options.quoted && options.quoted.message ? {
            quotedMessage: {
              ...(options.quoted?.message || {})
            }
          } : {})
        }
      };
      var content = m.message ? m.message : m;
      let resolvedType = mediaType ? mediaType : Object.keys(content)[0];
      content = {
        ...msgOptions,
        ...content
      };
      const msg = await generateWAMessageFromContent(jid, content, options ? {
        ...(resolvedType == "conversation" ? {
          extendedTextMessage: {
            text: content[resolvedType]
          }
        } : content[resolvedType]),
        ...msgOptions,
        contextInfo: {
          ...(content[resolvedType]?.contextInfo || {}),
          ...msgOptions.contextInfo
        }
      } : {});
      await sock.relayMessage(jid, msg.message, {
        messageId: sock.messageId()
      });
      return msg;
    } catch {}
  };
  sock.forwardOrBroadCast = async (jid, m, options = {}, type = "") => {
    try {
      if (!options || typeof options !== "object") {
        options = {};
      }
      options.messageId = options.messageId || sock.messageId();
      var content = m.message ? m.message : m;
      let mediaType = content.mtype ? content.mtype : Object.keys(content)[0];
      if (mediaType === "videoMessage" && type === "ptv") {
        content = {
          ptvMessage: {
            ...m.msg
          }
        };
        mediaType = "ptvMessage";
      } else if (mediaType == "conversation") {
        content = {
          extendedTextMessage: {
            text: content[mediaType]
          }
        };
        mediaType = "extendedTextMessage";
      }
      content[mediaType] = {
        ...(content[mediaType] || content),
        ...options
      };
      const msg = generateWAMessageFromContent(jid, content, options);
      await sock.relayMessage(jid, msg.message, {
        messageId: options.messageId
      });
      return msg;
    } catch (err) {
      console.log(err);
    }
  };
  sock.forwardMessage = sock.forwardOrBroadCast;
  sock.copyNForward = async (jid, m, type = false, options = {}) => {
    try {
      let mediaType;
      if (options.readViewOnce) {
        m.message = m.message && m.message.ephemeralMessage && m.message.ephemeralMessage.message ? m.message.ephemeralMessage.message : m.message || undefined;
        mediaType = Object.keys(m.message.viewOnceMessage.message)[0];
        delete (m.message && m.message.ignore ? m.message.ignore : m.message || undefined);
        delete m.message.viewOnceMessage.message[mediaType].viewOnce;
        m.message = {
          ...m.message.viewOnceMessage.message
        };
      }
      let forwardMediaType = Object.keys(m.message)[0];
      try {
        m.key.fromMe = true;
      } catch (err) {}
      let content = await generateForwardMessageContent(m, type);
      let contentType = Object.keys(content)[0];
      let contextInfo = {};
      if (forwardMediaType != "conversation") {
        contextInfo = m.message[forwardMediaType].contextInfo;
      }
      content[contentType].contextInfo = {
        ...contextInfo,
        ...content[contentType].contextInfo
      };
      const msg = await generateWAMessageFromContent(jid, content, options);
      await sock.relayMessage(jid, msg.message, {
        messageId: sock.messageId()
      });
      return msg;
    } catch (err) {
      console.log(err);
    }
  };
  sock.sendFileUrl = async (jid, url, caption = "", quoted = "", options = {
    author: "Suhail-Md"
  }, type = "") => {
    try {
      let response = await axios.head(url);
      let contentType = response?.headers["content-type"] || "";
      let mediaType = contentType.split("/")[0];
      let msg = false;
      if (contentType.split("/")[1] === "gif" || type === "gif") {
        msg = {
          video: {
            url: url
          },
          caption: caption,
          gifPlayback: true,
          ...options
        };
      } else if (contentType.split("/")[1] === "webp" || type === "sticker") {
        msg = {
          sticker: {
            url: url
          },
          ...options
        };
      } else if (mediaType === "image" || type === "image") {
        msg = {
          image: {
            url: url
          },
          caption: caption,
          ...options,
          mimetype: "image/jpeg"
        };
      } else if (mediaType === "video" || type === "video") {
        msg = {
          video: {
            url: url
          },
          caption: caption,
          mimetype: "video/mp4",
          ...options
        };
      } else if (mediaType === "audio" || type === "audio") {
        msg = {
          audio: {
            url: url
          },
          mimetype: "audio/mpeg",
          ...options
        };
      } else if (contentType == "application/pdf") {
        msg = {
          document: {
            url: url
          },
          mimetype: "application/pdf",
          caption: caption,
          ...options
        };
      }
      if (msg) {
        try {
          return await sock.sendMessage(jid, msg, {
            quoted: quoted
          });
        } catch {}
        ;
      }
      try {
        var fileName = response?.headers["content-disposition"]?.split("=\"")[1]?.split("\"")[0] || "file";
        if (fileName) {
          const imageExts = [".jpg", ".jpeg", ".png"];
          const videoExts = [".mp4", ".avi", ".mov", ".mkv", ".gif", ".m4v", ".webp"];
          var fileExt = fileName.substring(fileName.lastIndexOf("."))?.toLowerCase() || "nillll";
          var mimetype;
          if (imageExts.includes(fileExt)) {
            mimetype = "image/jpeg";
          } else if (videoExts.includes(fileExt)) {
            mimetype = "video/mp4";
          }
          contentType = mimetype ? mimetype : contentType;
          let contextInfo = {
            fileName: fileName || "file",
            caption: caption,
            ...options,
            mimetype: contentType
          };
          return await sock.sendMessage(jid, {
            document: {
              url: url
            },
            ...contextInfo
          }, {
            quoted: quoted
          });
        }
      } catch (err) {}
      let extraOptions = {
        fileName: fileName ? fileName : "file",
        caption: caption,
        ...options,
        mimetype: contentType
      };
      return await sock.sendMessage(jid, {
        document: {
          url: url
        },
        ...extraOptions
      }, {
        quoted: quoted
      });
    } catch (err) {
      console.log("Erorr in client.sendFileUrl() : ", err);
      throw err;
    }
  };
  sock.sendFromUrl = sock.sendFileUrl;
  const sentMap = {};
  let userImages = [];
  const mediaProbeCache = new Map();
  const mediaReachable = async sources => {
    for (const src of [].concat(sources || [])) {
      const s = String(src || "").trim();
      if (!s) {
        continue;
      }
      if (!/^https?:\/\//i.test(s)) {
        if (fs.existsSync(s)) {
          return true;
        }
        continue;
      }
      if (mediaProbeCache.has(s)) {
        if (mediaProbeCache.get(s)) {
          return true;
        }
        continue;
      }
      let ok = false;
      try {
        const ctrl = new AbortController();
        const t = setTimeout(() => ctrl.abort(), 4000);
        const res = await fetch(s, {
          method: "HEAD",
          signal: ctrl.signal
        });
        clearTimeout(t);
        ok = res.ok || res.status === 405 || res.status === 403;
      } catch (err) {
        ok = false;
      }
      mediaProbeCache.set(s, ok);
      if (ok) {
        return true;
      }
    }
    return false;
  };

  sock.sendUi = async (jid, content = {}, quoted = "", options = "", resolvedQuoted = "", textContent = false) => {
    let contextInfo = {};
    try {
      const urlRegex = /(https?:\/\/\S+)/gi;
      const imageExts = [".jpg", ".jpeg", ".png"];
      const caption = [".mp4", ".avi", ".mov", ".mkv", ".gif", ".m4v", ".webp"];
      let image = video = false;
      if (!userImages || !userImages[0]) {
        const localThumb = require("path").join(__dirname, "assets", "suhail.jpg");
        userImages = global.userImages ? global.userImages.split(",") : [fs.existsSync(localThumb) ? localThumb : await botpic()];
        userImages = userImages.filter(userImage => String(userImage || "").trim() !== "");
      }
      // Skip unreachable remote media fast instead of stalling the whole command.
      if (!(await mediaReachable(userImages))) {
        userImages = [];
      }
      let imageUrl = options && resolvedQuoted ? resolvedQuoted : userImages[Math.floor(Math.random() * userImages.length)];
      if (!sentMap[imageUrl]) {
        const url = imageUrl.substring(imageUrl.lastIndexOf(".")).toLowerCase();
        if (imageExts.includes(url)) {
          image = true;
        }
        if (caption.includes(url)) {
          video = true;
        }
        sentMap[imageUrl] = {
          image: image,
          video: video
        };
      }
      quoted = quoted && quoted.quoted?.key ? quoted.quoted : quoted || "";
      let media;
      if ((textContent && resolvedQuoted && global.style > 0 || !resolvedQuoted) && /text|txt|nothing|smd|suhail/.test(global.userImages) || options == "text") {
        media = {
          text: content.text || content.caption,
          ...content
        };
      } else if (options == "image" || sentMap[imageUrl].image) {
        media = {
          image: {
            url: imageUrl
          },
          ...content,
          mimetype: "image/jpeg"
        };
      } else if (options == "video" || sentMap[imageUrl].video) {
        media = {
          video: {
            url: imageUrl
          },
          ...content,
          mimetype: "video/mp4",
          gifPlayback: true,
          height: 274,
          width: 540
        };
      }
      const linkContextInfo = textContent && resolvedQuoted && global.style > 0 ? await smdBuffer(resolvedQuoted) : null;
      contextInfo = {
        ...(await sock.contextInfo(Config.botname, quoted && quoted.senderName ? quoted.senderName : Config.ownername, linkContextInfo))
      };
      if (media) {
        return await sock.sendMessage(jid, {
          contextInfo: contextInfo,
          ...media
        }, {
          quoted: quoted
        });
      }
    } catch (err) {
      console.log("erorr in userImages() : ", err);
    }
    try {
      const localThumb2 = require("path").join(__dirname, "assets", "suhail.jpg");
      return await sock.sendMessage(jid, {
        image: {
          url: fs.existsSync(localThumb2) ? localThumb2 : await botpic()
        },
        contextInfo: contextInfo,
        ...content
      });
    } catch {
      return sock.sendMessage(jid, {
        text: content.text || content.caption,
        ...content
      });
    }
  };

  sock.contextInfo = async () => ({});
  sock.cMod = (jid, m, message = "", participant = sock.user.id, contextInfo = {}) => {
    let mediaType = Object.keys(m.message)[0];
    let isEphemeral = mediaType === "ephemeralMessage";
    if (isEphemeral) {
      mediaType = Object.keys(m.message.ephemeralMessage.message)[0];
    }
    let messageObj = isEphemeral ? m.message.ephemeralMessage.message : m.message;
    let content = messageObj[mediaType];
    if (typeof content === "string") {
      messageObj[mediaType] = message || content;
    } else if (content.caption) {
      content.caption = message || content.caption;
    } else if (content.text) {
      content.text = message || content.text;
    }
    if (typeof content !== "string") {
      messageObj[mediaType] = {
        ...content,
        ...contextInfo
      };
    }
    if (m.key.participant) {
      participant = m.key.participant = participant || m.key.participant;
    } else if (m.key.participant) {
      participant = m.key.participant = participant || m.key.participant;
    }
    if (m.key.remoteJid.includes("@s.whatsapp.net")) {
      participant = participant || m.key.remoteJid;
    } else if (m.key.remoteJid.includes("@broadcast")) {
      participant = participant || m.key.remoteJid;
    }
    m.key.remoteJid = jid;
    m.key.fromMe = participant === sock.user.id;
    return proto.WebMessageInfo.fromObject(m);
  };
  sock.getFile = async (url, saveToTemp) => {
    let res;
    let buffer = Buffer.isBuffer(url) ? url : /^data:.*?\/.*?;base64,/i.test(url) ? Buffer.from(url.split`,`[1], "base64") : /^https?:\/\//.test(url) ? await (res = await getBuffer(url)) : fs.existsSync(url) ? (filePath = url, fs.readFileSync(url)) : typeof url === "string" ? url : Buffer.alloc(0);
    let fileType = (await FileType.fromBuffer(buffer)) || {
      mime: "application/octet-stream",
      ext: ".bin"
    };
    let filePath = "./temp/null." + fileType.ext;
    if (buffer && saveToTemp) {
      fs.promises.writeFile(filePath, buffer);
    }
    return {
      res: res,
      filename: filePath,
      size: getSizeMedia(buffer),
      ...fileType,
      data: buffer
    };
  };
  sock.sendFile = async (jid, url, fileName, quoted = {
    quoted: ""
  }, options = {}) => {
    let buffer = await sock.getFile(url, true);
    let {
      filename: mediaType,
      size: size,
      ext: ext,
      mime: mime,
      data: data
    } = buffer;
    let fileKind = "";
    let mimetype = mime;
    let mediaUrl = mediaType;
    if (options.asDocument) {
      fileKind = "document";
    }
    if (options.asSticker || /webp/.test(mime)) {
      let {
        writeExif: writeExif
      } = require("./exif.js");
      let exifPayload = {
        mimetype: mime,
        data: data
      };
      mediaUrl = await writeExif(exifPayload, {
        packname: Config.packname,
        author: Config.packname,
        categories: options.categories ? options.categories : []
      });
      await fs.promises.unlink(mediaType);
      fileKind = "sticker";
      mimetype = "image/webp";
    } else if (/image/.test(mime)) {
      fileKind = "image";
    } else if (/video/.test(mime)) {
      fileKind = "video";
    } else if (/audio/.test(mime)) {
      fileKind = "audio";
    } else {
      fileKind = "document";
    }
    await sock.sendMessage(jid, {
      [fileKind]: {
        url: mediaUrl
      },
      mimetype: mimetype,
      fileName: fileName,
      ...options
    }, {
      quoted: quoted && quoted.quoted ? quoted.quoted : quoted,
      ...quoted
    });
    return fs.promises.unlink(mediaUrl);
  };
  sock.fakeMessage = async (type = "text", options = {}, conversation = "➬ Suhail SER", quotedOptions = {}) => {
    const texts = [777, 0, 100, 500, 1000, 999, 2021];
    let conversationOptions = {
      id: sock.messageId(),
      fromMe: false,
      participant: "0@s.whatsapp.net",
      remoteJid: "status@broadcast",
      ...options
    };
    let messageOptions = {};
    if (type == "text" || type == "conservation" || !type) {
      messageOptions = {
        conversation: conversation
      };
    } else if (type == "order") {
      messageOptions = {
        orderMessage: {
          itemCount: texts[Math.floor(texts.length * Math.random())],
          status: 1,
          surface: 1,
          message: "❏ " + conversation,
          orderTitle: "live",
          sellerJid: "923184474176@s.whatsapp.net"
        }
      };
    } else if (type == "contact") {
      messageOptions = {
        contactMessage: {
          displayName: "" + conversation,
          jpegThumbnail: log0
        }
      };
    } else if (type == "image") {
      messageOptions = {
        imageMessage: {
          jpegThumbnail: log0,
          caption: conversation
        }
      };
    } else if (type == "video") {
      messageOptions = {
        videoMessage: {
          url: log0,
          caption: conversation,
          mimetype: "video/mp4",
          fileLength: "4757228",
          seconds: 44
        }
      };
    }
    return {
      key: {
        ...conversationOptions
      },
      message: {
        ...messageOptions,
        ...quotedOptions
      }
    };
  };
  sock.parseMention = async content => {
    return [...content.matchAll(/@([0-9]{5,16}|0)/g)].map(match => lidMap.mentionJid(match[1]));
  };
  app.get("/chat", (req, res) => {
  
    let target = req.query.chat || req.query.jid || sock.user?.id || sock.user?.m || "";
    if (["all", "msg", "total"].includes(target)) {
      return res.json({
        chat: target,
        conversation: JSON.stringify(store.snapshot(), null, 2)
      });
    }
    if (!target) {
      return res.json({
        ERROR: "Chat Id parameter missing"
      });
    }
    target = sock.decodeJid(target);
    const options = (store.messages[target] || store.messages[target + "@s.whatsapp.net"] || store.messages[target + "@g.us"])?.array || false;
    if (!options) {
      return res.json({
        chat: target,
        Message: "no messages found in given chat id!"
      });
    }
    res.json({
      chat: target,
      conversation: JSON.stringify(options, null, 2)
    });
  });
  sock.dl_size = global.dl_size || 200;
  sock.awaitForMessage = async (options = {}) => {
    return new Promise((reject, resolve) => {
      if (typeof options !== "object") {
        resolve(new Error("Options must be an object"));
      }
      if (typeof options.sender !== "string") {
        resolve(new Error("Sender must be a string"));
      }
      if (typeof options.remoteJid !== "string") {
        resolve(new Error("ChatJid must be a string"));
      }
      if (options.timeout && typeof options.timeout !== "number") {
        resolve(new Error("Timeout must be a number"));
      }
      if (options.filter && typeof options.filter !== "function") {
        resolve(new Error("Filter must be a function"));
      }
      const timeoutOption = options?.timeout || undefined;
      const match = options?.filter || (() => true);
      let timeout = undefined;
      let handler = update => {
        let {
          type: type,
          messages: messages
        } = update;
        if (type == "notify") {
          for (let incomingMek of messages) {
            const fromMe = incomingMek.key.fromMe;
            const remoteJid = incomingMek.key.remoteJid;
            const isGroup = remoteJid.endsWith("@g.us");
            const pushName = remoteJid == "status@broadcast";
            const sender = sock.decodeJid(fromMe ? sock.user.id : isGroup || pushName ? incomingMek.key.participant : remoteJid);
            if (sender == options.sender && remoteJid == options.remoteJid && match(incomingMek)) {
              sock.ev.off("messages.upsert", handler);
              clearTimeout(timeout);
              reject(incomingMek);
            }
          }
        }
      };
      sock.ev.on("messages.upsert", handler);
      if (timeoutOption) {
        timeout = setTimeout(() => {
          sock.ev.off("messages.upsert", handler);
          resolve(new Error("Timeout"));
        }, timeoutOption);
      }
    });
  };
  return sock;
}
let asciii = "\n\n                " + Config.VERSION + "\n█▀▀▀█ █  █ █  █ █▀▀▄ ▀█▀ █     █▀▄▀█ █▀▀▄\n▀▀▀▄▄ █  █ █▀▀█ █▄▄█  █  █     █ █ █ █  █\n█▄▄▄█ ▀▄▄▀ █  █ █  █ ▄█▄ █▄▄█  █   █ █▄▄█\n  𝗠𝗨𝗟𝗧𝗜𝗗𝗘𝗩𝗜𝗖𝗘 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗨𝗦𝗘𝗥 𝗕𝗢𝗧\n\n";
console.log(asciii);
global.lib_dir = __dirname;
global.toBool = (value, fallback = false) => /true|yes|ok|act|sure|enable|smd|suhail/gi.test(value) ? fallback ? true : "true" : fallback ? false : "false";
async function loadPlugins(dir) {
  try {
    fs.readdirSync(dir).forEach(filename => {
      const filePath = path.join(dir, filename);
      if (fs.statSync(filePath).isDirectory()) {
        loadPlugins(filePath);
      } else if (filename.includes("_Baileys") || filename.includes("_MSGS")) {
        log("\nRENTBOTT's DATA DETECTED!", "\nUSER NUMBER:", filename.replace("_MSGS", "").replace("_Baileys", ""), "\n\n");
      } else if ([".js", ".smd", ".suhail"].includes(path.extname(filename).toLowerCase())) {
        try {
          require(filePath);
        } catch (err) {
          log("\n❌There's an error in '" + filename + "' file ❌ \n\n", err);
        }
      }
    });
  } catch (err) {}
}
const html = "\n     <!DOCTYPE html>\n     <html>\n       <head>\n         <title>Suhail-Md</title>\n         <link rel=\"icon\" type=\"image/png\" sizes=\"32x32\" href=\"/logo\">\n         <script src=\"https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js\"></script>\n         <script>\n           setTimeout(() => {\n             confetti({\n               particleCount: 100,\n               spread: 70,\n               origin: { y: 0.6 },\n               disableForReducedMotion: true\n             });\n           }, 500);\n         </script>\n         <style>\n           @import url(\"https://p.typekit.net/p.css?s=1&k=vnd5zic&ht=tk&f=39475.39476.39477.39478.39479.39480.39481.39482&a=18673890&app=typekit&e=css\");\n           @font-face {\n             font-family: \"neo-sans\";\n             src: url(\"https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3\") format(\"woff2\"), url(\"https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/d?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3\") format(\"woff\"), url(\"https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/a?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3\") format(\"opentype\");\n             font-style: normal;\n             font-weight: 700;\n           }\n           html {\n             font-family: neo-sans;\n             font-weight: 700;\n             font-size: calc(62rem / 24);\n           }\n           body {\n             background: white;\n           }\n           section {\n             border-radius: 1em;\n             padding: 1em;\n             position: absolute;\n             top: 50%;\n             left: 50%;\n             margin-right: -50%;\n             transform: translate(-50%, -50%);\n           }\n           \n         </style>\n       </head>\n       <body>\n         <section>\n           Hello from \"Suhail Tech Info\"!\n         </section>\n         <p>  <a href='/qr' > QR </a> | <a href='/var' > VARIABLES </a> | <a href='https://github.com/SuhailTechInfo/Suhail-Md-Media' > PLUGINS </a> | <a href='https://github.com/SuhailTechInfo/Suhail-Md/wiki' > WIKI's </a></p>\n       </body> \n     </html>\n     ";
app.set("json spaces", 3);
app.get("/", (req, res) => {
  try {
    let filePath = path.join(__dirname, "assets", "index.html");
    if (fs.existsSync(filePath)) {
      res.sendFile(filePath);
    } else {
      res.type("html").send(html);
    }
  } catch (err) {}
});
app.get("/suhail", (req, res) => res.type("html").send(html));
app.get("/var", (req, res) => res.json({
  ...Config,
  SESSION_ID: SESSION_ID
}));
app.get("/qr", async (req, res) => {
  try {
    if (!global.qr) {
      throw "QR NOT FETCHED!";
    }
    let qrcode = require("qrcode");
    res.end(await qrcode.toBuffer(global.qr));
  } catch (err) {
    console.log("/qr PATH_URL Error : ", err);
    if (!res.headersSent) {
      res.send({
        error: err.message || err,
        reason: global.qr_message || "SERVER DOWN!",
        uptime: runtime(process.uptime())
      });
    }
  }
});
app.get("/logo", (req, res) => res.end(global.log0));
let quickport = global.port ? global.port : Math.floor(Math.random() * 9000) + 1000;
app.listen(quickport, () => console.log("Suhail-Md Server listening on http://localhost:" + quickport + "/  "));
global.print = console.log;
global.log = console.log;
global.Debug = {
  ...console
};
if (!/true|log|smd|error|logerror|err|all|info|loginfo|warn|logwarn/.test(global.MsgsInLog)) {
  console.log = () => {};
}
if (!/error|logerror|err|all/.test(global.MsgsInLog)) {
  console.error = () => {};
}
if (!/info|loginfo|all/.test(global.MsgsInLog)) {
  console.info = () => {};
}
if (!/warn|logwarn|all/.test(global.MsgsInLog)) {
  console.warn = () => {};
}
let Appurls = [];
if (global.appUrl && /http/gi.test(global.appUrl)) {
  Appurls = [global.appUrl, "http://localhost:" + quickport];
}
if (process.env.REPL_ID) {
  Appurls.push("https://" + process.env.REPL_ID + ".pike.replit.dev");
  Appurls.push("https://" + process.env.REPL_ID + "." + (process.env.REPLIT_CLUSTER || "pike") + ".replit.dev");
}
if (process.env.REPL_SLUG) {
  Appurls.push("https://" + process.env.REPL_SLUG + "." + process.env.REPL_OWNER + ".repl.co");
}
if (process.env.PROJECT_DOMAIN) {
  Appurls.push("https://" + process.env.PROJECT_DOMAIN + ".glitch.me");
}
if (process.env.CODESPACE_NAME) {
  Appurls.push("https://" + process.env.CODESPACE_NAME + ".github.dev");
}
function keepAlive() {
  setInterval(() => {
    for (let i = 0; i < Appurls.length; i++) {
      const url = Appurls[i];
      if (/(\/\/|\.)undefined\./.test(url)) {
        continue;
      }
      try {
        axios.get(url);
      } catch (err) {}
      try {
        fetch(url);
      } catch (err) {}
    }
  }, 300000);
}
if (Array.isArray(Appurls)) {
  keepAlive();
}

// Temp folder: keep downloads off the system /tmp and sweep them regularly.
const customTemp = path.join(process.cwd(), "temp");
if (!fs.existsSync(customTemp)) {
  fs.mkdirSync(customTemp, {
    recursive: true
  });
}
process.env.TMPDIR = customTemp;
process.env.TEMP = customTemp;
process.env.TMP = customTemp;

setInterval(() => {
  try {
    fs.readdir(customTemp, (err, files) => {
      if (err) {
        return;
      }
      for (const file of files) {
        const filePath = path.join(customTemp, file);
        fs.stat(filePath, (err2, stats) => {
          if (!err2 && Date.now() - stats.mtimeMs > 3 * 60 * 60 * 1000) {
            fs.unlink(filePath, () => {});
          }
        });
      }
    });
  } catch (err) {}
}, 5 * 60 * 1000).unref();
async function MakeSession(sessionId = SESSION_ID, folderName = __dirname + baileys, useGuru = false) {
  let resolvedSessionId = ("" + sessionId).replace(/^SESSION_\d{2}_\d{2}_\d{2}_\d{2}_/gi, "").replace(/^SESSION_ID_\d{2}_\d{2}_\d{2}_\d{2}_/gi, "").replace(/^SUHAIL_\d{2}_\d{2}_\d{2}_\d{2}_/gi, "").replace(/Secktor;;;/gi, "").replace(/Vorterx;;;/gi, "").replace(/Suhail;;;/gi, "").trim();
  
  try {
    resolvedSessionId = require("./creds.js").stripSessionPrefix(resolvedSessionId);
  } catch (err) {}
  function decodeCreds(encoded) {
    return Buffer.from(encoded, "base64").toString("utf-8");
  }
  function sessionExists(checkId, filePath) {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, "utf8", (err, content) => {
        if (err) {
          resolve(false);
        } else {
          resolve(content.includes(checkId));
        }
      });
    });
  }
  
  const officialBuild = (await sessionExists("/SuhailTechInfo/", "./Dockerfile")) || toBool(useGuru || global.IS_SUHAIL || process.env.IS_SUHAIL, true);
  if (!officialBuild) {
    log("\n\nYou are using a Modified Version. Please Run Bot from the Original Repository.\nDeploy From : https://github.com/GlobalTechInfo/Suhail-Md-3.0\n");
  }
  
  SmdOfficial = "yes";
  if (!fs.existsSync(folderName)) {
      fs.mkdirSync(folderName);
    }
    
    if (isMegaCode(resolvedSessionId)) {
      const existingPath = path.join(folderName, "creds.json");
      let alreadyLinked = false;
      try {
        alreadyLinked = JSON.parse(fs.readFileSync(existingPath, "utf8")).registered === true;
      } catch (err) {}
      if (alreadyLinked && process.env.SESSION_ID_FORCE !== "1") {
        log("🔒 Existing session is already linked — skipping SESSION_ID import.");
        log("   (delete lib/Suhail_Baileys/ to re-link, or set SESSION_ID_FORCE=1 to override)\n");
        return;
      }
      const imported = await downloadMegaCreds(resolvedSessionId, existingPath, {
        logger: (...a) => log(...a)
      });
      if (!imported.ok) {
        log("\n⚠️  SESSION_ID not usable: " + imported.reason);
        log("Nothing was written. Clearing the session and falling back to QR / pairing code.\n");
        purgeSession(folderName);
        return;
      }
      log("✅ Session imported.");
      return;
    } else if (resolvedSessionId) {
      try {
        log("Checking Session ID!");
        
        if (/[#!]/.test(resolvedSessionId)) {
          log("\n\u26a0\ufe0f  SESSION_ID is a truncated MEGA code ('" + resolvedSessionId + "').");
          log("A '#' inside .env starts a comment, so the rest of the code was thrown away.");
          log('Quote the whole value:\n    SESSION_ID="' + resolvedSessionId + '#<the-rest-of-the-code>"\n');
          log("Clearing the session and falling back to QR / pairing code.\n");
          purgeSession(folderName);
          return;
        }
        var decodedCreds = decodeCreds(resolvedSessionId);
        const files = JSON.parse(decodedCreds);
        if (files["creds.json"]) {
          for (const fileName in files) {
            try {
              fs.writeFileSync(folderName + fileName, typeof files[fileName] == "string" ? files[fileName] : JSON.stringify(files[fileName], null, 2));
            } catch (err) {}
          }
        } else {
          fs.writeFileSync(folderName + "creds.json", JSON.stringify(files, null, 2));
        }
        log("\nCredentials Saved Successfully.");
      } catch (err) {
        log("INVALID SESSION_ID ERROR FROM SERVER\nPLEASE SCAN THE QR AGAIN FROM [ " + global.scan + " ]\n\n\nERROR : ", err);
      }
    }
}
async function main() {
  if (mongodb && mongodb.includes("mongodb")) {
    try {
      isMongodb = await connnectMongo();
    } catch {}
  }
  if (!global.isMongodb && global.DATABASE_URL && !["false", "null"].includes(global.DATABASE_URL)) {
    try {
      global.sqldb = await connnectpg();
    } catch {}
  }
}
module.exports = {
  init: MakeSession,
  connect: syncdb,
  logger: global.Debug,
  DATABASE: {
    sync: main
  }
};
