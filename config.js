const fs = require('fs-extra')
if (fs.existsSync('.env')) require('dotenv').config({ path: __dirname+'/.env' })


//═══════[Required Variables]════════\\
global.audio= "" ;  
global.video= "" ;
global.port =process.env.PORT 
global.appUrl=process.env.APP_URL || ""     // put your deploy app/bot url here, for 24/7 for (render , koyeb, glitch)
global.email ="saimsamsun789@gmail.com"
global.location="Lahore,Pakistan."


global.mongodb= process.env.MONGODB_URI || "false"  
global.allowJids= process.env.ALLOW_JID || "null" 
global.blockJids= process.env.BLOCK_JID || "null"
global.DATABASE_URL = process.env.DATABASE_URL || "false"

global.timezone= process.env.TZ || process.env.TIME_ZONE || "Asia/Karachi";
global.github=process.env.GITHUB|| "https://github.com/SuhailTechInfo/Suhail-Md-3";
global.gurl  =process.env.GURL  || "https://whatsapp.com/channel/0029VagJIAr3bbVBCpEkAM07";
global.website =process.env.GURL || "https://whatsapp.com/channel/0029VagJIAr3bbVBCpEkAM07" ; 
global.THUMB_IMAGE = process.env.THUMB_IMAGE || process.env.IMAGE || "https://i.ibb.co/TgwRyHR/Ephoto360-com-166de101e03cd7.jpg" || "https://i.ibb.co/bH1kbX0/a4c0b1af253197d4837ff6760d5b81c0.jpg" ; // SET LOGO FOR IMAGE 
global.caption = process.env.CAPTION || global.caption || "Made With LOVE!" 


global.devs = "" // Developer Contacts
global.sudo = process.env.SUDO ? process.env.SUDO.replace(/[\s+]/g, '') : "null";
global.owner= process.env.OWNER_NUMBER ? process.env.OWNER_NUMBER.replace(252682219373) : "";




//========================= [ BOT SETTINGS ] ======8===================\\
global.style = process.env.STYLE   || Math.floor(Math.random()*6) || '0'  // put '1' to "5" here to check bot styles
global.flush = process.env.FLUSH   || "false"; // Make it "true" if bot not responed
global.gdbye = process.env.GOODBYE || process.env.CAN_GOODBYE || "true"; 
global.wlcm  = process.env.WELCOME || process.env.CAN_WELCOME || Math.floor(Math.random()*3)  === 1 ?  "true" : "false" ;  // Make it "false" for disable WELCOME 

global.warncount = process.env.WARN_COUNT || 3
global.disablepm = process.env.DISABLE_PM || "false"
global.disablegroup = process.env.DISABLE_GROUPS || "false", // disable bot in groups when public mode

global.MsgsInLog = process.env.MSGS_IN_LOG|| "false" // "true"  to see messages , "log" to show logs , "false" to hide logs messages
global.userImages= process.env.USER_IMAGES || "" //"https://i.ibb.co/pXyNHj8/suhail.jpg" // "image" // set Image/video urls here
global.waPresence= process.env.WAPRESENCE ||  "null" ; // 'unavailable' | 'available' | 'composing' | 'recording' | 'paused'


//========================= [ AUTO READ MSGS & CMDS ] =========================\\
global.readcmds = process.env.READ_COMMAND || "false"
global.readmessage = process.env.READ_MESSAGE || "false"
global.readmessagefrom = process.env.READ_MESSAGE_FROM || "null,923xxxxxxxx";


//========================= [ AUTO SAVE & READ STATUS ] =========================\\
global.read_status = process.env.AUTO_READ_STATUS || "true"
global.save_status = process.env.AUTO_SAVE_STATUS || "true"
global.save_status_from =  process.env.SAVE_STATUS_FROM  || "null,923xxxxxxxx";
global.read_status_from =  process.env.READ_STATUS_FROM  ||  "923184474176,923xxxxxxxx";

