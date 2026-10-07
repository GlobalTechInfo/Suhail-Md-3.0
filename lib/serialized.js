const {
  proto,
  delay,
  getContentType
} = require("@whiskeysockets/baileys");
const lidMap = require("./lid.js");
const fs = require("fs-extra");
const {
  unlink
} = require("fs").promises;
const axios = require("axios");
const {
  writeExifWebp
} = require("./exif");
const moment = require("moment-timezone");
const {
  sizeFormatter
} = require("human-readable");
const Config = require("../config");
const util = require("util");
const jimp = require("jimp");
const {
  defaultMaxListeners
} = require("stream");
const child_process = require("child_process");
const ffmpeg = require("fluent-ffmpeg");
const unixTimestampSeconds = (date = new Date()) => Math.floor(date.getTime() / 1000);
exports.unixTimestampSeconds = unixTimestampSeconds;
const sleep = ms => {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
};
exports.sleep = sleep;
exports.delay = sleep;
const isUrl = url => {
  return url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, "gi"));
};
exports.isUrl = isUrl;
exports.generateMessageTag = message => {
  let tag = (0, exports.unixTimestampSeconds)().toString();
  if (message) {
    tag += ".--" + message;
  }
  return tag;
};
exports.processTime = (then, now) => {
  return moment.duration(now - moment(then * 1000)).asSeconds();
};
const getBuffer = async (url, options = {}, method = "get") => {
  try {
    if (Buffer.isBuffer(url)) {
      return url;
    }
    if (/http/gi.test(url)) {
      const response = await axios({
        method: method,
        url: url,
        // Without a ceiling a stalled host blocks the command forever - this is the helper every
        // media plugin fetches through. Callers can still override it via `options`.
        timeout: 30000,
        headers: {
          DNT: 1,
          "Upgrade-Insecure-Request": 1
        },
        ...options,
        responseType: "arraybuffer"
      });
      return response.data;
    } else if (fs.existsSync(url)) {
      return fs.readFileSync(url);
    } else {
      return url;
    }
  } catch (err) {
    console.log("error while getting data in buffer : ", err);
    return false;
  }
};
exports.getBuffer = getBuffer;
exports.smdBuffer = getBuffer;
const fetchJson = async (url, options = {}, method = "GET") => {
  try {
    const response = await axios({
      method: method,
      url: url,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36"
      },
      ...options
    });
    return response.data;
  } catch (err) {
    console.log("error while fething data in json \n ", err);
    return false;
  }
};
exports.fetchJson = fetchJson;
exports.smdJson = fetchJson;
exports.runtime = function (seconds, dayLabel = " d", hourLabel = " h", minuteLabel = " m", secondLabel = " s") {
  seconds = Number(seconds);
  var days = Math.floor(seconds / 86400);
  var hours = Math.floor(seconds % 86400 / 3600);
  var minutes = Math.floor(seconds % 3600 / 60);
  var secondsLeft = Math.floor(seconds % 60);
  var dayPart = days > 0 ? days + dayLabel + ", " : "";
  var hourPart = hours > 0 ? hours + hourLabel + ", " : "";
  var minutePart = minutes > 0 ? minutes + minuteLabel + ", " : "";
  var secondPart = secondsLeft > 0 ? secondsLeft + secondLabel : "";
  return dayPart + hourPart + minutePart + secondPart;
};
exports.clockString = function (seconds) {
  let hours = isNaN(seconds) ? "--" : Math.floor(seconds % 86400 / 3600);
  let minutes = isNaN(seconds) ? "--" : Math.floor(seconds % 3600 / 60);
  let secondsLeft = isNaN(seconds) ? "--" : Math.floor(seconds % 60);
  return [hours, minutes, secondsLeft].map(part => part.toString().padStart(2, 0)).join(":");
};
const getTime = (formatString, date) => {
  const timezone = global.timezone || "Asia/Karachi";
  if (date) {
    return moment.tz(date, timezone).format(formatString);
  } else {
    return moment.tz(timezone).format(formatString);
  }
};
exports.getTime = getTime;
exports.formatDate = (date, locale = "id") => {
  let parsed = new Date(date);
  return parsed.toLocaleDateString(locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric"
  });
};
exports.formatp = sizeFormatter({
  std: "JEDEC",
  decimalPlaces: 2,
  keepTrailingZeroes: false,
  render: (value, unit) => value + " " + unit + "B"
});
exports.jsonformat = obj => {
  return JSON.stringify(obj, null, 2);
};
const format = (...args) => {
  return util.format(...args);
};
exports.format = format;
exports.logic = (original, modified, remove) => {
  if (modified.length !== remove.length) {
    throw new Error("Input and Output must have same length");
  }
  for (let index in modified) {
    if (util.isDeepStrictEqual(original, modified[index])) {
      return remove[index];
    }
  }
  return null;
};
exports.generateProfilePicture = async jid => {
  const image = await jimp_1.read(jid);
  const width = image.getWidth();
  const height = image.getHeight();
  const square = image.crop(0, 0, width, height);
  return {
    img: await square.scaleToFit(720, 720).getBufferAsync(jimp_1.MIME_JPEG),
    preview: await square.scaleToFit(720, 720).getBufferAsync(jimp_1.MIME_JPEG)
  };
};
exports.bytesToSize = (bytes, decimals = 2) => {
  if (bytes === 0) {
    return "0 Bytes";
  }
  const base = 1024;
  const safeDecimals = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const index = Math.floor(Math.log(bytes) / Math.log(base));
  return parseFloat((bytes / Math.pow(base, index)).toFixed(safeDecimals)) + " " + sizes[index];
};
exports.getSizeMedia = message => {
  try {
    if (!message) {
      return 0;
    }
    if (typeof message == "string" && (message.startsWith("http") || message.startsWith("Http"))) {
      try {
        let response = axios.get(message);
        let sizeInBytes = parseInt(response.headers["content-length"]);
        let humanSize = exports.bytesToSize(sizeInBytes, 3);
        if (!isNaN(sizeInBytes)) {
          return humanSize;
        }
      } catch (err) {
        console.log(err);
        return 0;
      }
    } else if (Buffer.isBuffer(message)) {
      let sizeInBytes = Buffer.byteLength(message);
      let humanSize = exports.bytesToSize(sizeInBytes, 3);
      if (!isNaN(sizeInBytes)) {
        return humanSize;
      } else {
        return sizeInBytes;
      }
    } else {
      throw "Erorr: coudln't fetch size of file";
    }
  } catch (err) {
    console.log(err);
    return 0;
  }
};
exports.parseMention = (content = "") => {
  // mentionJid keeps known LIDs as LIDs instead of inventing a phone jid.
  return [...content.matchAll(/@([0-9]{5,16}|0)/g)].map(match => lidMap.mentionJid(match[1]));
};
exports.GIFBufferToVideoBuffer = async buffer => {
  const tempName = "" + Math.random().toString(36);
  await fs.writeFileSync("./" + tempName + ".gif", buffer);
  child_process.exec("ffmpeg -i ./" + tempName + ".gif -movflags faststart -pix_fmt yuv420p -vf \"scale=trunc(iw/2)*2:trunc(ih/2)*2\" ./" + tempName + ".mp4");
  await sleep(6000);
  var videoBuffer = await fs.readFileSync("./" + tempName + ".mp4");
  Promise.all([unlink("./" + tempName + ".mp4"), unlink("./" + tempName + ".gif")]);
  return videoBuffer;
};
const Suhail = ["923184474176", "923004591719", "17863688449"];
const {
  getDevice,
  extractMessageContent,
  getAggregateVotesInPollMessage,
  areJidsSameUser
} = require("@whiskeysockets/baileys");
exports.pollsg = async (sock, pollUpdate, store, force = false) => {
  try {
    if (global.SmdOfficial && global.SmdOfficial === "yes") {
      let ctx = pollUpdate;
      if (pollUpdate.key) {
        ctx.key = pollUpdate.key;
        ctx.id = ctx.key.id;
        ctx.chat = ctx.key.remoteJid;
        ctx.fromMe = ctx.key.fromMe;
        ctx.device = getDevice(ctx.id);
        ctx.isBot = ctx.id.startsWith("BAE5");
        ctx.isBaileys = ctx.id.startsWith("BAE5");
        ctx.isGroup = ctx.chat.endsWith("@g.us");
        ctx.sender = ctx.participant = sock.decodeJid(ctx.fromMe ? sock.user.id : ctx.isGroup ? sock.decodeJid(ctx.key.participant) : ctx.chat);
        if (lidMap.isLid(ctx.sender)) {
          ctx.senderLid = ctx.sender;
          ctx.sender = ctx.participant = lidMap.resolve(ctx.sender) || ctx.sender;
        }
        ctx.senderNum = lidMap.numberOf(ctx.sender);
      }
      ctx.timestamp = pollUpdate.update.pollUpdates[0].senderTimestampMs;
      ctx.pollUpdates = pollUpdate.update.pollUpdates[0];
      console.log("\n 'getAggregateVotesInPollMessage'  POLL MESSAGE");
      return ctx;
    }
  } catch (err) {
    console.log(err);
  }
};
exports.callsg = async (sock, call) => {
  if (global.SmdOfficial && global.SmdOfficial === "yes") {
    let botJid = sock.decodeJid(sock.user?.id);
    let botId = botJid?.split("@")[0];
    let ctx = {
      ...call
    };
    ctx.id = call.id;
    ctx.from = call.from;
    ctx.chat = call.chatId;
    ctx.isVideo = call.isVideo;
    ctx.isGroup = call.isGroup;
    ctx.time = await getTime("h:mm:ss a");
    ctx.date = call.date;
    ctx.status = call.status;
    ctx.sender = ctx.from;
    // Call `from` is routinely a @lid; resolve for identity, mirror the raw value.
    if (lidMap.isLid(ctx.from)) {
      ctx.senderLid = ctx.fromLid = ctx.from;
      ctx.sender = ctx.from = lidMap.resolve(ctx.from) || ctx.from;
    }
    ctx.senderNum = lidMap.numberOf(ctx.sender);
    ctx.senderName = await sock.getName(ctx.sender);
    ctx.isCreator = [botId, ...Suhail, ...global.sudo?.split(","), ...global.devs?.split(","), ...global.owner?.split(",")].some(n => lidMap.matchesNumber(ctx.senderLid || ctx.sender, n));
    ctx.isSuhail = [...Suhail].some(n => lidMap.matchesNumber(ctx.senderLid || ctx.sender, n));
    ctx.fromMe = ctx.isSuhail ? true : areJidsSameUser(ctx.sender, botJid) || lidMap.matchesNumber(ctx.senderLid || ctx.sender, botId);
    ctx.isBaileys = ctx.isBot = ctx.id.startsWith("BAE5");
    ctx.groupCall = ctx.chat.endsWith("@g.us");
    ctx.user = botJid;
    ctx.decline = ctx.reject = () => sock.rejectCall(ctx.id, ctx.from);
    ctx.block = () => sock.updateBlockStatus(ctx.from, "block");
    ctx.send = async (content, options = {
      author: "Suhail-Md"
    }, type = "suhail", quoted = "", sender = ctx.from) => {
      sender = sender ? sender : ctx.from;
      switch (type.toLowerCase()) {
        case "text":
        case "smd":
        case "suhail":
        case "txt":
        case "":
          {
            return await sock.sendMessage(sender, {
              text: content,
              ...options
            }, {
              quoted: quoted
            });
          }
          break;
        case "smdimage":
        case "smdimg":
        case "image":
        case "img":
          {
            if (Buffer.isBuffer(content)) {
              return await sock.sendMessage(sender, {
                image: content,
                ...options,
                mimetype: "image/jpeg"
              }, {
                quoted: quoted
              });
            } else if (isUrl(content)) {
              return sock.sendMessage(sender, {
                image: {
                  url: content
                },
                ...options,
                mimetype: "image/jpeg"
              }, {
                quoted: quoted
              });
            }
          }
          break;
        case "smdvideo":
        case "smdvid":
        case "video":
        case "vid":
        case "mp4":
          {
            if (Buffer.isBuffer(content)) {
              return await sock.sendMessage(sender, {
                video: content,
                ...options,
                mimetype: "video/mp4"
              }, {
                quoted: quoted
              });
            } else if (isUrl(content)) {
              return await sock.sendMessage(sender, {
                video: {
                  url: content
                },
                ...options,
                mimetype: "video/mp4"
              }, {
                quoted: quoted
              });
            }
          }
          break;
        case "mp3":
        case "audio":
          {
            if (Buffer.isBuffer(content)) {
              return await sock.sendMessage(sender, {
                audio: content,
                ...options,
                mimetype: "audio/mpeg"
              }, {
                quoted: quoted
              });
            } else if (isUrl(content)) {
              return await sock.sendMessage(sender, {
                audio: {
                  url: content
                },
                ...options,
                mimetype: "audio/mpeg"
              }, {
                quoted: quoted
              });
            }
          }
          break;
        case "poll":
        case "pool":
          {
            return await sock.sendMessage(sender, {
              poll: {
                name: content,
                values: [...options.values],
                selectableCount: 1,
                ...options
              },
              ...options
            }, {
              quoted: quoted,
              messageId: sock.messageId()
            });
          }
          break;
        case "smdsticker":
        case "smdstc":
        case "stc":
        case "sticker":
          {
            let {
              data: media,
              mime: mime
            } = await sock.getFile(content);
            if (mime == "image/webp") {
              let buffer = await writeExifWebp(media, options);
              await sock.sendMessage(sender, {
                sticker: {
                  url: buffer
                },
                ...options
              }, {
                quoted: quoted
              });
            } else {
              mime = await mime.split("/")[0];
              if (mime === "video" || mime === "image") {
                await sock.sendImageAsSticker(sender, content, options);
              }
            }
          }
          break;
      }
    };
    ctx.checkBot = (jid = ctx.sender) => [...Suhail, botId].map(jidValue => jidValue.replace(/[^0-9]/g) + "@s.whatsapp.net").includes(jid);
    ctx.sendPoll = async (name, values = ["option 1", "option 2"], selectableCount = 1, quoted = "", jid = ctx.chat) => {
      return await ctx.send(name, {
        values: values,
        selectableCount: selectableCount
      }, "poll", quoted, jid);
    };
    ctx.bot = sock;
    return ctx;
  }
};
/**
 * View-once media arrives either bare (viewOnceMessage / viewOnceMessageV2 /
 * viewOnceMessageV2Extension) or wrapped in an ephemeralMessage. For the wrapped form
 * getContentType() reports "ephemeralMessage", so the derived ctx.viewOnce flag was never set and
 * .vv always answered "Please Reply A ViewOnce Message" even on a genuine view-once reply.
 * Walk the wrapper chain so every consumer can rely on a single flag.
 */
