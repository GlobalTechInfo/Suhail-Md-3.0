const fetch = require("node-fetch");

const ENDPOINTS = {
  llama: "https://llama.gtech-apiz.workers.dev?apikey=Suhail&text=",
  mistral: "https://mistral.gtech-apiz.workers.dev?apikey=Suhail&text=",
  dalle: "https://dalle.stacktoy.workers.dev?apikey=Suhail&prompt=",
  stable: "https://stable.gtech-apiz.workers.dev?apikey=Suhail&prompt=",
  flux: "https://flux.gtech-apiz.workers.dev?apikey=Suhail&text="
};

const TEXT_TIMEOUT = 120000;
const IMAGE_TIMEOUT = 180000;
const RETRYABLE = /ECONNRESET|ETIMEDOUT|EPIPE|EAI_AGAIN|ENOTFOUND|socket hang up|socket disconnected|other side closed|premature close/i;

async function request(url, options, label) {
  let lastError;
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      return await fetch(url, options);
    } catch (err) {
      lastError = err;
      const detail = String(err && (err.code || err.message) || err);
      if (attempt === 2 || !RETRYABLE.test(detail)) {
        throw new Error(label + " request failed: " + (err && err.message || err));
      }
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
  throw new Error(label + " request failed: " + (lastError && lastError.message || lastError));
}

function cleanPrompt(prompt) {
  const value = typeof prompt === "string" ? prompt.trim() : "";
  if (!value) {
    throw new Error("Prompt is required.");
  }
  return value;
}

function errorDetail(payload, fallback) {
  if (payload && typeof payload === "object") {
    return payload.error || payload.message || payload.detail || fallback;
  }
  return fallback;
}

async function chat(baseUrl, label, prompt) {
  const text = cleanPrompt(prompt);
  const response = await request(baseUrl + encodeURIComponent(text), {
    timeout: TEXT_TIMEOUT
  }, label);
  const raw = await response.text();
  let payload;
  try {
    payload = JSON.parse(raw);
  } catch (err) {
    throw new Error(label + " returned a non-JSON response (HTTP " + response.status + "): " + raw.slice(0, 200));
  }
  if (!response.ok) {
    throw new Error(label + " request failed (HTTP " + response.status + "): " + errorDetail(payload, raw.slice(0, 200)));
  }
  const content = payload && payload.data && payload.data.choices && payload.data.choices[0] && payload.data.choices[0].message && payload.data.choices[0].message.content;
  if (typeof content !== "string" || !content.trim()) {
    throw new Error(label + " returned no text: " + errorDetail(payload, raw.slice(0, 200)));
  }
  return content.trim();
}

function isImage(buffer) {
  if (!Buffer.isBuffer(buffer) || buffer.length < 12) {
    return false;
  }
  const png = buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47 && buffer[4] === 0x0d && buffer[5] === 0x0a && buffer[6] === 0x1a && buffer[7] === 0x0a;
  const jpeg = buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  const gif = ["GIF87a", "GIF89a"].includes(buffer.subarray(0, 6).toString("ascii"));
  const webp = buffer.subarray(0, 4).toString("ascii") === "RIFF" && buffer.subarray(8, 12).toString("ascii") === "WEBP";
  return png || jpeg || gif || webp;
}

function imageFailure(buffer, status, contentType) {
  const raw = buffer.toString("utf8", 0, Math.min(buffer.length, 500));
  let payload;
  try {
    payload = JSON.parse(raw);
  } catch (err) {}
  const detail = payload ? errorDetail(payload, raw) : raw;
  return "did not return an image (HTTP " + status + ", " + (contentType || "unknown content type") + "): " + String(detail).replace(/\s+/g, " ").slice(0, 300);
}

async function image(baseUrl, label, prompt, timeout = IMAGE_TIMEOUT) {
  const text = cleanPrompt(prompt);
  const response = await request(baseUrl + encodeURIComponent(text), {
    timeout
  }, label);
  const buffer = Buffer.from(await response.arrayBuffer());
  if (!isImage(buffer)) {
    throw new Error(label + " " + imageFailure(buffer, response.status, response.headers.get("content-type")));
  }
  return buffer;
}

module.exports = {
  llamaChat: prompt => chat(ENDPOINTS.llama, "Llama", prompt),
  mistralChat: prompt => chat(ENDPOINTS.mistral, "Mistral", prompt),
  dalleImage: prompt => image(ENDPOINTS.dalle, "DALL-E", prompt, 120000),
  stableImage: prompt => image(ENDPOINTS.stable, "Stable Diffusion", prompt, IMAGE_TIMEOUT),
  fluxImage: prompt => image(ENDPOINTS.flux, "Flux", prompt, IMAGE_TIMEOUT)
};