global.api_smd = "https://api-smd.onrender.com/" //  || "https://api-smd-1.vercel.app" // expires
global.scan = "https://suhail-md-vtsf.onrender.com";

global.SESSION_ID = process.env.SESSION_ID  || "SUHAIL_04_14_05_02_ewogICJjcmVkcy5qc29uIjogIntcbiAgXCJub2lzZUtleVwiOiB7XG4gICAgXCJwcml2YXRlXCI6IHtcbiAgICAgIFwidHlwZVwiOiBcIkJ1ZmZlclwiLFxuICAgICAgXCJkYXRhXCI6IFtcbiAgICAgICAgMTIwLFxuICAgICAgICAyMDcsXG4gICAgICAgIDEyNixcbiAgICAgICAgMTQ5LFxuICAgICAgICAyNDksXG4gICAgICAgIDIzNixcbiAgICAgICAgMjUxLFxuICAgICAgICAxMTUsXG4gICAgICAgIDgyLFxuICAgICAgICAxMTEsXG4gICAgICAgIDIyOSxcbiAgICAgICAgNjcsXG4gICAgICAgIDE4OSxcbiAgICAgICAgMTc4LFxuICAgICAgICAxNDksXG4gICAgICAgIDExLFxuICAgICAgICAxNjMsXG4gICAgICAgIDEyLFxuICAgICAgICA1OCxcbiAgICAgICAgMjI1LFxuICAgICAgICAxMSxcbiAgICAgICAgMjksXG4gICAgICAgIDIyOCxcbiAgICAgICAgOTgsXG4gICAgICAgIDIxMSxcbiAgICAgICAgMTMzLFxuICAgICAgICA1NCxcbiAgICAgICAgMTIxLFxuICAgICAgICAxODEsXG4gICAgICAgIDIwMCxcbiAgICAgICAgMTA0LFxuICAgICAgICAxMDdcbiAgICAgIF1cbiAgICB9LFxuICAgIFwicHVibGljXCI6IHtcbiAgICAgIFwidHlwZVwiOiBcIkJ1ZmZlclwiLFxuICAgICAgXCJkYXRhXCI6IFtcbiAgICAgICAgMTA3LFxuICAgICAgICAyNDgsXG4gICAgICAgIDE0MixcbiAgICAgICAgMTkxLFxuICAgICAgICAxNTYsXG4gICAgICAgIDE3MyxcbiAgICAgICAgMjI0LFxuICAgICAgICA1MyxcbiAgICAgICAgMTYyLFxuICAgICAgICAyMjQsXG4gICAgICAgIDkxLFxuICAgICAgICAxMzQsXG4gICAgICAgIDkzLFxuICAgICAgICAxNjAsXG4gICAgICAgIDE4NyxcbiAgICAgICAgMjEwLFxuICAgICAgICAxMjQsXG4gICAgICAgIDMxLFxuICAgICAgICAxNTksXG4gICAgICAgIDIxNixcbiAgICAgICAgMjksXG4gICAgICAgIDEyNCxcbiAgICAgICAgMyxcbiAgICAgICAgNjgsXG4gICAgICAgIDE5NyxcbiAgICAgICAgMzAsXG4gICAgICAgIDE0MixcbiAgICAgICAgMTM2LFxuICAgICAgICA2OCxcbiAgICAgICAgMTAyLFxuICAgICAgICAxNzEsXG4gICAgICAgIDI0XG4gICAgICBdXG4gICAgfVxuICB9LFxuICBcInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyXCI6IHtcbiAgICBcInByaXZhdGVcIjoge1xuICAgICAgXCJ0eXBlXCI6IFwiQnVmZmVyXCIsXG4gICAgICBcImRhdGFcIjogW1xuICAgICAgICAyMTYsXG4gICAgICAgIDI0MixcbiAgICAgICAgMjMwLFxuICAgICAgICA5MixcbiAgICAgICAgOTksXG4gICAgICAgIDE1OSxcbiAgICAgICAgMTI5LFxuICAgICAgICAxNzAsXG4gICAgICAgIDE5MSxcbiAgICAgICAgMTY0LFxuICAgICAgICAxMSxcbiAgICAgICAgOTksXG4gICAgICAgIDMsXG4gICAgICAgIDg0LFxuICAgICAgICA4LFxuICAgICAgICAyMzIsXG4gICAgICAgIDIyNCxcbiAgICAgICAgMjIyLFxuICAgICAgICAxMzUsXG4gICAgICAgIDU4LFxuICAgICAgICAxNjQsXG4gICAgICAgIDE5MyxcbiAgICAgICAgMjgsXG4gICAgICAgIDg1LFxuICAgICAgICAxOTUsXG4gICAgICAgIDIzNSxcbiAgICAgICAgMTYsXG4gICAgICAgIDk0LFxuICAgICAgICAyNTAsXG4gICAgICAgIDIxNyxcbiAgICAgICAgNzMsXG4gICAgICAgIDc2XG4gICAgICBdXG4gICAgfSxcbiAgICBcInB1YmxpY1wiOiB7XG4gICAgICBcInR5cGVcIjogXCJCdWZmZXJcIixcbiAgICAgIFwiZGF0YVwiOiBbXG4gICAgICAgIDI1MCxcbiAgICAgICAgOTEsXG4gICAgICAgIDIxMyxcbiAgICAgICAgOTIsXG4gICAgICAgIDgxLFxuICAgICAgICAxNTgsXG4gICAgICAgIDIwNCxcbiAgICAgICAgNTIsXG4gICAgICAgIDE0NyxcbiAgICAgICAgMTg2LFxuICAgICAgICA5NixcbiAgICAgICAgMTY1LFxuICAgICAgICAxMDYsXG4gICAgICAgIDI1LFxuICAgICAgICAxNzEsXG4gICAgICAgIDIsXG4gICAgICAgIDExMyxcbiAgICAgICAgMTExLFxuICAgICAgICAxNTUsXG4gICAgICAgIDIxMSxcbiAgICAgICAgMTgxLFxuICAgICAgICA1NSxcbiAgICAgICAgMjEyLFxuICAgICAgICAxNzgsXG4gICAgICAgIDI0MyxcbiAgICAgICAgMTk0LFxuICAgICAgICA1MixcbiAgICAgICAgNzYsXG4gICAgICAgIDY0LFxuICAgICAgICAxNjgsXG4gICAgICAgIDQ1LFxuICAgICAgICA3MVxuICAgICAgXVxuICAgIH1cbiAgfSxcbiAgXCJzaWduZWRJZGVudGl0eUtleVwiOiB7XG4gICAgXCJwcml2YXRlXCI6IHtcbiAgICAgIFwidHlwZVwiOiBcIkJ1ZmZlclwiLFxuICAgICAgXCJkYXRhXCI6IFtcbiAgICAgICAgMTkyLFxuICAgICAgICA0OSxcbiAgICAgICAgMTEzLFxuICAgICAgICA4NixcbiAgICAgICAgODIsXG4gICAgICAgIDEzNSxcbiAgICAgICAgMTI3LFxuICAgICAgICAyMzAsXG4gICAgICAgIDIzMyxcbiAgICAgICAgMjMyLFxuICAgICAgICAxNjUsXG4gICAgICAgIDIyNSxcbiAgICAgICAgOSxcbiAgICAgICAgMTE1LFxuICAgICAgICAxNjAsXG4gICAgICAgIDIwNCxcbiAgICAgICAgMjI2LFxuICAgICAgICAxNTIsXG4gICAgICAgIDI0NCxcbiAgICAgICAgMTE2LFxuICAgICAgICAxOSxcbiAgICAgICAgNSxcbiAgICAgICAgMzAsXG4gICAgICAgIDkyLFxuICAgICAgICAyMzksXG4gICAgICAgIDE3MyxcbiAgICAgICAgMjAxLFxuICAgICAgICA4OSxcbiAgICAgICAgNjksXG4gICAgICAgIDE2MixcbiAgICAgICAgMTkwLFxuICAgICAgICAxMjFcbiAgICAgIF1cbiAgICB9LFxuICAgIFwicHVibGljXCI6IHtcbiAgICAgIFwidHlwZVwiOiBcIkJ1ZmZlclwiLFxuICAgICAgXCJkYXRhXCI6IFtcbiAgICAgICAgMTUzLFxuICAgICAgICAxNjksXG4gICAgICAgIDE0OCxcbiAgICAgICAgMTU1LFxuICAgICAgICAxNDAsXG4gICAgICAgIDE3OSxcbiAgICAgICAgNTYsXG4gICAgICAgIDE3OSxcbiAgICAgICAgMjQ2LFxuICAgICAgICAxMDUsXG4gICAgICAgIDUyLFxuICAgICAgICAyMTEsXG4gICAgICAgIDI5LFxuICAgICAgICAxMDEsXG4gICAgICAgIDIyMCxcbiAgICAgICAgMjM1LFxuICAgICAgICAxMDUsXG4gICAgICAgIDY4LFxuICAgICAgICAxMjEsXG4gICAgICAgIDIyMixcbiAgICAgICAgMjMzLFxuICAgICAgICA4NixcbiAgICAgICAgMTkyLFxuICAgICAgICAyMzksXG4gICAgICAgIDE1OSxcbiAgICAgICAgMjQxLFxuICAgICAgICAxMTMsXG4gICAgICAgIDI1MCxcbiAgICAgICAgMjA2LFxuICAgICAgICAxNDUsXG4gICAgICAgIDEwOSxcbiAgICAgICAgMTAxXG4gICAgICBdXG4gICAgfVxuICB9LFxuICBcInNpZ25lZFByZUtleVwiOiB7XG4gICAgXCJrZXlQYWlyXCI6IHtcbiAgICAgIFwicHJpdmF0ZVwiOiB7XG4gICAgICAgIFwidHlwZVwiOiBcIkJ1ZmZlclwiLFxuICAgICAgICBcImRhdGFcIjogW1xuICAgICAgICAgIDk2LFxuICAgICAgICAgIDM3LFxuICAgICAgICAgIDEzMixcbiAgICAgICAgICAyMjIsXG4gICAgICAgICAgMCxcbiAgICAgICAgICAxNzAsXG4gICAgICAgICAgMjMsXG4gICAgICAgICAgMTk1LFxuICAgICAgICAgIDI1NSxcbiAgICAgICAgICAxOTMsXG4gICAgICAgICAgMjEyLFxuICAgICAgICAgIDIwOCxcbiAgICAgICAgICAxNTYsXG4gICAgICAgICAgMjEsXG4gICAgICAgICAgMzksXG4gICAgICAgICAgMTgsXG4gICAgICAgICAgMTkxLFxuICAgICAgICAgIDIzMixcbiAgICAgICAgICAxNDgsXG4gICAgICAgICAgNDQsXG4gICAgICAgICAgMjE5LFxuICAgICAgICAgIDE0LFxuICAgICAgICAgIDI0MCxcbiAgICAgICAgICAxMDgsXG4gICAgICAgICAgMjA1LFxuICAgICAgICAgIDE1LFxuICAgICAgICAgIDE2NCxcbiAgICAgICAgICA4MixcbiAgICAgICAgICAxODQsXG4gICAgICAgICAgMTY3LFxuICAgICAgICAgIDE1MixcbiAgICAgICAgICA4OVxuICAgICAgICBdXG4gICAgICB9LFxuICAgICAgXCJwdWJsaWNcIjoge1xuICAgICAgICBcInR5cGVcIjogXCJCdWZmZXJcIixcbiAgICAgICAgXCJkYXRhXCI6IFtcbiAgICAgICAgICAyMjcsXG4gICAgICAgICAgMjM3LFxuICAgICAgICAgIDIwLFxuICAgICAgICAgIDI0OSxcbiAgICAgICAgICA0OCxcbiAgICAgICAgICA1MCxcbiAgICAgICAgICAxMDIsXG4gICAgICAgICAgMjksXG4gICAgICAgICAgMTIyLFxuICAgICAgICAgIDE4NyxcbiAgICAgICAgICAxMDgsXG4gICAgICAgICAgMjExLFxuICAgICAgICAgIDUxLFxuICAgICAgICAgIDIyOCxcbiAgICAgICAgICAyMTksXG4gICAgICAgICAgMjM1LFxuICAgICAgICAgIDY4LFxuICAgICAgICAgIDMsXG4gICAgICAgICAgMTEyLFxuICAgICAgICAgIDcsXG4gICAgICAgICAgNDcsXG4gICAgICAgICAgOTcsXG4gICAgICAgICAgMjI0LFxuICAgICAgICAgIDE3NixcbiAgICAgICAgICAxNzcsXG4gICAgICAgICAgMjMyLFxuICAgICAgICAgIDIxNSxcbiAgICAgICAgICAyMTUsXG4gICAgICAgICAgMixcbiAgICAgICAgICAxNzEsXG4gICAgICAgICAgMTY3LFxuICAgICAgICAgIDEwNlxuICAgICAgICBdXG4gICAgICB9XG4gICAgfSxcbiAgICBcInNpZ25hdHVyZVwiOiB7XG4gICAgICBcInR5cGVcIjogXCJCdWZmZXJcIixcbiAgICAgIFwiZGF0YVwiOiBbXG4gICAgICAgIDIyLFxuICAgICAgICA4MyxcbiAgICAgICAgNjQsXG4gICAgICAgIDE4NyxcbiAgICAgICAgMjQ3LFxuICAgICAgICAyNDMsXG4gICAgICAgIDIyLFxuICAgICAgICAyMyxcbiAgICAgICAgNTUsXG4gICAgICAgIDE1NSxcbiAgICAgICAgNTYsXG4gICAgICAgIDE3NCxcbiAgICAgICAgNzAsXG4gICAgICAgIDEwNSxcbiAgICAgICAgNTgsXG4gICAgICAgIDE0OCxcbiAgICAgICAgODgsXG4gICAgICAgIDYyLFxuICAgICAgICA4NSxcbiAgICAgICAgNjEsXG4gICAgICAgIDYxLFxuICAgICAgICA2NixcbiAgICAgICAgMjM3LFxuICAgICAgICA1MCxcbiAgICAgICAgMTcxLFxuICAgICAgICA3NixcbiAgICAgICAgMTcyLFxuICAgICAgICAxNzgsXG4gICAgICAgIDk4LFxuICAgICAgICAxNzMsXG4gICAgICAgIDEyNCxcbiAgICAgICAgNTAsXG4gICAgICAgIDEwMixcbiAgICAgICAgMTAxLFxuICAgICAgICAyNDQsXG4gICAgICAgIDMxLFxuICAgICAgICAyMTksXG4gICAgICAgIDQyLFxuICAgICAgICAxODAsXG4gICAgICAgIDYxLFxuICAgICAgICAxMjQsXG4gICAgICAgIDI4LFxuICAgICAgICAyOCxcbiAgICAgICAgMTQ1LFxuICAgICAgICA5NCxcbiAgICAgICAgMTAsXG4gICAgICAgIDE0OCxcbiAgICAgICAgMTg1LFxuICAgICAgICAxMDksXG4gICAgICAgIDgwLFxuICAgICAgICAyMzQsXG4gICAgICAgIDEyMCxcbiAgICAgICAgMjMwLFxuICAgICAgICA0NixcbiAgICAgICAgMTM0LFxuICAgICAgICAxMTEsXG4gICAgICAgIDE5MyxcbiAgICAgICAgODMsXG4gICAgICAgIDExMyxcbiAgICAgICAgOTcsXG4gICAgICAgIDI1MSxcbiAgICAgICAgMjAsXG4gICAgICAgIDIxNCxcbiAgICAgICAgN1xuICAgICAgXVxuICAgIH0sXG4gICAgXCJrZXlJZFwiOiAxXG4gIH0sXG4gIFwicmVnaXN0cmF0aW9uSWRcIjogMTM3LFxuICBcImFkdlNlY3JldEtleVwiOiBcIk0vQ2w5ZG4zK3VzZnhIcVFtN3ZEdGtjaHNweW5aUkt4REw2TGttQW9yKzQ9XCIsXG4gIFwicHJvY2Vzc2VkSGlzdG9yeU1lc3NhZ2VzXCI6IFtdLFxuICBcIm5leHRQcmVLZXlJZFwiOiAzMSxcbiAgXCJmaXJzdFVudXBsb2FkZWRQcmVLZXlJZFwiOiAzMSxcbiAgXCJhY2NvdW50U3luY0NvdW50ZXJcIjogMCxcbiAgXCJhY2NvdW50U2V0dGluZ3NcIjoge1xuICAgIFwidW5hcmNoaXZlQ2hhdHNcIjogZmFsc2VcbiAgfSxcbiAgXCJkZXZpY2VJZFwiOiBcIkl2VG5mNFZQVGJDazRQUjhueGpPLXdcIixcbiAgXCJwaG9uZUlkXCI6IFwiNTAyY2I1NGEtNWQ2OS00ZTRlLTgwYmQtOWU3OGVmMGFlYjg2XCIsXG4gIFwiaWRlbnRpdHlJZFwiOiB7XG4gICAgXCJ0eXBlXCI6IFwiQnVmZmVyXCIsXG4gICAgXCJkYXRhXCI6IFtcbiAgICAgIDIxNCxcbiAgICAgIDIzMCxcbiAgICAgIDM1LFxuICAgICAgMTE1LFxuICAgICAgMTU4LFxuICAgICAgMjUxLFxuICAgICAgMTYsXG4gICAgICA2MSxcbiAgICAgIDQ5LFxuICAgICAgOTcsXG4gICAgICA5MSxcbiAgICAgIDE4OSxcbiAgICAgIDQzLFxuICAgICAgNixcbiAgICAgIDEyNCxcbiAgICAgIDEzMixcbiAgICAgIDMsXG4gICAgICA2LFxuICAgICAgMjA4LFxuICAgICAgMjE3XG4gICAgXVxuICB9LFxuICBcInJlZ2lzdGVyZWRcIjogdHJ1ZSxcbiAgXCJiYWNrdXBUb2tlblwiOiB7XG4gICAgXCJ0eXBlXCI6IFwiQnVmZmVyXCIsXG4gICAgXCJkYXRhXCI6IFtcbiAgICAgIDY3LFxuICAgICAgNzMsXG4gICAgICAyMTAsXG4gICAgICAxMzEsXG4gICAgICA5MSxcbiAgICAgIDExNyxcbiAgICAgIDE3NCxcbiAgICAgIDIzNCxcbiAgICAgIDM4LFxuICAgICAgMTYwLFxuICAgICAgMTc2LFxuICAgICAgMTM2LFxuICAgICAgMTc5LFxuICAgICAgMTIzLFxuICAgICAgNTMsXG4gICAgICA3OCxcbiAgICAgIDg5LFxuICAgICAgMTY1LFxuICAgICAgMixcbiAgICAgIDFcbiAgICBdXG4gIH0sXG4gIFwicmVnaXN0cmF0aW9uXCI6IHt9LFxuICBcInBhaXJpbmdDb2RlXCI6IFwiVkwzQTQzV01cIixcbiAgXCJtZVwiOiB7XG4gICAgXCJpZFwiOiBcIjI1Mjc3MTkwNzU4NDo3QHMud2hhdHNhcHAubmV0XCIsXG4gICAgXCJsaWRcIjogXCIyMDAzNTIyNzE5NzA1MTY6N0BsaWRcIlxuICB9LFxuICBcImFjY291bnRcIjoge1xuICAgIFwiZGV0YWlsc1wiOiBcIkNNbXNycDBIRUxLTjBjQUdHQUVnQUNnQVwiLFxuICAgIFwiYWNjb3VudFNpZ25hdHVyZUtleVwiOiBcInNuV3hhcHlqd0F1dit6QnIwMzRkUGovbVpBUlFJTnNTWGtNV3VpK0w5SEk9XCIsXG4gICAgXCJhY2NvdW50U2lnbmF0dXJlXCI6IFwiK1lqZUpSSzhRZVgyOG14dkZteUtyMVRrNldHbUtUWmZmNVBwU0IvYTd4a1ZRSFdma2lsTG1keDVVaDgwOGdONThVcS9RR0ZLNzRyeENOVVRvRFllQ1E9PVwiLFxuICAgIFwiZGV2aWNlU2lnbmF0dXJlXCI6IFwiYnFZc3Bhb3p6cm9qeVJENHFuUmVIWmRpekZUNERXQ1NMMTBaTE5JSzVPR3RUS2UwcStMcmdkTFpVV29lemRtdEU4S0YwbWUxYXRMKzhRM2dIcGxERHc9PVwiXG4gIH0sXG4gIFwic2lnbmFsSWRlbnRpdGllc1wiOiBbXG4gICAge1xuICAgICAgXCJpZGVudGlmaWVyXCI6IHtcbiAgICAgICAgXCJuYW1lXCI6IFwiMjUyNzcxOTA3NTg0OjdAcy53aGF0c2FwcC5uZXRcIixcbiAgICAgICAgXCJkZXZpY2VJZFwiOiAwXG4gICAgICB9LFxuICAgICAgXCJpZGVudGlmaWVyS2V5XCI6IHtcbiAgICAgICAgXCJ0eXBlXCI6IFwiQnVmZmVyXCIsXG4gICAgICAgIFwiZGF0YVwiOiBbXG4gICAgICAgICAgNSxcbiAgICAgICAgICAxNzgsXG4gICAgICAgICAgMTE3LFxuICAgICAgICAgIDE3NyxcbiAgICAgICAgICAxMDYsXG4gICAgICAgICAgMTU2LFxuICAgICAgICAgIDE2MyxcbiAgICAgICAgICAxOTIsXG4gICAgICAgICAgMTEsXG4gICAgICAgICAgMTc1LFxuICAgICAgICAgIDI1MSxcbiAgICAgICAgICA0OCxcbiAgICAgICAgICAxMDcsXG4gICAgICAgICAgMjExLFxuICAgICAgICAgIDEyNixcbiAgICAgICAgICAyOSxcbiAgICAgICAgICA2MixcbiAgICAgICAgICA2MyxcbiAgICAgICAgICAyMzAsXG4gICAgICAgICAgMTAwLFxuICAgICAgICAgIDQsXG4gICAgICAgICAgODAsXG4gICAgICAgICAgMzIsXG4gICAgICAgICAgMjE5LFxuICAgICAgICAgIDE4LFxuICAgICAgICAgIDk0LFxuICAgICAgICAgIDY3LFxuICAgICAgICAgIDIyLFxuICAgICAgICAgIDE4NixcbiAgICAgICAgICA0NyxcbiAgICAgICAgICAxMzksXG4gICAgICAgICAgMjQ0LFxuICAgICAgICAgIDExNFxuICAgICAgICBdXG4gICAgICB9XG4gICAgfVxuICBdLFxuICBcInBsYXRmb3JtXCI6IFwiYW5kcm9pZFwiLFxuICBcImxhc3RBY2NvdW50U3luY1RpbWVzdGFtcFwiOiAxNzQ2MTU5Mjg2XG59IiwKICAiYXBwLXN0YXRlLXN5bmMta2V5LXVuZGVmaW5lZC5qc29uIjoge30KfQ=="  // PUT your SESSION_ID 