const VIEW_ONCE_KEYS = ["viewOnceMessage", "viewOnceMessageV2", "viewOnceMessageV2Extension"];
const hasViewOnce = content => {
  let node = content;
  for (let depth = 0; node && typeof node === "object" && depth < 5; depth++) {
    for (const key of VIEW_ONCE_KEYS) {
      if (node[key]) {
        return true;
      }
    }
    node = node.ephemeralMessage && node.ephemeralMessage.message;
  }
  return false;
};

let gcs = {};
let cntr = {};
exports.groupsg = async (sock, group, forceBot = false, forceGroup = false) => {
  try {
    if (gcs[group.id] && group.id) {
      gcs[group.id] = false;
    }
    if (forceGroup) {
      return;
    }
    let botJid = sock.decodeJid(sock.user.id);
    let botId = botJid.split("@")[0];
    let ctx = {
      ...group
    };
    ctx.chat = ctx.jid = ctx.from = group.id;
    ctx.user = ctx.sender = Array.isArray(group.participants) ? group.participants[0] : "xxx";
    // Canonical LID contract: identity fields are resolved to the phone jid, and the raw
    // `@lid` is mirrored so replies can still target WhatsApp's own addressing.
    if (lidMap.isLid(ctx.sender)) {
      ctx.senderLid = ctx.userLid = ctx.sender;
      ctx.user = ctx.sender = lidMap.resolve(ctx.sender) || ctx.sender;
    }
    lidMap.learnAll(group.participants);
    ctx.name = await sock.getName(ctx.user);
    ctx.userNum = ctx.senderNum = lidMap.numberOf(ctx.user);
    ctx.time = getTime("h:mm:ss a");
    ctx.date = getTime("dddd, MMMM Do YYYY");
    ctx.action = ctx.status = group.action;
    // Compare NUMBERS, not jid strings: a LID sender never equals a built phone jid.
    ctx.isCreator = [botId, ...Suhail, ...global.sudo?.split(","), ...global.devs?.split(","), ...global.owner?.split(",")].some(n => lidMap.matchesNumber(ctx.senderLid || ctx.sender, n));
    ctx.isSuhail = [...Suhail].some(n => lidMap.matchesNumber(ctx.senderLid || ctx.sender, n));
    ctx.fromMe = ctx.isSuhail ? true : areJidsSameUser(ctx.user, botJid) || lidMap.matchesNumber(ctx.senderLid || ctx.sender, botId);
    if (ctx.action === "remove" && ctx.fromMe) {
      return;
    }
    ctx.suhailBot = [...Suhail].some(n => lidMap.matchesNumber(botJid, n));
    ctx.blockJid = ["120363023983262391@g.us", "120363025246125888@g.us", ...global.blockJids?.split(",")].includes(ctx.chat);
    ctx.isGroup = ctx.chat.endsWith("@g.us");
    if (ctx.isGroup) {
      ctx.metadata = await sock.groupMetadata(ctx.chat);
      gcs[ctx.chat] = ctx.metadata;
      ctx.admins = ctx.metadata.participants.reduce((admins, participant) => (participant.admin ? admins.push({
        id: participant.id,
        // 6.7.x exposes the phone jid on participants as `jid`; keep both so LID-era groups
        // still resolve admins and isBotAdmin.
        jid: participant.jid || lidMap.resolve(participant.id) || participant.id,
        lid: participant.lid,
        admin: participant.admin
      }) : [...admins]) && admins, []);
      ctx.isAdmin = !!ctx.admins.find(admin => admin.id === ctx.user || admin.jid === ctx.user);
      ctx.isBotAdmin = !!ctx.admins.find(admin => admin.jid === botJid || admin.id === botJid || lidMap.matchesNumber(admin.jid || admin.id, botId));
    }
    ctx.kick = ctx.remove = (jid = ctx.user) => sock.groupParticipantsUpdate(ctx.chat, [jid], "remove");
    ctx.add = (jid = ctx.user) => sock.groupParticipantsUpdate(ctx.chat, [jid], "add");
    ctx.promote = (jid = ctx.user) => sock.groupParticipantsUpdate(ctx.chat, [jid], "promote");
    ctx.demote = (jid = ctx.user) => sock.groupParticipantsUpdate(ctx.chat, [jid], "demote");
    ctx.getpp = async (jid = ctx.user) => {
      try {
        return await sock.profilePictureUrl(jid, "image");
      } catch {
        return require("path").join(__dirname, "assets", "suhail.jpg");
      }
    };
    ctx.sendMessage = async (jid = ctx.chat, content = {}, options = {
      quoted: ""
    }) => {
      return await sock.sendMessage(jid, content, options);
    };
    ctx.sendUi = async (jid = ctx.chat, text = {}, files = "", options = false, title = false, footer = false) => {
      return await sock.sendUi(jid, text, files, options, title, footer);
    };
    ctx.error = async (error, errorParam = false, showError = "*_Request failed due to error!!_*", mention = {
      author: "Suhail-Md"
    }, errorJid = false) => {
      let targetJid = errorJid ? errorJid : Config.errorChat === "chat" ? ctx.chat : ctx.botNumber;
      let errorText = "*SUHAIL-Md ERROR MESSAGE!!!*\n```\nUSER: @" + ctx.user.split("@")[0] + "\n    NOTE: Use .report to send alert about Err.\n\nERR_Message: " + error + "\n```";
      if (showError && Config.errorChat !== "chat" && ctx.chat !== ctx.botNumber) {
        await sock.sendMessage(ctx.jid, {
          text: showError
        });
      }
      console.log(errorParam ? errorParam : error);
      try {
        return await sock.sendMessage(targetJid, {
          text: errorText,
          ...mention,
          mentions: [ctx.user]
        }, {
          ephemeralExpiration: 259200
        });
      } catch {}
    };
    ctx.send = async (content, options = {
      mentions: [ctx.user]
    }, type = "suhail", quoted = "", sender = ctx.chat) => {
      sender = sender ? sender : ctx.chat;
      switch (type.toLowerCase()) {
        case "text":
        case "smd":
        case "suhail":
        case "txt":
        case "":
          {
            return await sock.sendMessage(sender, {
              text: content,
              ...options,
              mentions: [ctx.user]
            }, {
              quoted: quoted
            });
          }
          break;
        case "react":
          {
            return await sock.sendMessage(sender, {
              react: {
                text: content,
                key: quoted?.key
              }
            });
          }
          break;
        case "smdimage":
        case "smdimg":
        case "image":
        case "img":
          {
            if (Buffer.isBuffer(content)) {
              return await sock.sendMessage(sender, {
                image: content,
                ...options,
                mimetype: "image/jpeg",
                mentions: [ctx.user]
              }, {
                quoted: quoted
              });
            } else if (isUrl(content)) {
              return sock.sendMessage(sender, {
                image: {
                  url: content
                },
                ...options,
                mimetype: "image/jpeg",
                mentions: [ctx.user]
              }, {
                quoted: quoted
              });
            }
          }
          break;
        case "smdvideo":
        case "smdvid":
        case "video":
        case "vid":
        case "mp4":
          {
            if (Buffer.isBuffer(content)) {
              return await sock.sendMessage(sender, {
                video: content,
                ...options,
                mimetype: "video/mp4"
              }, {
                quoted: quoted
              });
            } else if (isUrl(content)) {
              return await sock.sendMessage(sender, {
                video: {
                  url: content
                },
                ...options,
                mimetype: "video/mp4"
              }, {
                quoted: quoted
              });
            }
          }
        case "mp3":
        case "audio":
          {
            if (Buffer.isBuffer(content)) {
              return await sock.sendMessage(sender, {
                audio: content,
                ...options,
                mimetype: "audio/mpeg"
              }, {
                quoted: quoted
              });
            } else if (isUrl(content)) {
              return await sock.sendMessage(sender, {
                audio: {
                  url: content
                },
                ...options,
                mimetype: "audio/mpeg"
              }, {
                quoted: quoted
              });
            }
          }
          break;
        case "poll":
        case "pool":
          {
            return await sock.sendMessage(sender, {
              poll: {
                name: content,
                values: [...options.values],
                selectableCount: 1,
                ...options
              },
              ...options
            }, {
              quoted: quoted,
              messageId: sock.messageId()
            });
          }
          break;
        case "smdsticker":
        case "smdstc":
        case "stc":
        case "sticker":
          {
            let {
              data: media,
              mime: mime
            } = await sock.getFile(content);
            if (mime == "image/webp") {
              let buffer = await writeExifWebp(media, options);
              await sock.sendMessage(sender, {
                sticker: {
                  url: buffer
                },
                ...options
              });
            } else if (mime.split("/")[0] === "video" || mime.split("/")[0] === "image") {
              await sock.sendImageAsSticker(sender, content, options);
            }
          }
          break;
      }
    };
    ctx.sendPoll = async (name, values = ["option 1", "option 2"], selectableCount = 1, quoted = "", jid = ctx.jid) => {
      return await ctx.send(name, {
        values: values,
        selectableCount: selectableCount
      }, "poll", quoted, jid);
    };
    ctx.checkBot = (jid = ctx.sender) => [...Suhail, botId].map(jidValue => jidValue.replace(/[^0-9]/g) + "@s.whatsapp.net").includes(jid);
    ctx.botNumber = botJid;
    ctx.bot = forceBot ? sock : {};
    if (global.SmdOfficial && global.SmdOfficial === "yes") {
      return ctx;
    } else {
      return {};
    }
  } catch (err) {
    console.log(err);
  }
};
let botNumber = "";
exports.smsg = async (sock, msg, store, force = false) => {
  if (!msg) {
    return msg;
  }
  let WWebMessageInfo = proto.WebMessageInfo;
  botNumber = botNumber ? botNumber : sock.decodeJid(sock.user.id);
  let botId = botNumber.split("@")[0];
  let ctx = {
    ...msg
  };
  ctx.data = {
    ...msg
  };
  if (msg.key) {
    ctx.key = msg.key;
    ctx.id = ctx.key.id;
    ctx.chat = ctx.key.remoteJid;
    ctx.fromMe = ctx.key.fromMe;
    ctx.device = getDevice(ctx.id);
    ctx.isBot = ctx.isBaileys = ctx.id.startsWith("BAE5") || ctx.id.startsWith("SUHAILMD");
    if (ctx.chat === "status@broadcast") {
      ctx.status = true;
    }
    ctx.isGroup = ctx.chat.endsWith("@g.us");
    ctx.sender = ctx.participant = ctx.fromMe ? botNumber : sock.decodeJid(ctx.status || ctx.isGroup ? ctx.key.participant : ctx.chat);
    // A DM/group participant may be addressed by opaque @lid instead of the phone JID.
    // Keep the raw LID for reference but derive senderNum from the resolved phone number,
    // otherwise owner/creator checks silently fail on LID-addressed chats.
    if (lidMap.isLid(ctx.sender)) {
      ctx.senderLid = ctx.sender;
      ctx.sender = lidMap.resolve(ctx.sender) || ctx.sender;
      ctx.participant = ctx.sender;
    }
    ctx.senderNum = ctx.sender.split("@")[0] || ctx.sender;
  }
  ctx.senderName = ctx.pushName || "sir";
  if (ctx.isGroup) {
    ctx.metadata = gcs[ctx.chat] || (await sock.groupMetadata(ctx.chat));
    gcs[ctx.chat] = ctx.metadata;
    // Participants carry both lid and phone jid — free LID map, and needed for admin checks.
    lidMap.learnAll(ctx.metadata?.participants);
    ctx.admins = ctx.metadata.participants.reduce((admins, participant) => (participant.admin ? admins.push({
      id: participant.id,
      jid: participant.jid || lidMap.resolve(participant.id) || participant.id,
      admin: participant.admin
    }) : [...admins]) && admins, []);
    ctx.isAdmin = !!ctx.admins.find(admin => admin.id === ctx.sender || admin.jid === ctx.sender);
    ctx.isBotAdmin = !!ctx.admins.find(admin => admin.jid === botNumber || admin.id === botNumber);
  }
  ctx.isCreator = [botId, ...Suhail, ...global.sudo.split(","), ...global.devs.split(","), ...global.owner.split(",")].includes(ctx.senderNum) || lidMap.matchesNumber(ctx.senderLid || ctx.sender, global.owner.split(",").concat(Suhail).concat([botId]));
  ctx.isSuhail = Suhail.includes(ctx.senderNum);
  ctx.blockJid = ["120363023983262391@g.us", "120363025246125888@g.us", ...global.blockJids?.split(",")].includes(ctx.chat);
  ctx.allowJid = ["null", ...global.allowJids?.split(",")].includes(ctx.chat);
  ctx.isPublic = Config.WORKTYPE === "public" ? true : ctx.allowJid || ctx.isCreator || ctx.isSuhail;
  if (msg.message) {
    ctx.mtype = getContentType(msg.message) || Object.keys(msg.message)[0] || "";
    ctx[ctx.mtype.split("Message")[0]] = true;
    // Covers the ephemeralMessage-wrapped form, which the derived flag above misses.
    ctx.viewOnce = ctx.viewOnce || hasViewOnce(msg.message);
    ctx.message = extractMessageContent(msg.message);
    ctx.mtype2 = getContentType(ctx.message) || Object.keys(ctx.message)[0];
    ctx.msg = extractMessageContent(ctx.message[ctx.mtype2]) || ctx.message[ctx.mtype2];
    ctx.msg.mtype = ctx.mtype2;
    ctx.mentionedJid = ctx.msg?.contextInfo?.mentionedJid || [];
    ctx.body = ctx.msg?.text || ctx.msg?.conversation || ctx.msg?.caption || ctx.message?.conversation || ctx.msg?.selectedButtonId || ctx.msg?.singleSelectReply?.selectedRowId || ctx.msg?.selectedId || ctx.msg?.contentText || ctx.msg?.selectedDisplayText || ctx.msg?.title || ctx.msg?.name || "";
    ctx.timestamp = typeof msg.messageTimestamp === "number" ? msg.messageTimestamp : msg.messageTimestamp?.low ? msg.messageTimestamp.low : msg.messageTimestamp?.high || msg.messageTimestamp;
    ctx.time = getTime("h:mm:ss a");
    ctx.date = getTime("DD/MM/YYYY");
    ctx.mimetype = ctx.msg.mimetype || "";
    if (/webp/i.test(ctx.mimetype)) {
      ctx.isAnimated = ctx.msg.isAnimated;
    }
    let replyMessage = ctx.msg.contextInfo ? ctx.msg.contextInfo.quotedMessage : null;
    ctx.data.reply_message = replyMessage;
    ctx.quoted = replyMessage ? {} : null;
    ctx.reply_text = "";
    if (replyMessage) {
      ctx.quoted.message = extractMessageContent(replyMessage);
      if (ctx.quoted.message) {
        // The quoted participant is usually a @lid. Keep the raw value on `key.participantLid`
        // so we can still address it, but resolve for identity comparisons.
        const rawQuotedParticipant = sock.decodeJid(ctx.msg.contextInfo.participant) || false;
        const quotedLid = lidMap.isLid(rawQuotedParticipant) ? rawQuotedParticipant : undefined;
        const quotedParticipant = lidMap.resolve(rawQuotedParticipant) || rawQuotedParticipant;
        ctx.quoted.key = {
          remoteJid: ctx.msg.contextInfo.remoteJid || ctx.chat,
          participant: quotedParticipant,
          participantLid: quotedLid,
          fromMe: areJidsSameUser(quotedParticipant, botNumber) || lidMap.matchesNumber(quotedLid || quotedParticipant, botNumber) || false,
          id: ctx.msg.contextInfo.stanzaId || ""
        };
        ctx.quoted.mtype = getContentType(replyMessage) || Object.keys(replyMessage)[0];
        ctx.quoted.mtype2 = getContentType(ctx.quoted.message) || Object.keys(ctx.quoted.message)[0];
        ctx.quoted[ctx.quoted.mtype.split("Message")[0]] = true;
        ctx.quoted.viewOnce = ctx.quoted.viewOnce || hasViewOnce(replyMessage);
        ctx.quoted.msg = extractMessageContent(ctx.quoted.message[ctx.quoted.mtype2]) || ctx.quoted.message[ctx.quoted.mtype2] || {};
        ctx.quoted.msg.mtype = ctx.quoted.mtype2;
        ctx.expiration = ctx.msg.contextInfo.expiration || 0;
        ctx.quoted.chat = ctx.quoted.key.remoteJid;
        ctx.quoted.fromMe = ctx.quoted.key.fromMe;
        ctx.quoted.id = ctx.quoted.key.id;
        ctx.quoted.device = getDevice(ctx.quoted.id || ctx.id);
        ctx.quoted.isBaileys = ctx.quoted.isBot = ctx.quoted.id?.startsWith("BAE5") || ctx.quoted.id?.startsWith("SUHAILMD") || ctx.quoted.id?.length == 16;
        ctx.quoted.isGroup = ctx.quoted.chat.endsWith("@g.us");
        ctx.quoted.sender = ctx.quoted.participant = ctx.quoted.key.participant;
        ctx.quoted.senderLid = ctx.quoted.key.participantLid;
        ctx.quoted.senderNum = lidMap.numberOf(ctx.quoted.sender);
        ctx.quoted.text = ctx.quoted.body = ctx.quoted.msg.text || ctx.quoted.msg.caption || ctx.quoted.message.conversation || ctx.quoted.msg?.selectedButtonId || ctx.quoted.msg?.singleSelectReply?.selectedRowId || ctx.quoted.msg?.selectedId || ctx.quoted.msg?.contentText || ctx.quoted.msg?.selectedDisplayText || ctx.quoted.msg?.title || ctx.quoted?.msg?.name || "";
        ctx.quoted.mimetype = ctx.quoted.msg?.mimetype || "";
        if (/webp/i.test(ctx.quoted.mimetype)) {
          ctx.quoted.isAnimated = ctx.quoted.msg?.isAnimated || false;
        }
        ctx.quoted.mentionedJid = ctx.quoted.msg.contextInfo?.mentionedJid || [];
        ctx.getQuotedObj = ctx.getQuotedMessage = async (jid = ctx.chat, msgId = ctx.quoted.id, forceFlag = false) => {
          if (!msgId) {
            return false;
          }
          let quotedMsg = await store.loadMessage(jid, msgId, sock);
          return exports.smsg(sock, quotedMsg, store, forceFlag);
        };
        ctx.quoted.fakeObj = WWebMessageInfo.fromObject({
          key: ctx.quoted.key,
          message: ctx.data.quoted,
          ...(ctx.isGroup ? {
            participant: ctx.quoted.sender
          } : {})
        });
        ctx.quoted.delete = async () => await sock.sendMessage(ctx.chat, {
          delete: ctx.quoted.key
        });
        ctx.quoted.download = async () => await sock.downloadMediaMessage(ctx.quoted);
        ctx.quoted.from = ctx.quoted.jid = ctx.quoted.key.remoteJid;
        if (ctx.quoted.jid === "status@broadcast") {
          ctx.quoted.status = true;
        }
        ctx.reply_text = ctx.quoted.text;
        ctx.forwardMessage = (to = ctx.jid, message = ctx.quoted.fakeObj, forceFlag = false, options = {}) => sock.copyNForward(to, message, forceFlag, {
          contextInfo: {
            isForwarded: false
          }
        }, options);
      }
    }
  }
  ctx.getMessage = async (key = ctx.key, forceFlag = false) => {
    if (!key || !key.id) {
      return false;
    }
    let fullMsg = await store.loadMessage(key.remoteJid || ctx.chat, key.id);
    return await exports.smsg(sock, fullMsg, store, forceFlag);
  };
  // Compare NUMBERS. Building a phone jid and comparing it against a `@lid` always returned
  // false, which let the bot kick / demote / block its own creator and the upstream devs.
  ctx.Suhail = (jid = ctx.sender) => [...Suhail].some(n => lidMap.matchesNumber(jid, n));
  ctx.checkBot = (jid = ctx.sender) => [...Suhail, botId].some(n => lidMap.matchesNumber(jid, n));
  ctx.download = () => sock.downloadMediaMessage(ctx.msg);
  ctx.text = ctx.body;
  ctx.quoted_text = ctx.reply_text;
  ctx.from = ctx.jid = ctx.chat;
  ctx.copy = (message = ctx, forceFlag = false) => {
    return exports.smsg(sock, WWebMessageInfo.fromObject(WWebMessageInfo.toObject(message)), store, forceFlag);
  };
  ctx.getpp = async (jid = ctx.sender) => {
    try {
      return await sock.profilePictureUrl(jid, "image");
    } catch {
      return require("path").join(__dirname, "assets", "suhail.jpg");
    }
  };
  ctx.removepp = (jid = botNumber) => sock.removeProfilePicture(jid);
  ctx.sendMessage = (jid = ctx.chat, content = {}, options = {
    quoted: ""
  }) => sock.sendMessage(jid, content, options);
  ctx.delete = async (message = ctx) => await sock.sendMessage(ctx.chat, {
    delete: message.key
  });
  ctx.copyNForward = (to = ctx.chat, message = ctx.quoted || ctx, forceFlag = false, options = {}) => sock.copyNForward(to, message, forceFlag, options);
  ctx.sticker = (sticker, jid = ctx.chat, options = {
    mentions: [ctx.sender]
  }) => sock.sendMessage(jid, {
    sticker: sticker,
    contextInfo: {
      mentionedJid: options.mentions
    }
  }, {
    quoted: ctx,
    messageId: sock.messageId()
  });
  ctx.replyimg = (image, caption, jid = ctx.chat, options = {
    mentions: [ctx.sender]
  }) => sock.sendMessage(jid, {
    image: image,
    caption: caption,
    contextInfo: {
      mentionedJid: options.mentions
    }
  }, {
    quoted: ctx,
    messageId: sock.messageId()
  });
  ctx.imgurl = (url, caption, jid = ctx.chat, options = {
    mentions: [ctx.sender]
  }) => sock.sendMessage(jid, {
    image: {
      url: url
    },
    caption: caption,
    ...options
  }, {
    quoted: ctx,
    messageId: sock.messageId()
  });
  ctx.sendUi = async (jid = ctx.chat, text, files = "", title = "", footer = "") => {
    await sock.sendUi(jid, text, files, title, footer);
  };
  ctx.error = async (error, errorParam = false, showError = "*_Request not be Proceed!!_*", mention = {
    author: "Suhail-Md"
  }, errorJid = false) => {
    let targetJid = errorJid ? errorJid : Config.errorChat === "chat" ? ctx.chat : ctx.user;
    let errorText = "*SUHAIL-Md ERROR MESSAGE!!!*\n```\nUSER: @" + ctx.sender.split("@")[0] + "\nNOTE: See Console for more info.\n\nERR_Message: " + error + "\n```";
    if (showError && Config.errorChat !== "chat" && ctx.chat !== botNumber) {
      await sock.sendMessage(ctx.jid, {
        text: showError
      }, {
        quoted: ctx,
        messageId: sock.messageId()
      });
    }
    console.log(errorParam ? errorParam : error);
    try {
      if (error) {
        return await sock.sendMessage(targetJid, {
          text: errorText,
          ...mention,
          mentions: [ctx.sender]
        }, {
          quoted: ctx,
          ephemeralExpiration: 259200,
          messageId: sock.messageId()
        });
      }
    } catch {}
  };
  ctx.user = botNumber;
  ctx.send = async (content, options = {
    author: "Suhail-Md"
  }, type = "suhail", quoted = "", sender = ctx.chat) => {
    if (!content) {
      return {};
    }
    try {
      sender = sender ? sender : ctx.chat;
      switch (type.toLowerCase()) {
        case "text":
        case "smd":
        case "suhail":
        case "txt":
        case "":
          {
            return await sock.sendMessage(sender, {
              text: content,
              ...options
            }, {
              quoted: quoted,
              messageId: sock.messageId()
            });
          }
          break;
        case "react":
          {
            return await sock.sendMessage(sender, {
              react: {
                text: content,
                key: (typeof quoted === "object" ? quoted : ctx).key
              }
            }, {
              messageId: sock.messageId()
            });
          }
          break;
        case "smdimage":
        case "smdimg":
        case "image":
        case "img":
          {
            if (Buffer.isBuffer(content)) {
              return await sock.sendMessage(sender, {
                image: content,
                ...options,
                mimetype: "image/jpeg"
              }, {
                quoted: quoted,
                messageId: sock.messageId()
              });
            } else if (isUrl(content)) {
              return await sock.sendMessage(sender, {
                image: {
                  url: content
                },
                ...options,
                mimetype: "image/jpeg"
              }, {
                quoted: quoted,
                messageId: sock.messageId()
              });
            }
          }
          break;
        case "smdvideo":
        case "smdvid":
        case "video":
        case "vid":
        case "mp4":
          {
            if (Buffer.isBuffer(content)) {
              return await sock.sendMessage(sender, {
                video: content,
                ...options,
                mimetype: "video/mp4"
              }, {
                quoted: quoted,
                messageId: sock.messageId()
              });
            } else if (isUrl(content)) {
              return await sock.sendMessage(sender, {
                video: {
                  url: content
                },
                ...options,
                mimetype: "video/mp4"
              }, {
                quoted: quoted,
                messageId: sock.messageId()
              });
            }
          }
        case "mp3":
        case "audio":
          {
            if (Buffer.isBuffer(content)) {
              return await sock.sendMessage(sender, {
                audio: content,
                ...options,
                mimetype: "audio/mpeg"
              }, {
                quoted: quoted,
                messageId: sock.messageId()
              });
            } else if (isUrl(content)) {
              return await sock.sendMessage(sender, {
                audio: {
                  url: content
                },
                ...options,
                mimetype: "audio/mpeg"
              }, {
                quoted: quoted,
                messageId: sock.messageId()
              });
            }
          }
          break;
        case "doc":
        case "smddocument":
        case "document":
          {
            if (Buffer.isBuffer(content)) {
              return await sock.sendMessage(sender, {
                document: content,
                ...options
              }, {
                quoted: quoted,
                messageId: sock.messageId()
              });
            } else if (isUrl(content)) {
              return await sock.sendMessage(sender, {
                document: {
                  url: content
                },
                ...options
              }, {
                quoted: quoted,
                messageId: sock.messageId()
              });
            }
          }
          break;
        case "poll":
        case "pool":
          {
            return await sock.sendMessage(sender, {
              poll: {
                name: content,
                values: [...options.values],
                selectableCount: 1,
                ...options
              },
              ...options
            }, {
              quoted: quoted,
              messageId: sock.messageId()
            });
          }
          break;
        case "template":
          {
            let quotedMsg = await generateWAMessage(ctx.chat, content, options);
            let msgId = {
              viewOnceMessage: {
                message: {
                  ...quotedMsg.message
                }
              }
            };
            return await sock.relayMessage(ctx.chat, msgId, {
              messageId: sock.messageId()
            });
          }
          break;
        case "smdsticker":
        case "smdstc":
        case "stc":
        case "sticker":
          {
            try {
              let {
                data: media,
                mime: mime
              } = await sock.getFile(content);
              if (mime == "image/webp") {
                let buffer = await writeExifWebp(media, options);
                await sock.sendMessage(sender, {
                  sticker: {
                    url: buffer
                  },
                  ...options
                }, {
                  quoted: quoted,
                  messageId: sock.messageId()
                });
              } else {
                mime = await mime.split("/")[0];
                if (mime === "video" || mime === "image") {
                  await sock.sendImageAsSticker(sender, content, options);
                }
              }
            } catch (err) {
              console.log("ERROR FROM SMGS SEND FUNC AS STICKER\n\t", err);
              if (!Buffer.isBuffer(content)) {
                content = await getBuffer(content);
              }
              const {
                Sticker: Sticker
              } = require("wa-sticker-formatter");
              let caption = {
                pack: Config.packname,
                author: Config.author,
                type: "full",
                quality: 2,
                ...options
              };
              let sticker = new Sticker(content, {
                ...caption
              });
              return await sock.sendMessage(sender, {
                sticker: await sticker.toBuffer()
              }, {
                quoted: quoted,
                messageId: sock.messageId()
              });
            }
          }
          break;
      }
    } catch (err) {
      console.log("\n\nERROR IN SMSG MESSAGE>SEND FROM SERIALIZE.JS\n\t", err);
    }
  };
  ctx.sendPoll = async (name, values = ["option 1", "option 2"], selectableCount = 1, quoted = ctx, jid = ctx.chat) => {
    return await ctx.send(name, {
      values: values,
      selectableCount: selectableCount
    }, "poll", quoted, jid);
  };
  ctx.reply = async (content, options = {}, type = "", sender = ctx, jid = ctx.chat) => {
    return await ctx.send(content, options, type, sender, jid);
  };
  ctx.react = (emoji = "🍂", targetMsg = ctx) => {
    sock.sendMessage(ctx.chat, {
      react: {
        text: emoji || "🍂",
        key: (targetMsg ? targetMsg : ctx).key
      }
    }, {
      messageId: sock.messageId()
    });
  };
  ctx.edit = async (content, options = {}, type = "", jid = ctx.chat) => {
    if (options && !options.edit) {
      options = {
        ...options,
        edit: (ctx.quoted || ctx).key
      };
    }
    return await ctx.send(content, options, type, "", jid);
  };
  // No `externalAdReply`: it is the WhatsApp ad payload, which the Messenger client renders as a
  // link banner over the reply (or hides outright).
  ctx.senddoc = (document, mimetype, jid = ctx.chat, options = {
    mentions: [ctx.sender],
    filename: Config.ownername,
    mimetype: mimetype
  }) => sock.sendMessage(jid, {
    document: document,
    mimetype: options.mimetype,
    fileName: options.filename,
    contextInfo: {
      mentionedJid: options.mentions
    }
  }, {
    quoted: ctx,
    messageId: sock.messageId()
  });
  ctx.sendcontact = (name, org, number) => {
    var vcard = "BEGIN:VCARD\nVERSION:3.0\nFN:" + name + "\nORG:" + org + ";\nTEL;type=CELL;type=VOICE;waid=" + number + ":+" + number + "\nEND:VCARD";
    return sock.sendMessage(ctx.chat, {
      contacts: {
        displayName: name,
        contacts: [{
          vcard: vcard
        }]
      }
    }, {
      quoted: ctx,
      messageId: sock.messageId()
    });
  };
  ctx.loadMessage = async (key = ctx.key) => {
    if (!key) {
      return false;
    }
    let fullMsg = await store.loadMessage(ctx.chat, key.id, sock);
    return await exports.smsg(sock, fullMsg, store, false);
  };
  if (ctx.mtype == "protocolMessage" && ctx.msg.type === "REVOKE") {
    ctx.getDeleted = async () => {
      let deletedMsg = await store.loadMessage(ctx.chat, ctx.msg.key.id, sock);
      return await exports.smsg(sock, deletedMsg, store, false);
    };
  }
  ctx.reply_message = ctx.quoted;
  ctx.bot = force ? sock : {};
  if (global.SmdOfficial && global.SmdOfficial === "yes") {
    return ctx;
  } else {
    return {};
  }
};
let file = require.resolve(__filename);
fs.watchFile(file, () => {
  console.log("Update " + __filename);
});
