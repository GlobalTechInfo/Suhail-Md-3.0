/**
 * Create By @SuhailTechInfo
 * Contact - https://wa.me/923184474176
 * Follow https://github.com/SuhailTechInfo
 */
const ffmpeg = require("fluent-ffmpeg");
const {
  randomBytes
} = require("crypto");
const fs = require("fs");
const {
  getHttpStream,
  toBuffer
} = require("@whiskeysockets/baileys");
const sharp = require("sharp");
const {
  spawn
} = require("child_process");
const path = require("path");
const {
  fromBuffer
} = require("file-type");
const {
  tmpdir
} = require("os");
const ff = require("fluent-ffmpeg");
const webp = require("node-webpmux");
async function toGif(buffer) {
  try {
    const tempWebp = "./" + randomBytes(3).toString("hex") + ".webp";
    const gifPath = "./" + randomBytes(3).toString("hex") + ".gif";
    fs.writeFileSync(tempWebp, buffer.toString("binary"), "binary");
    const outGifPath = await new Promise(resolve => {
      spawn("convert", [tempWebp, gifPath]).on("error", err => {
        throw err;
      }).on("exit", () => resolve(gifPath));
    });
    let gifBuffer = fs.readFileSync(outGifPath);
    try {
      fs.unlinkSync(tempWebp);
    } catch {}
    try {
      fs.unlinkSync(gifPath);
    } catch {}
    return gifBuffer;
  } catch (err) {
    console.log(err);
  }
}
async function toMp4(input) {
  try {
    let tempGif = "./" + randomBytes(3).toString("hex") + ".gif";
    const gifPath = fs.existsSync(input) ? input : save(input, tempGif);
    const tempMp4 = "./" + randomBytes(3).toString("hex") + ".mp4";
    const outPath = await new Promise(resolve => {
      ffmpeg(gifPath).outputOptions(["-pix_fmt yuv420p", "-c:v libx264", "-movflags +faststart", "-filter:v crop='floor(in_w/2)*2:floor(in_h/2)*2'"]).toFormat("mp4").noAudio().save(tempMp4).on("exit", () => resolve(tempMp4));
    });
    let buffer = await fs.promises.readFile(outPath);
    try {
      fs.unlinkSync(gifPath);
    } catch {}
    try {
      fs.unlinkSync(tempMp4);
    } catch {}
    return buffer;
  } catch (err) {
    console.log(err);
  }
}
const EightD = async buffer => {
  const tempMp3 = "./temp/" + randomBytes(3).toString("hex") + ".mp3";
  buffer = Buffer.isBuffer(buffer) ? save(buffer, tempMp3) : buffer;
  const outMp3 = "./temp/" + randomBytes(3).toString("hex") + ".mp3";
  const result = await new Promise(resolve => {
    ffmpeg(buffer).audioFilter(["apulsator=hz=0.125"]).audioFrequency(44100).audioChannels(2).audioBitrate("128k").audioCodec("libmp3lame").audioQuality(5).toFormat("mp3").save(outMp3).on("end", () => resolve(outMp3));
  });
  return result;
};
function save(buffer, filePath = "./temp/saveFile.jpg") {
  try {
    fs.writeFileSync(filePath, buffer.toString("binary"), "binary");
    return filePath;
  } catch (err) {
    console.log(err);
  }
}
const resizeImage = (buffer, width, options) => {
  if (!Buffer.isBuffer(buffer)) {
    throw "Input is not a Buffer";
  }
  return new Promise(async resolve => {
    sharp(buffer).resize(width, options, {
      fit: "contain"
    }).toBuffer().then(resolve);
  });
};
const _parseInput = async (input, saveBuffer = false, returnMode = "path") => {
  const buffer = await toBuffer(await getHttpStream(input));
  const tempFile = "./temp/file_" + randomBytes(3).toString("hex") + "." + (saveBuffer ? saveBuffer : (await fromBuffer(buffer)).ext);
  const filePath = Buffer.isBuffer(input) ? save(input, tempFile) : fs.existsSync(input) ? input : input;
  if (returnMode == "path") {
    return filePath;
  } else if (returnMode == "buffer") {
    const data = await fs.promises.readFile(filePath);
    try {
      await fs.promises.unlink(filePath);
    } catch (err) {}
    return data;
  }
};
async function imageToWebp(input) {
  const tempWebp = path.join(tmpdir(), randomBytes(6).readUIntLE(0, 6).toString(36) + ".webp");
  const jpgPath = path.join(tmpdir(), randomBytes(6).readUIntLE(0, 6).toString(36) + ".jpg");
  fs.writeFileSync(jpgPath, input);
  await new Promise((resolve, err) => {
    ff(jpgPath).on("error", err).on("end", () => resolve(true)).addOutputOptions(["-vcodec", "libwebp", "-vf", "scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse"]).toFormat("webp").save(tempWebp);
  });
  const buffer = fs.readFileSync(tempWebp);
  fs.unlinkSync(tempWebp);
  fs.unlinkSync(jpgPath);
  return buffer;
}
async function videoToWebp(input) {
  const tempWebp = path.join(tmpdir(), randomBytes(6).readUIntLE(0, 6).toString(36) + ".webp");
  const tempMp4 = path.join(tmpdir(), randomBytes(6).readUIntLE(0, 6).toString(36) + ".mp4");
  fs.writeFileSync(tempMp4, input);
  await new Promise((resolve, err) => {
    ff(tempMp4).on("error", err).on("end", () => resolve(true)).addOutputOptions(["-vcodec", "libwebp", "-vf", "scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse", "-loop", "0", "-ss", "00:00:00", "-t", "00:00:05", "-preset", "default", "-an", "-vsync", "0"]).toFormat("webp").save(tempWebp);
  });
  const buffer = fs.readFileSync(tempWebp);
  fs.unlinkSync(tempWebp);
  fs.unlinkSync(tempMp4);
  return buffer;
}
async function writeExifImg(buffer, options) {
  let webpBuffer = await imageToWebp(buffer);
  const tempWebp = path.join(tmpdir(), randomBytes(6).readUIntLE(0, 6).toString(36) + ".webp");
  const webpPath = path.join(tmpdir(), randomBytes(6).readUIntLE(0, 6).toString(36) + ".webp");
  fs.writeFileSync(tempWebp, webpBuffer);
  if (options.packname || options.author) {
    const webpImage = new webp.Image();
    const exif = {
      "sticker-pack-id": "Suhail-Md",
      "sticker-pack-name": options.packname,
      "sticker-pack-publisher": options.author,
      emojis: options.categories ? options.categories : [""]
    };
    const riffHeader = Buffer.from([73, 73, 42, 0, 8, 0, 0, 0, 1, 0, 65, 87, 7, 0, 0, 0, 0, 0, 22, 0, 0, 0]);
    const exifBuffer = Buffer.from(JSON.stringify(exif), "utf-8");
    const outBuffer = Buffer.concat([riffHeader, exifBuffer]);
    outBuffer.writeUIntLE(exifBuffer.length, 14, 4);
    await webpImage.load(tempWebp);
    fs.unlinkSync(tempWebp);
    webpImage.exif = outBuffer;
    await webpImage.save(webpPath);
    return webpPath;
  }
}
async function writeExifVid(video, options) {
  let webpBuffer = await videoToWebp(video);
  const webpPath = path.join(tmpdir(), randomBytes(6).readUIntLE(0, 6).toString(36) + ".webp");
  const outWebpPath = path.join(tmpdir(), randomBytes(6).readUIntLE(0, 6).toString(36) + ".webp");
  fs.writeFileSync(webpPath, webpBuffer);
  let buffer;
  let webpFile;
  try {
    buffer = options.packname;
  } catch (err) {
    buffer = "Suhail-Md";
  }
  try {
    webpFile = options.author;
  } catch (err) {
    webpFile = "";
  }
  const webpImage = new webp.Image();
  const exif = {
    "sticker-pack-id": "Suhail-Md",
    "sticker-pack-name": buffer,
    "sticker-pack-publisher": webpFile,
    emojis: options.categories ? options.categories : [""]
  };
  const riffHeader = Buffer.from([73, 73, 42, 0, 8, 0, 0, 0, 1, 0, 65, 87, 7, 0, 0, 0, 0, 0, 22, 0, 0, 0]);
  const exifBuffer = Buffer.from(JSON.stringify(exif), "utf-8");
  const outBuffer = Buffer.concat([riffHeader, exifBuffer]);
  outBuffer.writeUIntLE(exifBuffer.length, 14, 4);
  await webpImage.load(webpPath);
  fs.unlinkSync(webpPath);
  webpImage.exif = outBuffer;
  await webpImage.save(outWebpPath);
  return outWebpPath;
}
async function writeExifWebp(buffer, options) {
  const webpPath = path.join(tmpdir(), randomBytes(6).readUIntLE(0, 6).toString(36) + ".webp");
  const outWebpPath = path.join(tmpdir(), randomBytes(6).readUIntLE(0, 6).toString(36) + ".webp");
  fs.writeFileSync(webpPath, buffer);
  if (options.packname || options.author) {
    const webpImage = new webp.Image();
    const exif = {
      "sticker-pack-id": "Suhail_Md",
      "sticker-pack-name": options.packname,
      "sticker-pack-publisher": options.author,
      emojis: options.categories ? options.categories : [""]
    };
    const riffHeader = await Buffer.from([73, 73, 42, 0, 8, 0, 0, 0, 1, 0, 65, 87, 7, 0, 0, 0, 0, 0, 22, 0, 0, 0]);
    const exifBuffer = await Buffer.from(JSON.stringify(exif), "utf-8");
    const outBuffer = await Buffer.concat([riffHeader, exifBuffer]);
    await outBuffer.writeUIntLE(exifBuffer.length, 14, 4);
    await webpImage.load(webpPath);
    fs.unlinkSync(webpPath);
    webpImage.exif = outBuffer;
    await webpImage.save(outWebpPath);
    return outWebpPath;
  }
}
module.exports = {
  imageToWebp: imageToWebp,
  videoToWebp: videoToWebp,
  writeExifImg: writeExifImg,
  writeExifVid: writeExifVid,
  writeExifWebp: writeExifWebp,
  toGif: toGif,
  toMp4: toMp4,
  EightD: EightD,
  _parseInput: _parseInput,
  resizeImage: resizeImage
};