module.exports = {

  menu: process.env.MENU || "", /**  Available @MENU @Schemes 1: Aztec_Md, 2: A17_Md, 3: Suhail-Md Default ---------- If Not Choose then it Randomely Pic One Of Them Each time **/

  HANDLERS: process.env.PREFIX  || ".",
  BRANCH  : process.env.BRANCH  || "main",
  VERSION : process.env.VERSION || "3.0.1-developement",
  caption : global.caption || "" , // ```『 ᴘᴏᴡᴇʀᴇᴅ ʙʏ GlobalTechInfo ® 』```", //*『sᴜʙsᴄʀɪʙᴇ • sᴜʜᴀɪʟ ᴛᴇᴄʜ』*\n youtube.com/@GlobalTechInfo"),
 
  author : process.env.PACK_AUTHER|| "",
  packname: process.env.PACK_NAME || "",
  botname : process.env.BOT_NAME  || "Suhail-MD",
  ownername:process.env.OWNER_NAME|| "Suhail:Shy<3",


  errorChat : process.env.ERROR_CHAT || "",
  KOYEB_API : process.env.KOYEB_API  || "false",

  REMOVE_BG_KEY : process.env.REMOVE_BG_KEY  || "",
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || "",
  HEROKU_API_KEY: process.env.HEROKU_API_KEY || "",
  HEROKU_APP_NAME:process.env.HEROKU_APP_NAME|| "",
  antilink_values:process.env.ANTILINK_VALUES|| "all",
  HEROKU: process.env.HEROKU_APP_NAME && process.env.HEROKU_API_KEY,


  WORKTYPE: process.env.WORKTYPE || process.env.MODE|| "private",
  LANG: ( process.env.THEME ||  "SUHAIL"  ).toUpperCase(),



};



