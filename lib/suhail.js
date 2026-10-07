// #=============================================#
// #                 v.1.3.4                     #
// # █▀▀▀█ █  █ █  █ ▄▀▀▄ ▀█▀ █     █▀▄▀█ █▀▀▄   #
// # ▀▀▀▄▄ █  █ █▀▀█ █▄▄█  █  █     █ █ █ █  █   #
// # █▄▄▄█ ▀▄▄▀ █  █ █  █ ▄█▄ █▄▄█  █   █ █▄▄▀   #
// #      𝗠𝗨𝗟𝗧𝗜𝗗𝗘𝗩𝗜𝗖𝗘 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗨𝗦𝗘𝗥 𝗕𝗢𝗧      #
// #=============================================#
const axios = require("axios");
const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs-extra");
const util = require("util");
const exec = util.promisify(require("child_process").exec);
const Jimp = require("jimp");
const fetch = require("node-fetch");
const {
  getBuffer,
  fetchJson,
  runtime,
  sleep,
  isUrl,
  GIFBufferToVideoBuffer
} = require("./serialized");
let sides = "*";
const {
  tlang,
  TelegraPh,
  createUrl,
  dare,
  truth,
  random_question
} = require("./scraper");
const {
  bot_
} = require("./schemes");
const Config = require("../config.js");
let caption = Config.caption || "";
const {
  Innertube,
  UniversalCache,
  Utils
} = require("youtubei.js");
const {
  existsSync,
  mkdirSync,
  createWriteStream
} = require("fs");
const {
  type
} = require("os");
let yt = {};
yt.getInfo = async (url, options = {}) => {
  try {
    if (!global.SmdOfficial) {
      return;
    }
    const innertube = await Innertube.create({
      cache: new UniversalCache(false),
      generate_session_locally: true
    });
    let info = await innertube.getInfo(url, options);
    let qualities = [];
    for (let i = 0; i < info.streaming_data.formats.length; i++) {
      await qualities.push(info.streaming_data.formats[i].quality_label);
    }
    let quality = qualities.includes("360p") ? "360p" : "best";
    let ytConfig = {
      status: true,
      title: info.basic_info.title,
      id: info.basic_info.id,
      quality: qualities,
      pref_Quality: quality,
      duration: info.basic_info.duration,
      description: info.basic_info.short_description,
      keywords: info.basic_info.keywords,
      thumbnail: info.basic_info.thumbnail[0].url,
      author: info.basic_info.author,
      views: info.basic_info.view_count,
      likes: info.basic_info.like_count,
      category: info.basic_info.category,
      channel: info.basic_info.channel,
      basic_info: info
    };
    return ytConfig;
  } catch (err) {
    console.log("./lib/suhail/yt.getInfo()\n", err.message);
    return {
      status: false
    };
  }
};
yt.download = async (url, options = {
  type: "video",
  quality: "best",
  format: "mp4"
}) => {
  try {
    if (!global.SmdOfficial) {
      return;
    }
    const innertube = await Innertube.create({
      cache: new UniversalCache(false),
      generate_session_locally: true
    });
    let mediaType = options.type ? options.type : "video";
    let audioQuality = mediaType === "audio" ? "best" : options.quality ? options.quality : "best";
    let format = options.format ? options.format : "mp4";
    const stream = await innertube.download(url, {
      type: mediaType,
      quality: audioQuality,
      format: format
    });
    const tempDir = "./temp";
    if (!existsSync(tempDir)) {
      mkdirSync(tempDir);
    }
    let ext = mediaType === "video" ? "mp4" : "m4a";
    let outPath = tempDir + "/Suhail-Md " + url + "." + ext;
    var writeStream = createWriteStream(outPath);
    for await (const chunk of Utils.streamToIterable(stream)) {
      writeStream.write(chunk);
    }
    return outPath;
  } catch (err) {
    console.log("./lib/suhail/yt.dowanload()\n", err.message);
    return false;
  }
};
async function sendAnimeReaction(ctx, category = "punch", text = "", animeCaption = "") {
  try {
    var anime = await fetchJson("https://api.waifu.pics/sfw/" + category);
    const response = await axios.get(anime.url, {
      responseType: "arraybuffer"
    });
    const buffer = Buffer.from(response.data, "utf-8");
    let target = ctx.mentionedJid ? ctx.mentionedJid[0] : ctx.quoted ? ctx.quoted.sender : false;
    let videoBuffer = await GIFBufferToVideoBuffer(buffer);
    let reactionCaption = target ? sides + "@" + ctx.sender.split("@")[0] + " " + text + " @" + target.split("@")[0] + sides : sides + "@" + ctx.sender.split("@")[0] + " " + animeCaption + sides;
    if (target) {
      return await ctx.bot.sendMessage(ctx.chat, {
        video: videoBuffer,
        gifPlayback: true,
        mentions: [target, ctx.sender],
        caption: reactionCaption
      }, {
        quoted: ctx,
        messageId: ctx.bot.messageId()
      });
    } else {
      return await ctx.bot.sendMessage(ctx.chat, {
        video: videoBuffer,
        gifPlayback: true,
        mentions: [ctx.sender],
        caption: reactionCaption
      }, {
        quoted: ctx,
        messageId: ctx.bot.messageId()
      });
    }
  } catch (err) {
    return await ctx.error(err + "\nERROR AT : /lib/Suhail.js/sendAnimeReaction()\n\ncommand: " + category);
  }
}
async function sendGImages(ctx, query, galleryCaption = caption, quoted = "") {
  try {
    let googleIt = require("async-g-i-s");
    let results = await googleIt(query);
    // Google returns nothing at all for a data-centre IP, and results[NaN].url then threw a
    // TypeError that surfaced as the useless "Request not be Proceed!!" banner. Say what broke.
    if (!Array.isArray(results) || results.length === 0) {
      // Google blocks this host's IP outright. Still deliver a picture rather than an error.
      const key = (global.WAIFU_IM_API_KEY || process.env.WAIFU_IM_API_KEY || "").trim();
      const r = await axios.get("https://api.waifu.im/images", {
        params: { PageSize: 1, IsNsfw: "False", OrderBy: "Random" },
        headers: key ? { "X-Api-Key": key } : {},
        timeout: 25000
      });
      const item = r.data && r.data.items && r.data.items[0];
      if (!item || !item.url) {
        return ctx.reply("*_Could not reach any image source right now. Try again shortly._*");
      }
      return await ctx.bot.sendMessage(ctx.chat, {
        image: {
          url: item.url
        },
        caption: galleryCaption
      }, {
        quoted: ctx,
        messageId: ctx.bot.messageId()
      });
    }
    let imageUrl = results[Math.floor(Math.random() * results.length)].url;
    let gallery = {
      image: {
        url: imageUrl
      },
      caption: galleryCaption
    };
    return await ctx.bot.sendMessage(ctx.chat, gallery, {
      quoted: ctx,
      messageId: ctx.bot.messageId()
    });
  } catch (err) {
    await ctx.error(err);
    return console.log("./lib/Suhail.js/sendGImages()\n", err);
  }
}
async function AudioToBlackVideo(audio, video) {
  try {
    try {
      fs.unlinkSync(video);
    } catch (err) {}
    const durationCmd = "ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 " + audio;
    const {
      stdout: duration
    } = await exec(durationCmd);
    const seconds = parseFloat(duration);
    let blackScreen = "./temp/blackScreen.mp4";
    try {
      fs.unlinkSync(blackScreen);
    } catch (err) {}
    const createCmd = "ffmpeg -f lavfi -i color=c=black:s=1280x720:d=" + seconds + " -vf \"format=yuv420p\" " + blackScreen;
    await exec(createCmd);
    const mergeCmd = "ffmpeg -i " + blackScreen + " -i " + audio + " -c:v copy -c:a aac -map 0:v:0 -map 1:a:0 " + video;
    await exec(mergeCmd);
    console.log("Audio converted to black screen video successfully!");
    return {
      result: true
    };
  } catch (err) {
    console.error("./lib/Aviator.js/AudioToBlackVideo()\n", err);
    return {
      result: false
    };
  }
}
async function textToLogoGenerator(text, theme = "", text2 = "", font = "ser", api = "textpro", noBg = true) {
  let fromImage = {};
  let fromText = {};
  let logoUrl = /1|ephoto|ephoto360/gi.test(api) ? "https://ephoto360.com/" + theme + ".html" : /2|potoxy|photooxy/gi.test(api) ? "https://photooxy.com/" + theme + ".html" : /3|enphoto|en360/gi.test(api) ? "https://en.ephoto360.com/" + theme + ".html" : "https://textpro.me/" + theme + ".html";
  try {
    const {
      textpro: response
    } = require("mumaker");
    if (text2) {
      fromImage = await response(logoUrl, [text2, font]);
    }
    let logoData = {} || {
      ...(await text.bot.contextInfo("ᴛᴇxᴛ ᴛᴏ ʟᴏɢᴏ", "Hello " + text.senderName))
    };
    return await text.bot.sendMessage(text.jid, {
      image: {
        url: fromImage.image
      },
      caption: caption,
      contextInfo: logoData
    }, {
      messageId: text.bot.messageId()
    });
  } catch (err) {
    try {
      let textLogoUrl = global.api_smd + ("/api/maker?text1=" + text2 + "&text2=" + font + "&url=" + logoUrl);
      fromText = await fetchJson(textLogoUrl);
      if ((!fromText || !fromText.status || !fromText.img) && noBg) {
        return text.error(err + "\nWebinfo:" + (fromText.img || fromText) + "\n\nfileName: textToLogoGenerator->s.js", err);
      }
      await text.bot.sendMessage(text.jid, {
        image: {
          url: fromText.img
        }
      }, {
        messageId: text.bot.messageId()
      });
    } catch (errY) {
      let logoData = fromImage && fromImage.image ? fromImage.image : fromText && fromText.img ? fromText.img : false;
      if (noBg) {
        text.error(err + "\n\nAPI Error : " + errY + "\n\nfileName: textToLogoGenerator->s.js", err, (logoData ? "Here we go\n\n" + logoData : "Error, Request Denied!").trim());
      }
    }
  }
}
async function photoEditor(ctx, style = "ad", text = "", sendImage = true) {
  let mediaTypes = ["imageMessage"];
  try {
    let quoted = mediaTypes.includes(ctx.mtype) ? ctx : ctx.reply_message;
    if (!quoted || !mediaTypes.includes(quoted?.mtype || "null")) {
      return await ctx.send("*_Uhh Dear, Reply to an image_*");
    }
    let mediaPath = await ctx.bot.downloadAndSaveMediaMessage(quoted);
    
    let imageUrl = await createUrl(mediaPath);
    try {
      fs.unlinkSync(mediaPath);
    } catch (err) {}
    if (!imageUrl) {
      return await ctx.send("*_Couldn't upload your image to process it_*");
    }
   
    const params = ["image=" + encodeURIComponent(imageUrl)];
    if (style === "gun") {
      params.push("text=" + encodeURIComponent(text || "pew pew"));
    }
    if (style === "colorify") {
      const hex = String(text || "").match(/^#?([0-9a-f]{6})$/i);
      params.push("color=" + (hex ? hex[1] : "7289da"));
    }
    const effectUrl = "https://api.popcat.xyz/v2/" + style + "?" + params.join("&");
    
    const result = await axios.get(effectUrl, {
      responseType: "arraybuffer",
      timeout: 90000,
      maxContentLength: Infinity,
      maxBodyLength: Infinity
    });
    if (!result.data || !result.data.length) {
      return await ctx.send("*_That effect produced an empty image_*");
    }
    const isGif = String(result.headers["content-type"] || "").includes("gif");
    return await ctx.bot.sendMessage(ctx.chat, {
      [isGif ? "gif" : "image"]: {
        buffer: Buffer.from(result.data)
      },
      mimetype: result.headers["content-type"] || (isGif ? "image/gif" : "image/png"),
      caption: text
    }, {
      quoted: ctx,
      messageId: ctx.bot.messageId()
    });
  } catch (err) {
    if (sendImage) {
      await ctx.error(err + "\n\ncommand: " + style + "\nfileName: photoEditor->s.js", err);
    }
  }
}
async function plugins(ctx, action, url = "", quoted = "") {
  let output = "";
  try {
    let botSettings = (await bot_.findOne({
      id: "bot_" + ctx.user
    })) || (await bot_.new({
      id: "bot_" + ctx.user
    }));
    let pluginList = botSettings.plugins;
    if (action.toLowerCase() === "install") {
      let pluginListText = "";
      for (let pluginUrl of isUrl(url)) {
        var parsedUrl = new URL(pluginUrl.replace(/[_*]+$/, ""));
        parsedUrl = parsedUrl.href.includes("raw") ? parsedUrl.href : parsedUrl.href + "/raw";
        const {
          data: pluginSource
        } = await axios.get(parsedUrl);
        let nameMatch = /pattern: ["'](.*)["'],/g.exec(pluginSource) || /cmdname: ["'](.*)["'],/g.exec(pluginSource) || /name: ["'](.*)["'],/g.exec(pluginSource);
        if (!nameMatch) {
          output += "*gist not found:* _" + parsedUrl + "_ \n";
          continue;
        }
        let pluginName = nameMatch[1].split(" ")[0] || Math.random().toString(36).slice(-5);
        let pluginFile = pluginName.replace(/[^A-Za-z]/g, "");
        if (pluginListText.includes(pluginFile)) {
          continue;
        } else {
          pluginListText = pluginListText + "[\"" + pluginFile + "\"] ";
        }
        if (pluginList[pluginFile]) {
          output += "*Plugin _'" + pluginFile + "'_ already installed!*\n";
          continue;
        }
        let filename = quoted + "/" + pluginFile + ".smd";
        await fs.writeFileSync(filename, pluginSource, "utf8");
        try {
          require(filename);
        } catch (err) {
          fs.unlinkSync(filename);
          output += "*Invalid :* _" + parsedUrl + "_\n ```" + err + "```\n\n ";
          continue;
        }
        if (!pluginList[pluginFile]) {
          pluginList[pluginFile] = parsedUrl;
          await bot_.updateOne({
            id: "bot_" + ctx.user
          }, {
            plugins: pluginList
          });
          output += "*Plugin _'" + pluginFile + "'_ Succesfully installed!*\n";
        }
      }
    } else if (action.toLowerCase() === "remove") {
      if (url === "all") {
        let pluginSource = "";
        for (const name in pluginList) {
          try {
            fs.unlinkSync(quoted + "/" + name + ".smd");
            pluginSource = "" + pluginSource + name + ",";
          } catch (err) {
            console.log("❌ " + name + " ❌ NOT BE REMOVED", err);
          }
        }
        await bot_.updateOne({
          id: "bot_" + ctx.user
        }, {
          plugins: {}
        });
        output = "*External plugins " + (pluginSource ? pluginSource : "all") + " removed!!!*";
      } else {
        try {
          if (pluginList[url]) {
            try {
              fs.unlinkSync(quoted + "/" + url + ".smd");
            } catch {}
            delete pluginList[url];
            await bot_.updateOne({
              id: "bot_" + ctx.user
            }, {
              plugins: pluginList
            });
            output += "*Plugin _'" + url + "'_ Succesfully removed!*";
          } else {
            output += "*_plugin not exist in " + Config.botname + "_*";
          }
        } catch (err) {
          console.log("Error while removing plugins \n ", err);
        }
      }
    } else if (action.toLowerCase() === "plugins") {
      if (url) {
        output = pluginList[url] ? "*_" + url + ":_* " + pluginList[url] : false;
      } else {
        for (const name in pluginList) {
          output += "*" + (name + 1) + ":* " + name + " \n*Url:* " + pluginList[name] + "\n\n";
        }
      }
    }
    return output;
  } catch (err) {
    console.log("Plugins : ", err);
    return (output + " \n\nError: " + err).trim();
  }
}
async function updateProfilePicture(ctx, name, buffer, ppType = "pp") {
  try {
    if (ppType === "pp" || ppType === "gpp") {
      let mediaPath = await ctx.bot.downloadAndSaveMediaMessage(buffer);
      await ctx.bot.updateProfilePicture(name, {
        url: mediaPath
      });
    } else {
      async function applyCrop(filePath) {
        const image = await Jimp.read(filePath);
        const width = image.getWidth();
        const height = image.getHeight();
        const square = image.crop(0, 0, width, height);
        return {
          img: await square.scaleToFit(324, 720).getBufferAsync(Jimp.MIME_JPEG),
          preview: await square.normalize().getBufferAsync(Jimp.MIME_JPEG)
        };
      }
      try {
        const downloaded = await buffer.download();
        const {
          query: response
        } = ctx.bot;
        const {
          preview: profileResponse
        } = await applyCrop(downloaded);
        await response({
          tag: "iq",
          attrs: {
            to: name,
            type: "set",
            xmlns: "w:profile:picture"
          },
          content: [{
            tag: "picture",
            attrs: {
              type: "image"
            },
            content: profileResponse
          }]
        });
      } catch (err) {
        let mediaPath = await ctx.bot.downloadAndSaveMediaMessage(buffer);
        await ctx.bot.updateProfilePicture(name, {
          url: mediaPath
        });
        return await ctx.error(err + " \n\ncommand: update pp", err, false);
      }
    }
    return await ctx.reply("*_Profile icon updated Succesfully!!_*");
  } catch (err) {
    return await ctx.error(err + " \n\ncommand: " + (ppType ? ppType : "pp"), err);
  }
}
async function forwardMessage(ctx, quoted, force = "") {
  let quotedType = quoted.quoted.mtype;
  let buffer;
  if (quotedType === "videoMessage" && force === "ptv") {
    buffer = {
      ptvMessage: {
        ...quoted.quoted
      }
    };
  } else if (quotedType === "videoMessage") {
    buffer = {
      videoMessage: {
        ...quoted.quoted
      }
    };
  } else if (quotedType === "imageMessage") {
    buffer = {
      imageMessage: {
        ...quoted.quoted
      }
    };
  } else if (quotedType === "audioMessage") {
    buffer = {
      audioMessage: {
        ...quoted.quoted
      }
    };
  } else if (quotedType === "documentMessage") {
    buffer = {
      documentMessage: {
        ...quoted.quoted
      }
    };
  } else if (quotedType === "conversation" || quotedType === "extendedTextMessage") {
    return await quoted.send(quoted.quoted.text, {}, "", quoted, ctx);
  }
  if (buffer) {
    try {
      await Suhail.bot.relayMessage(ctx, buffer, {
        messageId: quoted.key.id
      });
    } catch (err) {
      console.log("Error in " + force + "-cmd in forwardMessage \n", err);
      if (force === "ptv" || force === "save") {
        await quoted.error(err);
      }
    }
  }
}
async function generateSticker(ctx, media, options = {
  pack: Config.packname,
  author: Config.author
}, sendSticker = true) {
  try {
    const {
      Sticker: Sticker,
      createSticker: StickerCtor,
      StickerTypes: quoted
    } = require("wa-sticker-formatter");
    let sticker = new Sticker(media, {
      ...options
    });
    return await ctx.bot.sendMessage(ctx.chat, {
      sticker: await sticker.toBuffer()
    }, {
      quoted: ctx,
      messageId: ctx.bot.messageId()
    });
  } catch (err) {
    if (sendSticker) {
      await ctx.error(err + "\n\nfileName: generateSticker->s.js\n");
    }
  }
}
async function getRandom(ext = ".jpg", size = 10000) {
  return "" + Math.floor(Math.random() * size) + ext;
}
async function randomeFunfacts(ctx) {
  try {
    if (ctx === "question") {
      return await random_question();
    } else if (ctx === "truth") {
      return await truth();
    } else if (ctx === "dare") {
      return await dare();
    } else if (ctx === "joke") {
      const joke = await (await fetch("https://official-joke-api.appspot.com/random_joke")).json();
      return "*Joke :* " + joke.setup + "\n*Punchline:*  " + joke.punchline;
    } else if (ctx === "joke2") {
      const joke = await (await fetch("https://v2.jokeapi.dev/joke/Any?type=single")).json();
      return "*joke :* " + joke.joke;
    } else if (ctx === "fact") {
      const {
        data: response
      } = await axios.get("https://nekos.life/api/v2/fact");
      return "*Fact:* " + response.fact;
    } else if (ctx === "quotes") {
      const {
        data: quoted
      } = await axios.get("https://favqs.com/api/qotd");
      return "╔════◇\n║ *🎗️Content:* " + quoted.quote.body + "\n║ *👤Author:* " + quoted.quote.author + "\n║\n╚════════════╝";
    }
  } catch (err) {
    msg.error(err);
    console.log("./lib/Suhail.js/randomeFunfacts()\n", err);
  }
}
async function audioEditor(ctx, audioType = "bass", quoted = "") {
  if (!ctx.quoted) {
    return await ctx.send("*_Uhh Dear, Reply to audio!!!_*");
  }
  let mtype = ctx.quoted.mtype || ctx.mtype;
  if (!/audio/.test(mtype)) {
    return await ctx.send("*_Reply to the audio you want to change with_*", {}, "", quoted);
  }
  try {
    let audioFilter = "-af equalizer=f=54:width_type=o:width=2:g=20";
    if (/bass/.test(audioType)) {
      audioFilter = "-af equalizer=f=54:width_type=o:width=2:g=20";
    }
    if (/blown/.test(audioType)) {
      audioFilter = "-af acrusher=.1:1:64:0:log";
    }
    if (/deep/.test(audioType)) {
      audioFilter = "-af atempo=4/4,asetrate=44500*2/3";
    }
    if (/earrape/.test(audioType)) {
      audioFilter = "-af volume=12";
    }
    if (/fast/.test(audioType)) {
      audioFilter = "-filter:a \"atempo=1.63,asetrate=44100\"";
    }
    if (/fat/.test(audioType)) {
      audioFilter = "-filter:a \"atempo=1.6,asetrate=22100\"";
    }
    if (/nightcore/.test(audioType)) {
      audioFilter = "-filter:a atempo=1.06,asetrate=44100*1.25";
    }
    if (/reverse/.test(audioType)) {
      audioFilter = "-filter_complex \"areverse\"";
    }
    if (/robot/.test(audioType)) {
      audioFilter = "-filter_complex \"afftfilt=real='hypot(re,im)*sin(0)':imag='hypot(re,im)*cos(0)':win_size=512:overlap=0.75\"";
    }
    if (/slow/.test(audioType)) {
      audioFilter = "-filter:a \"atempo=0.7,asetrate=44100\"";
    }
    if (/smooth/.test(audioType)) {
      audioFilter = "-filter:v \"minterpolate='mi_mode=mci:mc_mode=aobmc:vsbmc=1:fps=120'\"";
    }
    if (/tupai/.test(audioType)) {
      audioFilter = "-filter:a \"atempo=0.5,asetrate=65100\"";
    }
    let mediaPath = await ctx.bot.downloadAndSaveMediaMessage(ctx.quoted);
    let outPath = "temp/" + (ctx.sender.slice(6) + audioType) + ".mp3";
    exec("ffmpeg -i " + mediaPath + " " + audioFilter + " " + outPath, async (err, unused, done) => {
      try {
        fs.unlinkSync(mediaPath);
      } catch {}
      ;
      if (err) {
        return ctx.error(err);
      } else {
        let buffer = fs.readFileSync(outPath);
        try {
          fs.unlinkSync(outPath);
        } catch {}
        ;
        var audioReply = {
          ...(await ctx.bot.contextInfo("Hellow " + ctx.senderName + " 🤍", "⇆ㅤ ||◁ㅤ❚❚ㅤ▷||ㅤ ⇆"))
        };
        return ctx.bot.sendMessage(ctx.chat, {
          audio: buffer,
          mimetype: "audio/mpeg",
          ptt: /ptt|voice/.test(ctx.test || "") ? true : false,
          contextInfo: audioReply
        }, {
          quoted: ctx,
          messageId: ctx.bot.messageId()
        });
      }
    });
  } catch (err) {
    await ctx.error(err + "\n\ncmdName : " + audioType + "\n");
    return console.log("./lib/Suhail.js/audioEditor()\n", err);
  }
}
async function send(ctx, content, options = {
  packname: "",
  author: "Suhail-Md"
}, msgType = "", sender = "", quoted = "") {
  if (!content || !ctx) {
    return;
  }
  try {
    let target = quoted ? quoted : ctx.chat;
    return await ctx.send(content, options, msgType, sender, target);
  } catch (err) {
    console.log("./lib/Suhail.js/send()\n", err);
  }
}
async function react(ctx, emoji, quoted = "") {
  try {
    if (!emoji || !ctx) {
      return;
    }
    let key = quoted && quoted.key ? quoted.key : ctx.key;
    return await ctx.bot.sendMessage(ctx.chat, {
      react: {
        text: emoji,
        key: key
      }
    }, {
      messageId: ctx.bot.messageId()
    });
  } catch (err) {
    console.log("./lib/Suhail.js/react()\n", err);
  }
}
let note = {
  info: "make sure to provide 1st parameter of bot number as {user:botNumber} ,and 2nd as note text|id"
};
note.addnote = async (jid, noteText) => {
  try {
    let botSettings = (await bot_.findOne({
      id: "bot_" + jid.user
    })) || (await bot_.new({
      id: "bot_" + jid.user
    }));
    let notes = botSettings.notes;
    let count = 0;
    while (notes[count] !== undefined) {
      count++;
    }
    notes[count] = noteText;
    await bot_.updateOne({
      id: "bot_" + jid.user
    }, {
      notes: notes
    });
    return {
      status: true,
      id: count,
      msg: "*New note added at ID: " + count + "*"
    };
  } catch (err) {
    console.log("note.addnote ERROR :  ", err);
    return {
      status: false,
      error: err,
      msg: "*Can't add new notes due to error!!*"
    };
  }
};
note.delnote = async (jid, noteText) => {
  try {
    let botSettings = (await bot_.findOne({
      id: "bot_" + jid.user
    })) || (await bot_.new({
      id: "bot_" + jid.user
    }));
    let notes = botSettings.notes;
    let errorText = "*Please provide valid note id!*";
    if (notes[noteText]) {
      delete notes[noteText];
      await bot_.updateOne({
        id: "bot_" + jid.user
      }, {
        notes: notes
      });
      errorText = "*Note with Id:" + noteText + " deleted successfully!*";
    }
    return {
      status: true,
      msg: errorText
    };
  } catch (err) {
    console.log("note.delnote  ERROR :  ", err);
    return {
      status: false,
      error: err,
      msg: "*Can't delete notes due to error!!*"
    };
  }
};
note.delallnote = async (jid, quoted = "") => {
  try {
    await bot_.updateOne({
      id: "bot_" + jid.user
    }, {
      notes: {}
    });
    return {
      status: true,
      msg: "*All saved notes deleted from server!*"
    };
  } catch (err) {
    console.log("note.delnote  ERROR :  ", err);
    return {
      status: false,
      error: err,
      msg: "*Request not be proceed, Sorry!*"
    };
  }
};
note.allnotes = async (jid, quoted = "") => {
  try {
    let botSettings = (await bot_.findOne({
      id: "bot_" + jid.user
    })) || (await bot_.new({
      id: "bot_" + jid.user
    }));
    let notes = botSettings.notes;
    let errorText = "*Please provide valid note id!*";
    if (quoted == "all" || !quoted) {
      let output = "";
      for (const id in notes) {
        output += "*NOTE " + id + ":* " + notes[id] + "\n\n";
      }
      errorText = output ? output : "*No notes found!*";
    } else if (quoted && notes[quoted]) {
      errorText = "*Note " + quoted + ":* " + notes[quoted];
    }
    return {
      status: true,
      msg: errorText
    };
  } catch (err) {
    console.log("note.delnote  ERROR :  ", err);
    return {
      status: false,
      error: err,
      msg: "*Can't delete notes due to error!!*"
    };
  }
};
async function sendWelcome(ctx, body = "", welcome = "", groupJid = "", welcomeType = "msg", mentions = false) {
  try {
    if (!global.SmdOfficial) {
      return "Get Ouut";
    }
    if (body) {
      if (ctx.isGroup) {
        body = body.replace(/@gname|&gname/gi, ctx.metadata.subject).replace(/@desc|&desc/gi, ctx.metadata.desc).replace(/@count|&count/gi, ctx.metadata.participants.length);
      }
      let welcomeText = body.replace(/@user|&user/gi, "@" + ctx.senderNum).replace(/@name|&name/gi, ctx.senderName || "_").replace(/@gname|&gname/gi, "").replace(/@desc|&desc/gi, "").replace(/@count|&count/gi, "1").replace(/@pp|&pp|@gpp|&gpp|@context|&context/g, "").replace(/@time|&time/gi, ctx.time).replace(/@date|&date/gi, ctx.date).replace(/@bot|&bot/gi, "" + Config.botname).replace(/@owner|&owner/gi, "" + Config.ownername).replace(/@caption|&caption/gi, caption).replace(/@gurl|@website|&gurl|&website|@link|&link/gi, gurl).replace(/@myyt|&myyt/gi, "www.youtube.com/SuhailTechInfo").replace(/@telegram|&telegram/gi, global.telegram || "https://t.me/suhail_md0").replace(/@channel|@yt_channel|&channel|&yt_channel/gi, global.YT_PRODUCT || global.YT_CHANNEL || global.YT_PROMOTE || global.YT || "www.youtube.com/SuhailTechInfo").replace(/@runtime|&runtime|@uptime|&uptime/gi, "" + runtime(process.uptime())).trim();
      try {
        welcomeText = welcomeText.replace(/@line|&line/gi, (await fetchJson("https://api.popcat.xyz/pickuplines")).pickupline || "");
      } catch (err) {
        welcomeText = welcomeText.replace(/@line|&line/gi, "");
      }
      try {
        if (/@quote|&quote/gi.test(welcomeText)) {
          let {
            data: botSettings
          } = await axios.get("https://favqs.com/api/qotd");
          if (botSettings && botSettings.quote) {
            welcomeText = welcomeText.replace(/@quote|&quote/gi, botSettings.quote.body || "").replace(/@author|&author/gi, botSettings.quote.author || "");
          }
        }
      } catch (err) {
        welcomeText = welcomeText.replace(/@quote|&quote|@author|&author/gi, "");
      }
      if (!welcomeType || welcomeType === "msg") {
        try {
          if (typeof groupJid === "string") {
            groupJid = groupJid.split(",");
          }
          if (/@user|&user/g.test(body) && !groupJid.includes(ctx.sender)) {
            groupJid.push(ctx.sender);
          }
        } catch (err) {
          console.log("ERROR : ", err);
        }
        var aittsReply = {
          ...(mentions || /@context|&context/g.test(body) ? await ctx.bot.contextInfo(Config.botname, ctx.pushName) : {}),
          mentionedJid: groupJid
        };
        if (/@pp/g.test(body)) {
          return await ctx.send(await ctx.getpp(), {
            caption: welcomeText,
            mentions: groupJid,
            contextInfo: aittsReply
          }, "image", welcome);
        } else if (ctx.jid && /@gpp/g.test(body)) {
          return await ctx.send(await ctx.getpp(ctx.jid), {
            caption: welcomeText,
            mentions: groupJid,
            contextInfo: aittsReply
          }, "image", welcome);
        } else {
          return await ctx.send(welcomeText, {
            mentions: groupJid,
            contextInfo: aittsReply
          }, "suhail", welcome);
        }
      } else {
        return welcomeText;
      }
    }
  } catch (err) {
    console.log("./lib/Suhail.js/sendWelcome()\n", err);
  }
}
async function aitts(ctx, text = "", useTTS = true) {
  try {
    if (!global.SmdOfficial || global.SmdOfficial !== "yes") {
      return "u bloody, Get out from here!!";
    }
    if (!ELEVENLAB_API_KEY || !ELEVENLAB_API_KEY.length > 8) {
      return ctx.reply("Dear, You Dont Have ELEVENLAB_API_KEY \nCreate ELEVENLAB KEY from below Link \nhttps://elevenlabs.io/\n\nAnd Set it in ELEVENLAB_API_KEY Var\n\n" + caption);
    }
    const numbers = ["21m00Tcm4TlvDq8ikWAM", "2EiwWnXFnvU5JabPnv8n", "AZnzlk1XvdvUeBnXmlld", "CYw3kZ02Hs0563khs1Fj", "D38z5RcWu1voky8WS1ja", "EXAVITQu4vr4xnSDxMaL", "ErXwobaYiN019PkySvjV", "GBv7mTt0atIp3Br8iCZE", "IKne3meq5aSn9XLyUdCD", "LcfcDJNUP1GQjkzn1xUU", "MF3mGyEYCl7XYWbV9V6O", "N2lVS1w4EtoT3dr4eOWO", "ODq5zmih8GrVes37Dizd", "SOYHLrjzK2X1ezoPC6cr", "TX3LPaxmHKxFdv7VOQHJ", "ThT5KcBeYPX3keUQqHPh", "TxGEqnHWrfWFTfGW9XjX", "VR6AewLTigWG4xSOukaG", "XB0fDUnXU5powFXDhCwa", "XrExE9yKIg1WjnnlVkGX", "Yko7PKHZNXotIFUBG7I9", "ZQe5CZNOzWyzPSCn5a3c", "Zlb1dXrM653N07WRdFW3", "bVMeCyTHy58xNoL34h3p", "flq6f7yk4E4fJM5XTYuZ", "g5CIjZEefAph4nQFvHAz", "jBpfuIE2acCO8z3wKNLl", "jsCqWAovK2LkecY7zXl4", "oWAxZDx7w5VEj9dCyTzz", "onwK4e9ZLuTAKqWW03F9", "pMsXgVXv3BLzUgSXRplE", "pNInz6obpgDQGcFmaJgB", "piTKgcLEGmPE4e6mEKli", "t0jbNlBVZ17f02VDIeMI", "wViXBPUzp2ZZixB1xQuM", "yoZ06aMxZJJ28mfd3POQ", "z9fAnlkpzviPz146aGWa", "zcAOhNBS3c14rBihAFp1", "zrHiDhphv9ZnVXBqCLjz"];
    const voiceId = parseInt(aitts_Voice_Id);
    if (!text && !ctx.isCreator) {
      return ctx.reply("*Uhh Dear, Please Provide text..!*\n*Example: _.aitts i am " + ctx.pushName + "._*");
    } else if (!text && ctx.isCreator || text === "setting" || text === "info") {
      return ctx.bot.sendMessage(ctx.jid, {
        text: "*Hey " + ctx.pushName + "!.*\n  _Please provide text!_\n  *Example:* _.aitts i am " + ctx.pushName + "._\n\n  *You Currently " + (!isNaN(voiceId) && voiceId > 0 && voiceId <= 39 ? "set Voice Id: " + voiceId + "*\nUpdate" : "not set any Specific Voice*\nAdd Specific") + " Voice: _.addvar AITTS_ID:35/4/32,etc._\n\n\n  *Also use available voices*```\n\n  1: Rachel\n  2: Clyde\n  3: Domi\n  4: Dave\n  5: Fin\n  6: Bella\n  7: Antoni\n  8: Thomas\n  9: Charlie\n  10: Emily\n  11: Elli\n  12: Callum\n  13: Patrick\n  14: Harry\n  15: Liam\n  16: Dorothy\n  17: Josh\n  18: Arnold\n  19: Charlotte\n  20: Matilda\n  21: Matthew\n  22: James\n  23: Joseph\n  24: Jeremy\n  25: Michael\n  26: Ethan\n  27: Gigi\n  28: Freya\n  29: Grace\n  30: Daniel\n  31: Serena\n  32: Adam\n  33: Nicole\n  34: Jessie\n  35: Ryan\n  36: suhail\n  37: Glinda\n  38: Giovanni\n  39: Mimi\n  ```" + ("\n\n  *Example:* _.aitts i am " + ctx.pushName + "_:36 \n  *OR:* _.aitts i am " + ctx.pushName + "_:suhail     \n\n\n  " + caption).trim()
      }, {
        messageId: ctx.bot.messageId()
      });
    }
    let voiceText = text;
    var index = 0 || Math.floor(Math.random() * numbers.length);
    let ok = false;
    if (!isNaN(voiceId) && voiceId > 0 && voiceId < 39) {
      ok = true;
      index = voiceId;
    }
    if (text && text.includes(":")) {
      let parts = text.split(":");
      let lang = parts[parts.length - 1].trim() || "";
      voiceText = parts.slice(0, parts.length - 1).join(":");
      if (lang.toLowerCase() === "richel" || lang === "1") {
        index = 0;
      } else if (lang.toLowerCase() === "clyde" || lang === "2") {
        index = 1;
      } else if (lang.toLowerCase() === "domi" || lang === "3") {
        index = 2;
      } else if (lang.toLowerCase() === "dave" || lang === "4") {
        index = 3;
      } else if (lang.toLowerCase() === "fin" || lang === "5") {
        index = 4;
      } else if (lang.toLowerCase() === "bella" || lang === "6") {
        index = 5;
      } else if (lang.toLowerCase() === "antoni" || lang === "7") {
        index = 6;
      } else if (lang.toLowerCase() === "thomas" || lang === "8") {
        index = 7;
      } else if (lang.toLowerCase() === "charlie" || lang === "9") {
        index = 8;
      } else if (lang.toLowerCase() === "emily" || lang === "10") {
        index = 9;
      } else if (lang.toLowerCase() === "elli" || lang === "11") {
        index = 10;
      } else if (lang.toLowerCase() === "callum" || lang === "12") {
        index = 11;
      } else if (lang.toLowerCase() === "patrick" || lang === "13") {
        index = 12;
      } else if (lang.toLowerCase() === "harry" || lang === "14") {
        index = 13;
      } else if (lang.toLowerCase() === "liam" || lang === "15") {
        index = 14;
      } else if (lang.toLowerCase() === "dorothy" || lang === "16") {
        index = 15;
      } else if (lang.toLowerCase() === "josh" || lang === "17") {
        index = 16;
      } else if (lang.toLowerCase() === "arnold" || lang === "18") {
        index = 17;
      } else if (lang.toLowerCase() === "charlotte" || lang === "19") {
        index = 18;
      } else if (lang.toLowerCase() === "matilda" || lang === "20") {
        index = 19;
      } else if (lang.toLowerCase() === "matthew" || lang === "21") {
        index = 20;
      } else if (lang.toLowerCase() === "james" || lang === "22") {
        index = 21;
      } else if (lang.toLowerCase() === "joseph" || lang === "23") {
        index = 22;
      } else if (lang.toLowerCase() === "jeremy" || lang === "24") {
        index = 23;
      } else if (lang.toLowerCase() === "michael" || lang === "25") {
        index = 24;
      } else if (lang.toLowerCase() === "ethan" || lang === "26") {
        index = 25;
      } else if (lang.toLowerCase() === "gigi" || lang === "27") {
        index = 26;
      } else if (lang.toLowerCase() === "freya" || lang === "28") {
        index = 27;
      } else if (lang.toLowerCase() === "grace" || lang === "29") {
        index = 28;
      } else if (lang.toLowerCase() === "daniel" || lang === "30") {
        index = 29;
      } else if (lang.toLowerCase() === "serena" || lang === "31") {
        index = 30;
      } else if (lang.toLowerCase() === "adam" || lang === "32") {
        index = 31;
      } else if (lang.toLowerCase() === "nicole" || lang === "33") {
        index = 32;
      } else if (lang.toLowerCase() === "jessie" || lang === "34") {
        index = 33;
      } else if (lang.toLowerCase() === "ryan" || lang === "35") {
        index = 34;
      } else if (lang.toLowerCase() === "suhail" || lang === "36") {
        index = 35;
      } else if (lang.toLowerCase() === "glinda" || lang === "37") {
        index = 36;
      } else if (lang.toLowerCase() === "giovanni" || lang === "38") {
        index = 37;
      } else if (lang.toLowerCase() === "mimi" || lang === "39") {
        index = 38;
      } else {
        voiceText = text;
        index = index;
      }
    }
    const aittsReply = {
      method: "POST",
      url: "https://api.elevenlabs.io/v1/text-to-speech/" + numbers[index],
      headers: {
        accept: "audio/mpeg",
        "content-type": "application/json",
        "xi-api-key": "" + ELEVENLAB_API_KEY
      },
      data: {
        text: voiceText
      },
      responseType: "arraybuffer"
    };
    const {
      data: aittsPayload
    } = await axios.request(aittsReply);
    if (!aittsPayload) {
      return await ctx.send("*_Request not be proceed!_*");
    }
    await ctx.sendMessage(ctx.from, {
      audio: aittsPayload,
      mimetype: "audio/mpeg",
      ptt: true
    }, {
      quoted: ctx,
      messageId: ctx.bot.messageId()
    });
  } catch (err) {
    if (useTTS) {
      await ctx.error(err + "\n\ncommand: aitts", err);
    }
  }
}
let setMention = {
  mention: false
};
setMention.status = async (ctx, force = false) => {
  try {
    setMention.mention = false;
    let botSettings = (await bot_.findOne({
      id: "bot_" + ctx.user
    })) || (await bot_.new({
      id: "bot_" + ctx.user
    }));
    let mentionAtCheck = botSettings.mention || {};
    if (force) {
      if (mentionAtCheck.status) {
        return await ctx.reply("_Mention Already Enabled!_");
      }
      mentionAtCheck.status = true;
      await bot_.updateOne({
        id: "bot_" + ctx.user
      }, {
        mention: mentionAtCheck
      });
      return await ctx.reply("_Mention Enabled!_");
    } else {
      if (!mentionAtCheck.status) {
        return await ctx.reply("_Mention Already Disabled!_");
      }
      mentionAtCheck.status = false;
      await bot_.updateOne({
        id: "bot_" + ctx.user
      }, {
        mention: mentionAtCheck
      });
      return await ctx.reply("_Mention Disabled!_");
    }
  } catch (err) {
    ctx.error(err + "\n\nCommand: mention", err, false);
  }
};
setMention.get = async key => {
  try {
    let botSettings = (await bot_.findOne({
      id: "bot_" + key.user
    })) || (await bot_.new({
      id: "bot_" + key.user
    }));
    let mentionAtGet = botSettings.mention || {};
    if (mentionAtGet.get) {
      return await key.reply("*Status :* " + (mentionAtGet.status ? "ON" : "OFF") + "\nUse on/off/get/test to enable and disable mention\n\n*Mention Info:* " + mentionAtGet.get);
    } else {
      return await key.reply("*You did'nt set mention message yet!*\n*please Check: https://github.com/SuhailTechInfo/Suhail-Md/wiki/mention*");
    }
  } catch (err) {
    key.error(err + "\n\nCommand: mention", err, false);
  }
};
setMention.typesArray = types => {
  try {
    const lines = types.split("\n");
    let mentionReply = {
      text: []
    };
    let allowedTypes = ["gif", "video", "audio", "image", "sticker"];
    let mentionType = null;
    for (const line of lines) {
      const parts = line.split(" ");
      if (parts.length >= 1) {
        const typeIndex = parts.findIndex(item => item.startsWith("type/"));
        if (typeIndex !== -1) {
          mentionType = parts[typeIndex].slice(5).toLowerCase();
          let hasType = /suhail|smd|message|chat/gi.test(mentionType);
          if (!mentionReply[hasType ? "suhail" : mentionType]) {
            mentionReply[hasType ? "suhail" : mentionType] = [];
          }
        }
        const filtered = parts.filter(item => item !== "type/" + mentionType && item !== "");
        mentionType = /suhail|smd|message|chat/gi.test(mentionType) ? "suhail" : mentionType;
        if (filtered.length > 0) {
          if (allowedTypes.includes(mentionType)) {
            filtered.forEach(item => {
              if (/http/gi.test(item)) {
                mentionReply[mentionType].push(item);
              }
            });
          } else if (/react/gi.test(mentionType)) {
            mentionReply.react.push(...filtered);
          } else {
            mentionReply[/suhail/gi.test(mentionType) ? "suhail" : "text"].push(filtered.join(" "));
          }
        }
      }
      mentionType = null;
    }
    return mentionReply || {};
  } catch (err) {
    console.log("Error in Mention typesArray\n", err);
  }
};
setMention.update = async (key, value) => {
  try {
    setMention.mention = false;
    let data = {
      status: true,
      get: value
    };
    try {
      const match = value.match(/\{.*\}/);
      if (match) {
        const matched = match[0];
        const parsedData = JSON.parse(matched);
        data.json = parsedData;
        value = value.replace(/\{.*\}/, "");
      }
    } catch (err) {
      console.log("ERROR mention JSON parse", err);
    }
    data.text = value;
    data.type = setMention.typesArray(value) || {};
    await bot_.updateOne({
      id: "bot_" + key.user
    }, {
      mention: data
    });
    return await key.send("*Mention updated!*", {
      mentios: [key.user]
    });
  } catch (err) {
    key.error(err + "\n\nCommand: mention", err, false);
  }
};
setMention.cmd = async (key, value = "") => {
  try {
    let mentionCmd = setMention.mention || false;
    if (!mentionCmd) {
      let botSettings = (await bot_.findOne({
        id: "bot_" + key.user
      })) || (await bot_.new({
        id: "bot_" + key.user
      }));
      mentionCmd = botSettings.mention || false;
      setMention.mention = mentionCmd;
    }
    if (global.SmdOfficial !== "yes") {
      return;
    }
    if (value === "get" || value === "info" || !value && mentionCmd.status && mentionCmd.get) {
      setMention.get(key);
    } else if (!value) {
      key.reply("_Read wiki to set mention message https://github.com/SuhailTechInfo/Suhail-Md/wiki/mention_", {}, "smd");
    } else if (["off", "deact", "disable", "false"].includes(value.toLowerCase() || value)) {
      setMention.status(key, false);
    } else if (["on", "act", "enable", "true", "active"].includes(value.toLowerCase() || value)) {
      setMention.status(key, true);
    } else if (["check", "test", "me"].includes(value.toLowerCase() || value)) {
      setMention.check(key, value, true);
    } else {
      setMention.update(key, value);
    }
  } catch (err) {
    console.log("ERROR IN MENTION CMD \n ", err);
  }
};
setMention.randome = mentions => {
  try {
    const keys = Object.keys(mentions || {});
    if (keys.length > 1) {
      const key = keys[Math.floor(Math.random() * (keys.length - 1)) + 1];
      const mentionValues = mentions[key];
      if (mentionValues && mentionValues.length > 0) {
        const index = Math.floor(Math.random() * mentionValues.length);
        return {
          type: key,
          url: mentionValues[index]
        };
      }
    }
    if (mentions && mentions.text) {
      return {
        url: mentions.text.join(" ") || "",
        type: "smd"
      };
    } else {
      return undefined;
    }
  } catch (err) {
    console.log(err);
  }
};
global.mentionsuhail = process.env.MENTIONSUHAIL || true;
setMention.check = async (ctx, text = "", force = false) => {
  try {
    const isMentioned = force || ctx.mentionedJid.includes(ctx.user) || text.includes("@" + ctx.user.split("@")[0]) || global.mentionsuhail && (ctx.mentionedJid.includes("@923184474176@s.whatsapp.net") || ctx.mentionedJid.includes("@923004591719@s.whatsapp.net") || /@923184474176|@923004591719/g.test(text));
    if (isMentioned) {
      if (global.SmdOfficial !== "yes") {
        return;
      }
      let mentionAtRandome = setMention.mention || false;
      if (!mentionAtRandome) {
        let botSettings = (await bot_.findOne({
          id: "bot_" + ctx.user
        })) || (await bot_.new({
          id: "bot_" + ctx.user
        }));
        mentionAtRandome = botSettings.mention || false;
        setMention.mention = mentionAtRandome;
      }
      if (typeof mentionAtRandome !== "object" || !mentionAtRandome || !mentionAtRandome.status) {
        return;
      }
      const mentionConfig = setMention.randome(mentionAtRandome.type);
      if (mentionConfig) {
        let mentionType = mentionConfig.type;
        const reply = {};
        if (mentionConfig.type === "gif") {
          mentionType = "video";
          reply = {
            gifPlayback: true
          };
        }
        try {
          const payload = {
            ...mentionAtRandome.json,
            ...reply
          };
          await ctx.send(mentionConfig.url, payload, mentionType, ctx);
        } catch (err) {
          console.log("Error Sending ContextInfo in mention ", err);
          try {
            ctx.send(mentionConfig.url, {
              ...reply
            }, mentionType, ctx);
          } catch (errX) {}
        }
      }
    }
  } catch (err) {
    console.log("Error in Mention Check\n", err);
  }
};
let mention = setMention;
let setFilter = {
  filter: false
};
setFilter.set = async (key, value = "") => {
  try {
    if (!value) {
      return key.send("*Use " + prefix + "filter word:reply_text!*");
    }
    let [from, to] = value.split(":").map(item => item.trim());
    if (!from || !to) {
      return key.send("*Use " + prefix + "filter " + (from || "word") + ": " + (to || "reply_text") + "!*");
    }
    let botSettings = (await bot_.findOne({
      id: "bot_" + key.user
    })) || (await bot_.new({
      id: "bot_" + key.user
    }));
    let filterAtSet = botSettings.filter || {};
    filterAtSet[from] = to;
    setFilter.filter = filterAtSet;
    let update = await bot_.updateOne({
      id: "bot_" + key.user
    }, {
      filter: filterAtSet
    });
    key.send("*Successfully set filter to '" + from + "'!*");
  } catch (err) {
    key.error(err + "\n\nCommand:filter", err, "_Can't set filter!_");
  }
};
setFilter.stop = async (ctx, text = "") => {
  try {
    if (!text) {
      return ctx.send("*Provide a word that set in filter!*\n*Use " + prefix + "flist to get list of filtered words!*");
    }
    let botSettings = (await bot_.findOne({
      id: "bot_" + ctx.user
    })) || (await bot_.new({
      id: "bot_" + ctx.user
    }));
    let filterAtStop = botSettings.filter || {};
    if (!filterAtStop[text]) {
      return ctx.reply("*Given Word ('" + text + "') not set to any filter!*");
    }
    delete filterAtStop[text];
    setFilter.filter = filterAtStop;
    await bot_.updateOne({
      id: "bot_" + ctx.user
    }, {
      filter: filterAtStop
    });
    ctx.reply("*_Filter word '" + text + "' deleted!_*");
  } catch (err) {
    ctx.error(err + "\n\nCommand:fstop", err, "*Can't delete filter!*");
  }
};
setFilter.list = async (ctx, text = "") => {
  try {
    let botSettings = (await bot_.findOne({
      id: "bot_" + ctx.user
    })) || (await bot_.new({
      id: "bot_" + ctx.user
    }));
    let filterAtList = botSettings.filter || {};
    let filterText = Object.entries(filterAtList).map(([key, value]) => key + " : " + value).join("\n");
    if (botSettings.filter && filterText) {
      ctx.reply("*[LIST OF FILTERED WORDS]*\n\n" + filterText);
    } else {
      ctx.reply("*_You didn't set any filter!_*");
    }
  } catch (err) {
    ctx.error(err + "\n\nCommand:flist", err, false);
  }
};
setFilter.check = async (ctx, text = "") => {
  try {
    let filterSettings = setFilter.filter || false;
    if (!filterSettings) {
      let botSettings = (await bot_.findOne({
        id: "bot_" + ctx.user
      })) || (await bot_.new({
        id: "bot_" + ctx.user
      }));
      filterSettings = botSettings.filter || {};
      setFilter.filter = botSettings.filter || {};
    }
    if (filterSettings[text]) {
      ctx.reply(filterSettings[text], {}, "smd", ctx);
    }
  } catch (err) {
    console.log(err);
  }
};
process.env.name = process.env.name || "suhail";
let filter = setFilter;
const thumbPath = require("path").join(__dirname, "assets", "suhail.jpg");

module.exports = {
  thumbPath: thumbPath,
  yt: yt,
  sendAnimeReaction: sendAnimeReaction,
  sendGImages: sendGImages,
  AudioToBlackVideo: AudioToBlackVideo,
  textToLogoGenerator: textToLogoGenerator,
  photoEditor: photoEditor,
  updateProfilePicture: updateProfilePicture,
  randomeFunfacts: randomeFunfacts,
  plugins: plugins,
  getRandom: getRandom,
  generateSticker: generateSticker,
  forwardMessage: forwardMessage,
  audioEditor: audioEditor,
  send: send,
  react: react,
  note: note,
  sendWelcome: sendWelcome,
  aitts: aitts,
  mention: mention,
  filter: filter
};
