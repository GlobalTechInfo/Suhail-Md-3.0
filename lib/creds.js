const fs = require("fs");
const path = require("path");

const REQUIRED_KEYS = ["noiseKey", "signedIdentityKey", "signedPreKey", "registrationId", "advSecretKey"];

const MEGA_CODE = /^(?:[A-Za-z0-9_-]{8,}#[A-Za-z0-9_-]{8,}|[A-Za-z0-9_-]{20,}![A-Za-z0-9_-]{20,})$/;

const SESSION_ID_PREFIX = /^(?:GlobalTechInfo\/)?Suhail-Md[_-]?/i;

const stripSessionPrefix = value => String(value === undefined || value === null ? "" : value).trim().replace(SESSION_ID_PREFIX, "");

const isMegaCode = value => typeof value === "string" && MEGA_CODE.test(stripSessionPrefix(value));

const validateCreds = creds => {
  if (!creds || typeof creds !== "object" || Array.isArray(creds)) return "not a JSON object";
  
  const missing = REQUIRED_KEYS.filter(k => creds[k] === undefined || creds[k] === null);
  if (missing.length) {
    return "missing key(s): " + missing.join(", ");
  }
  if (creds.registered !== true) return "creds are not marked registered";
  if (!creds.me || !creds.me.id) return "no `me.id` in creds";
  return null;
};

async function downloadMegaCreds(rawCode, credsPath, { logger } = {}) {
  const say = (...a) => {
    if (typeof logger === "function") logger(...a);
  };
  const code = stripSessionPrefix(rawCode);
  if (!MEGA_CODE.test(code)) {
    return { ok: false, reason: "not a valid Mega file code (expected <key>#<id>)" };
  }
  say("[creds] resolved Mega file code: " + code.slice(0, 6) + "..." + code.slice(-4));

  try {
    const mega = require("megajs");
    const file = mega.File.fromURL("https://mega.nz/file/" + code);

    let raw = "";
    for await (const chunk of file.download()) raw += chunk.toString();

    if (!raw.trim()) return { ok: false, reason: "downloaded file was empty" };

    let creds;
    try {
      creds = JSON.parse(raw);
    } catch (err) {
      return { ok: false, reason: "downloaded file is not valid JSON" };
    }

    const problem = validateCreds(creds);
    if (problem) return { ok: false, reason: "invalid creds — " + problem };

    fs.mkdirSync(path.dirname(credsPath), { recursive: true });
    fs.writeFileSync(credsPath, JSON.stringify(creds, null, 2));
    say("✅ Session imported from Mega for " + creds.me.id);
    return { ok: true, creds };
  } catch (err) {
    return { ok: false, reason: "Mega download failed — " + (err && err.message ? err.message : String(err)) };
  }
}

module.exports = { downloadMegaCreds, validateCreds, isMegaCode, stripSessionPrefix, MEGA_CODE };
