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
global.owner= process.env.OWNER_NUMBER ? process.env.OWNER_NUMBER.replace(/[\s+]/g, '') : "";




//========================= [ BOT SETTINGS ] ======8===================\\
global.style = process.env.STYLE   || Math.floor(Math.random()*6) || '0'  // put '1' to "5" here to check bot styles
global.flush = process.env.FLUSH   || "false"; // Make it "true" if bot not responed
global.gdbye = process.env.GOODBYE || process.env.CAN_GOODBYE || "false"; 
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
global.read_status = process.env.AUTO_READ_STATUS || "false"
global.save_status = process.env.AUTO_SAVE_STATUS || "false"
global.save_status_from =  process.env.SAVE_STATUS_FROM  || "null,923xxxxxxxx";
global.read_status_from =  process.env.READ_STATUS_FROM  ||  "923184474176,923xxxxxxxx";

global.api_smd = "https://api-smd.onrender.com/" //  || "https://api-smd-1.vercel.app" // expires
global.scan = "https://suhail-md-vtsf.onrender.com";

global.SESSION_ID = process.env.SESSION_ID  || "SUHAIL_11_24_06_07_ewogICJjcmVkcy5qc29uIjogIntcbiAgXCJub2lzZUtleVwiOiB7XG4gICAgXCJwcml2YXRlXCI6IHtcbiAgICAgIFwidHlwZVwiOiBcIkJ1ZmZlclwiLFxuICAgICAgXCJkYXRhXCI6IFtcbiAgICAgICAgMCxcbiAgICAgICAgMjI0LFxuICAgICAgICAyNDgsXG4gICAgICAgIDEyLFxuICAgICAgICAxMjgsXG4gICAgICAgIDE1MixcbiAgICAgICAgMjIzLFxuICAgICAgICAxMDUsXG4gICAgICAgIDc0LFxuICAgICAgICAyMzAsXG4gICAgICAgIDEyNCxcbiAgICAgICAgNzQsXG4gICAgICAgIDQ0LFxuICAgICAgICAyMCxcbiAgICAgICAgNDksXG4gICAgICAgIDEyOSxcbiAgICAgICAgMjE2LFxuICAgICAgICAyMTEsXG4gICAgICAgIDIyMixcbiAgICAgICAgMzYsXG4gICAgICAgIDIyMixcbiAgICAgICAgNjYsXG4gICAgICAgIDQzLFxuICAgICAgICAyMDMsXG4gICAgICAgIDEyNyxcbiAgICAgICAgMTA3LFxuICAgICAgICA2MixcbiAgICAgICAgMTE2LFxuICAgICAgICAyMDUsXG4gICAgICAgIDU1LFxuICAgICAgICA3MyxcbiAgICAgICAgODVcbiAgICAgIF1cbiAgICB9LFxuICAgIFwicHVibGljXCI6IHtcbiAgICAgIFwidHlwZVwiOiBcIkJ1ZmZlclwiLFxuICAgICAgXCJkYXRhXCI6IFtcbiAgICAgICAgOTgsXG4gICAgICAgIDExMixcbiAgICAgICAgMjI1LFxuICAgICAgICAxNzksXG4gICAgICAgIDE5NixcbiAgICAgICAgMTAxLFxuICAgICAgICAxNTgsXG4gICAgICAgIDQ5LFxuICAgICAgICAyNTQsXG4gICAgICAgIDg0LFxuICAgICAgICAxODcsXG4gICAgICAgIDMyLFxuICAgICAgICA2OCxcbiAgICAgICAgMTIwLFxuICAgICAgICAyMTgsXG4gICAgICAgIDE3OSxcbiAgICAgICAgMjI3LFxuICAgICAgICA3NCxcbiAgICAgICAgMTk4LFxuICAgICAgICAzNyxcbiAgICAgICAgMTM0LFxuICAgICAgICAxNDQsXG4gICAgICAgIDM4LFxuICAgICAgICAxMTMsXG4gICAgICAgIDEyMSxcbiAgICAgICAgMTU0LFxuICAgICAgICAxOTEsXG4gICAgICAgIDEyNCxcbiAgICAgICAgMTQ2LFxuICAgICAgICA4LFxuICAgICAgICAxMTMsXG4gICAgICAgIDMwXG4gICAgICBdXG4gICAgfVxuICB9LFxuICBcInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyXCI6IHtcbiAgICBcInByaXZhdGVcIjoge1xuICAgICAgXCJ0eXBlXCI6IFwiQnVmZmVyXCIsXG4gICAgICBcImRhdGFcIjogW1xuICAgICAgICAxMDQsXG4gICAgICAgIDQ2LFxuICAgICAgICA1MyxcbiAgICAgICAgMTcxLFxuICAgICAgICAxMjcsXG4gICAgICAgIDIzNyxcbiAgICAgICAgNzUsXG4gICAgICAgIDIyNCxcbiAgICAgICAgMTI4LFxuICAgICAgICAxOTksXG4gICAgICAgIDE0MixcbiAgICAgICAgMTY3LFxuICAgICAgICAxNjEsXG4gICAgICAgIDE1NCxcbiAgICAgICAgMjMsXG4gICAgICAgIDI1MixcbiAgICAgICAgMTE2LFxuICAgICAgICA1LFxuICAgICAgICAzMSxcbiAgICAgICAgMjEzLFxuICAgICAgICA0OCxcbiAgICAgICAgMjM4LFxuICAgICAgICAyNDEsXG4gICAgICAgIDE3OSxcbiAgICAgICAgMTcxLFxuICAgICAgICAxMTMsXG4gICAgICAgIDE2NixcbiAgICAgICAgMTcyLFxuICAgICAgICA1OCxcbiAgICAgICAgMTU5LFxuICAgICAgICAyMSxcbiAgICAgICAgOTZcbiAgICAgIF1cbiAgICB9LFxuICAgIFwicHVibGljXCI6IHtcbiAgICAgIFwidHlwZVwiOiBcIkJ1ZmZlclwiLFxuICAgICAgXCJkYXRhXCI6IFtcbiAgICAgICAgMTQsXG4gICAgICAgIDExOCxcbiAgICAgICAgMTIxLFxuICAgICAgICAyMzksXG4gICAgICAgIDkyLFxuICAgICAgICAxNzIsXG4gICAgICAgIDgxLFxuICAgICAgICA2MixcbiAgICAgICAgMTM2LFxuICAgICAgICA3NCxcbiAgICAgICAgNzMsXG4gICAgICAgIDE2NCxcbiAgICAgICAgMTY3LFxuICAgICAgICAzMSxcbiAgICAgICAgODUsXG4gICAgICAgIDI0MSxcbiAgICAgICAgMTI3LFxuICAgICAgICAxMTQsXG4gICAgICAgIDUsXG4gICAgICAgIDExNCxcbiAgICAgICAgMjAwLFxuICAgICAgICA5LFxuICAgICAgICA4MCxcbiAgICAgICAgNjMsXG4gICAgICAgIDE4LFxuICAgICAgICAxNCxcbiAgICAgICAgNTAsXG4gICAgICAgIDE1OSxcbiAgICAgICAgNzAsXG4gICAgICAgIDUsXG4gICAgICAgIDI0NCxcbiAgICAgICAgODBcbiAgICAgIF1cbiAgICB9XG4gIH0sXG4gIFwic2lnbmVkSWRlbnRpdHlLZXlcIjoge1xuICAgIFwicHJpdmF0ZVwiOiB7XG4gICAgICBcInR5cGVcIjogXCJCdWZmZXJcIixcbiAgICAgIFwiZGF0YVwiOiBbXG4gICAgICAgIDAsXG4gICAgICAgIDM0LFxuICAgICAgICAxNDUsXG4gICAgICAgIDIxOCxcbiAgICAgICAgMzEsXG4gICAgICAgIDIxLFxuICAgICAgICAyMzIsXG4gICAgICAgIDIyNSxcbiAgICAgICAgMjQ0LFxuICAgICAgICAyMjYsXG4gICAgICAgIDMwLFxuICAgICAgICAxMzcsXG4gICAgICAgIDEzOCxcbiAgICAgICAgMTEsXG4gICAgICAgIDIxNCxcbiAgICAgICAgNDMsXG4gICAgICAgIDY0LFxuICAgICAgICA4OCxcbiAgICAgICAgMzIsXG4gICAgICAgIDc1LFxuICAgICAgICA3MixcbiAgICAgICAgMTc3LFxuICAgICAgICAyMDcsXG4gICAgICAgIDIzMSxcbiAgICAgICAgMzgsXG4gICAgICAgIDIwOSxcbiAgICAgICAgMzgsXG4gICAgICAgIDI0NyxcbiAgICAgICAgNDQsXG4gICAgICAgIDE5MSxcbiAgICAgICAgMjI4LFxuICAgICAgICA2NlxuICAgICAgXVxuICAgIH0sXG4gICAgXCJwdWJsaWNcIjoge1xuICAgICAgXCJ0eXBlXCI6IFwiQnVmZmVyXCIsXG4gICAgICBcImRhdGFcIjogW1xuICAgICAgICAyMjcsXG4gICAgICAgIDEyMixcbiAgICAgICAgNzMsXG4gICAgICAgIDE5MixcbiAgICAgICAgMTI5LFxuICAgICAgICAxOTEsXG4gICAgICAgIDI1MixcbiAgICAgICAgMjQ4LFxuICAgICAgICA5OSxcbiAgICAgICAgMTEyLFxuICAgICAgICAyNDcsXG4gICAgICAgIDk1LFxuICAgICAgICA5MCxcbiAgICAgICAgMjA4LFxuICAgICAgICAxODksXG4gICAgICAgIDIyMixcbiAgICAgICAgMjA5LFxuICAgICAgICA2NCxcbiAgICAgICAgMTAsXG4gICAgICAgIDkzLFxuICAgICAgICAxMDcsXG4gICAgICAgIDY4LFxuICAgICAgICA1MCxcbiAgICAgICAgODMsXG4gICAgICAgIDcwLFxuICAgICAgICA2MixcbiAgICAgICAgMCxcbiAgICAgICAgMjA3LFxuICAgICAgICA1MCxcbiAgICAgICAgMTc2LFxuICAgICAgICAyNTQsXG4gICAgICAgIDc4XG4gICAgICBdXG4gICAgfVxuICB9LFxuICBcInNpZ25lZFByZUtleVwiOiB7XG4gICAgXCJrZXlQYWlyXCI6IHtcbiAgICAgIFwicHJpdmF0ZVwiOiB7XG4gICAgICAgIFwidHlwZVwiOiBcIkJ1ZmZlclwiLFxuICAgICAgICBcImRhdGFcIjogW1xuICAgICAgICAgIDE2LFxuICAgICAgICAgIDE3OSxcbiAgICAgICAgICAxNjcsXG4gICAgICAgICAgMTgwLFxuICAgICAgICAgIDE2NCxcbiAgICAgICAgICAyNDIsXG4gICAgICAgICAgMTY3LFxuICAgICAgICAgIDEzNixcbiAgICAgICAgICAxNTMsXG4gICAgICAgICAgMzEsXG4gICAgICAgICAgMTUxLFxuICAgICAgICAgIDIyOSxcbiAgICAgICAgICAxMjcsXG4gICAgICAgICAgMjUxLFxuICAgICAgICAgIDE0MSxcbiAgICAgICAgICA5MSxcbiAgICAgICAgICAxNzcsXG4gICAgICAgICAgMTQwLFxuICAgICAgICAgIDEsXG4gICAgICAgICAgMjQ3LFxuICAgICAgICAgIDE4NSxcbiAgICAgICAgICAxMSxcbiAgICAgICAgICA5MixcbiAgICAgICAgICAxMDAsXG4gICAgICAgICAgMjcsXG4gICAgICAgICAgMTA4LFxuICAgICAgICAgIDMwLFxuICAgICAgICAgIDM1LFxuICAgICAgICAgIDI0NixcbiAgICAgICAgICAxMDgsXG4gICAgICAgICAgMjEyLFxuICAgICAgICAgIDk4XG4gICAgICAgIF1cbiAgICAgIH0sXG4gICAgICBcInB1YmxpY1wiOiB7XG4gICAgICAgIFwidHlwZVwiOiBcIkJ1ZmZlclwiLFxuICAgICAgICBcImRhdGFcIjogW1xuICAgICAgICAgIDM1LFxuICAgICAgICAgIDM0LFxuICAgICAgICAgIDExLFxuICAgICAgICAgIDExMixcbiAgICAgICAgICAxNzUsXG4gICAgICAgICAgNjcsXG4gICAgICAgICAgNyxcbiAgICAgICAgICAyMzYsXG4gICAgICAgICAgMjM0LFxuICAgICAgICAgIDksXG4gICAgICAgICAgMzYsXG4gICAgICAgICAgMTQ5LFxuICAgICAgICAgIDIyLFxuICAgICAgICAgIDE2OSxcbiAgICAgICAgICAyNTUsXG4gICAgICAgICAgNjAsXG4gICAgICAgICAgMTYwLFxuICAgICAgICAgIDE4NSxcbiAgICAgICAgICA3MixcbiAgICAgICAgICA2MSxcbiAgICAgICAgICAxNTAsXG4gICAgICAgICAgOCxcbiAgICAgICAgICAxNjUsXG4gICAgICAgICAgMTMyLFxuICAgICAgICAgIDkyLFxuICAgICAgICAgIDE5NCxcbiAgICAgICAgICAxNzgsXG4gICAgICAgICAgMzEsXG4gICAgICAgICAgMTMyLFxuICAgICAgICAgIDEwOSxcbiAgICAgICAgICAxMzgsXG4gICAgICAgICAgMTAzXG4gICAgICAgIF1cbiAgICAgIH1cbiAgICB9LFxuICAgIFwic2lnbmF0dXJlXCI6IHtcbiAgICAgIFwidHlwZVwiOiBcIkJ1ZmZlclwiLFxuICAgICAgXCJkYXRhXCI6IFtcbiAgICAgICAgMjIwLFxuICAgICAgICAyNTEsXG4gICAgICAgIDE2MCxcbiAgICAgICAgNzMsXG4gICAgICAgIDI1NSxcbiAgICAgICAgMjExLFxuICAgICAgICA5OCxcbiAgICAgICAgMTMxLFxuICAgICAgICAyMCxcbiAgICAgICAgMTI2LFxuICAgICAgICAxNjUsXG4gICAgICAgIDU4LFxuICAgICAgICAyNDcsXG4gICAgICAgIDE1LFxuICAgICAgICA0OSxcbiAgICAgICAgMjAyLFxuICAgICAgICAzNixcbiAgICAgICAgMjExLFxuICAgICAgICAxOTUsXG4gICAgICAgIDIzOCxcbiAgICAgICAgMTQwLFxuICAgICAgICAxMTgsXG4gICAgICAgIDc4LFxuICAgICAgICAxMjcsXG4gICAgICAgIDE5OSxcbiAgICAgICAgMTc4LFxuICAgICAgICAyMDgsXG4gICAgICAgIDAsXG4gICAgICAgIDI1MixcbiAgICAgICAgMTQzLFxuICAgICAgICA1NyxcbiAgICAgICAgMzIsXG4gICAgICAgIDY5LFxuICAgICAgICAxMDAsXG4gICAgICAgIDE1OCxcbiAgICAgICAgMjM1LFxuICAgICAgICA5MixcbiAgICAgICAgNTQsXG4gICAgICAgIDE3NixcbiAgICAgICAgMjUzLFxuICAgICAgICAxNjYsXG4gICAgICAgIDg4LFxuICAgICAgICAxNTIsXG4gICAgICAgIDE4NCxcbiAgICAgICAgMTA2LFxuICAgICAgICAyMTQsXG4gICAgICAgIDkzLFxuICAgICAgICAyMTIsXG4gICAgICAgIDIxMCxcbiAgICAgICAgMjE3LFxuICAgICAgICAxNzksXG4gICAgICAgIDE1NCxcbiAgICAgICAgODcsXG4gICAgICAgIDEwMCxcbiAgICAgICAgMTM2LFxuICAgICAgICA0NixcbiAgICAgICAgMTQ4LFxuICAgICAgICAyMDQsXG4gICAgICAgIDEzOCxcbiAgICAgICAgMTk0LFxuICAgICAgICA5MCxcbiAgICAgICAgMTkwLFxuICAgICAgICAxMDAsXG4gICAgICAgIDJcbiAgICAgIF1cbiAgICB9LFxuICAgIFwia2V5SWRcIjogMVxuICB9LFxuICBcInJlZ2lzdHJhdGlvbklkXCI6IDE1OSxcbiAgXCJhZHZTZWNyZXRLZXlcIjogXCIvOHhtS3phMk1rZFJwczFTa01TRHU4SUpUNU5hM1RadUVQWUhqc0Zmb2t3PVwiLFxuICBcInByb2Nlc3NlZEhpc3RvcnlNZXNzYWdlc1wiOiBbXSxcbiAgXCJuZXh0UHJlS2V5SWRcIjogMzEsXG4gIFwiZmlyc3RVbnVwbG9hZGVkUHJlS2V5SWRcIjogMzEsXG4gIFwiYWNjb3VudFN5bmNDb3VudGVyXCI6IDAsXG4gIFwiYWNjb3VudFNldHRpbmdzXCI6IHtcbiAgICBcInVuYXJjaGl2ZUNoYXRzXCI6IGZhbHNlXG4gIH0sXG4gIFwiZGV2aWNlSWRcIjogXCJPSHNVY0wxVVQzU3dzbGx0Yi11MkNBXCIsXG4gIFwicGhvbmVJZFwiOiBcImVjNjBjOWM1LTYxOGUtNDYzMy05MjEyLTM2YjNkNDAxMDgyZFwiLFxuICBcImlkZW50aXR5SWRcIjoge1xuICAgIFwidHlwZVwiOiBcIkJ1ZmZlclwiLFxuICAgIFwiZGF0YVwiOiBbXG4gICAgICAxMjQsXG4gICAgICA0NyxcbiAgICAgIDUsXG4gICAgICAxNyxcbiAgICAgIDE1OSxcbiAgICAgIDE2MixcbiAgICAgIDE4NixcbiAgICAgIDIzMSxcbiAgICAgIDE3NixcbiAgICAgIDgsXG4gICAgICAyNTIsXG4gICAgICAxMTIsXG4gICAgICA2MCxcbiAgICAgIDIxMCxcbiAgICAgIDI0LFxuICAgICAgMTg3LFxuICAgICAgMTc1LFxuICAgICAgMjUyLFxuICAgICAgMjUsXG4gICAgICAxMjVcbiAgICBdXG4gIH0sXG4gIFwicmVnaXN0ZXJlZFwiOiBmYWxzZSxcbiAgXCJiYWNrdXBUb2tlblwiOiB7XG4gICAgXCJ0eXBlXCI6IFwiQnVmZmVyXCIsXG4gICAgXCJkYXRhXCI6IFtcbiAgICAgIDYsXG4gICAgICA3NCxcbiAgICAgIDkwLFxuICAgICAgODUsXG4gICAgICAxMTYsXG4gICAgICAxOTMsXG4gICAgICAxMjMsXG4gICAgICAxMTEsXG4gICAgICA2NixcbiAgICAgIDEwOCxcbiAgICAgIDAsXG4gICAgICAxNDAsXG4gICAgICAyMDEsXG4gICAgICAzOCxcbiAgICAgIDEyNCxcbiAgICAgIDI4LFxuICAgICAgNjYsXG4gICAgICAxNzcsXG4gICAgICAxMixcbiAgICAgIDI0OFxuICAgIF1cbiAgfSxcbiAgXCJyZWdpc3RyYXRpb25cIjoge30sXG4gIFwiYWNjb3VudFwiOiB7XG4gICAgXCJkZXRhaWxzXCI6IFwiQ0ovSWhxUUdFUHZDa01JR0dBWWdBQ2dBXCIsXG4gICAgXCJhY2NvdW50U2lnbmF0dXJlS2V5XCI6IFwiSFNqQ3U1ak52dmZ1emsyTi9CeDVOM2ZUK3doSUV1Wis2L0ZkR0tUTUhrND1cIixcbiAgICBcImFjY291bnRTaWduYXR1cmVcIjogXCIxYnEyUU5CcHhxbytuRmlSR2hvd29MZUFQTHd5azZteDhvREFTUENxQlFpOVB2cEJ2WGw2TzVRVEtnd21QbXBRRTdhdU01eDIyam5zS25WeUxFblNCUT09XCIsXG4gICAgXCJkZXZpY2VTaWduYXR1cmVcIjogXCJZRFV4TEpValBKTjVNdGZWZmpQb3lHbzNYc2plSXZzRVlhQWdhLzhXMFBTSERLRDN6b0JPMW40bWErWWJPMGxJbFJZWHUxaEg0M3JiR2t2dW1yRmVBQT09XCJcbiAgfSxcbiAgXCJtZVwiOiB7XG4gICAgXCJpZFwiOiBcIjIzNzY3OTg0NTY5NDo4QHMud2hhdHNhcHAubmV0XCIsXG4gICAgXCJuYW1lXCI6IFwiTcOvxI1rw6/Dq2xsIH4gS8Oxw69naHRzXCIsXG4gICAgXCJsaWRcIjogXCI2MTAzNjA5OTAyMzA2NDo4QGxpZFwiXG4gIH0sXG4gIFwic2lnbmFsSWRlbnRpdGllc1wiOiBbXG4gICAge1xuICAgICAgXCJpZGVudGlmaWVyXCI6IHtcbiAgICAgICAgXCJuYW1lXCI6IFwiMjM3Njc5ODQ1Njk0OjhAcy53aGF0c2FwcC5uZXRcIixcbiAgICAgICAgXCJkZXZpY2VJZFwiOiAwXG4gICAgICB9LFxuICAgICAgXCJpZGVudGlmaWVyS2V5XCI6IHtcbiAgICAgICAgXCJ0eXBlXCI6IFwiQnVmZmVyXCIsXG4gICAgICAgIFwiZGF0YVwiOiBbXG4gICAgICAgICAgNSxcbiAgICAgICAgICAyOSxcbiAgICAgICAgICA0MCxcbiAgICAgICAgICAxOTQsXG4gICAgICAgICAgMTg3LFxuICAgICAgICAgIDE1MixcbiAgICAgICAgICAyMDUsXG4gICAgICAgICAgMTkwLFxuICAgICAgICAgIDI0NyxcbiAgICAgICAgICAyMzgsXG4gICAgICAgICAgMjA2LFxuICAgICAgICAgIDc3LFxuICAgICAgICAgIDE0MSxcbiAgICAgICAgICAyNTIsXG4gICAgICAgICAgMjgsXG4gICAgICAgICAgMTIxLFxuICAgICAgICAgIDU1LFxuICAgICAgICAgIDExOSxcbiAgICAgICAgICAyMTEsXG4gICAgICAgICAgMjUxLFxuICAgICAgICAgIDgsXG4gICAgICAgICAgNzIsXG4gICAgICAgICAgMTgsXG4gICAgICAgICAgMjMwLFxuICAgICAgICAgIDEyNixcbiAgICAgICAgICAyMzUsXG4gICAgICAgICAgMjQxLFxuICAgICAgICAgIDkzLFxuICAgICAgICAgIDI0LFxuICAgICAgICAgIDE2NCxcbiAgICAgICAgICAyMDQsXG4gICAgICAgICAgMzAsXG4gICAgICAgICAgNzhcbiAgICAgICAgXVxuICAgICAgfVxuICAgIH1cbiAgXSxcbiAgXCJwbGF0Zm9ybVwiOiBcInNtYmFcIixcbiAgXCJsYXN0QWNjb3VudFN5bmNUaW1lc3RhbXBcIjogMTc0OTI5NTQ4OVxufSIKfQ=="  // PUT your SESSION_ID 


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