global.ELEVENLAB_API_KEY = process.env.ELEVENLAB_API_KEY || "";
global.aitts_Voice_Id = process.env.AITTS_ID|| "37";





















global.rank = "updated"
global.isMongodb = false; 
let file = require.resolve(__filename)
fs.watchFile(file, () => { fs.unwatchFile(file);console.log(`Update'${__filename}'`);delete require.cache[file];	require(file); })
 

// ========================= [ Disables in V.1.2.8 ] ===============================\\  
  //style : process.env.STYLE || "2",  // put '1' & "2" here to check bot styles
  //readmessage:process.env.READ_MESSAGE|| "false",
  //warncount: process.env.WARN_COUNT || 3,
  //userImages:process.env.USER_IMAGES|| "text",  // SET IMAGE AND VIDEO URL FOR BOT MENUS 
  //disablepm: process.env.DISABLE_PM || "false",
  //MsgsInLog: process.env.MSGS_IN_LOG|| "false", // "true"  to see messages , "log" to open logs , "false" to hide logs messages
  //readcmds:process.env.READ_COMMANDS|| "false", 
  //alwaysonline:process.env.WAPRESENCE|| "unavailable", // 'unavailable' | 'online' | 'composing' | 'recording' | 'paused'
  //read_status: process.env.AUTO_READ_STATUS || "false",
  //save_status: process.env.AUTO_SAVE_STATUS || "false",
  //aitts_Voice_Id : process.env.AITTS_ID || "37",
  //ELEVENLAB_API_KEY: process.env.ELEVENLAB_API_KEY  || "",
