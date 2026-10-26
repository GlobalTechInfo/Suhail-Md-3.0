const axios = require("axios");
const cheerio = require("cheerio");

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36";

const HEADERS = {
  "User-Agent": UA,
  "Accept-Language": "en-US,en;q=0.9"
};

const cleanText = value => String(value || "").replace(/\s+/g, " ").trim();

const cleanUrl = href => {
  if (!href) return "";
  // DuckDuckGo wraps results in /l/?uddg=<encoded>
  const wrapped = href.match(/[?&]uddg=([^&]+)/);
  return wrapped ? decodeURIComponent(wrapped[1]) : href;
};

// Bing wraps every result in https://www.bing.com/ck/a?...&u=a1<base64url>
const unwrapBingLink = href => {
  if (!href) return "";
  try {
    const url = new URL(href);
    const target = url.searchParams.get("u");
    if (!target) return href;
    if (target.startsWith("a1")) {
      const decoded = Buffer.from(
        target.slice(2).replace(/-/g, "+").replace(/_/g, "/"),
        "base64"
      ).toString("utf8");
      if (/^https?:\/\//i.test(decoded)) return decoded;
    }
    if (/^https?:\/\//i.test(target)) return target;
  } catch (e) {}
  return href;
};

async function bingSearch(query, limit) {
  const { data: html, status } = await axios.get("https://www.bing.com/search", {
    params: { q: query, setlang: "en", cc: "US" },
    headers: HEADERS,
    timeout: 20000,
    validateStatus: () => true
  });
  if (status !== 200) throw new Error("Bing returned HTTP " + status);

  const $ = cheerio.load(html);
  const results = [];
  const seen = new Set();

  $("li.b_algo").each((_, el) => {
    if (results.length >= limit) return;
    const $el = $(el);
    const $a = $el.find("h2 a").first();
    const link = unwrapBingLink($a.attr("href"));
    const title = cleanText($a.text());
    if (!link || !title || !/^https?:/i.test(link) || seen.has(link)) return;
    seen.add(link);
    results.push({
      title,
      link,
      snippet: cleanText(
        $el.find(".b_caption p, .b_snippet, .b_lineclamp2, .b_lineclamp3").first().text()
      )
    });
  });

  return results;
}

async function duckSearch(query, limit) {
  const { data: html, status } = await axios.get("https://html.duckduckgo.com/html/", {
    params: { q: query },
    headers: HEADERS,
    timeout: 20000,
    validateStatus: () => true
  });
  if (status !== 200) throw new Error("DuckDuckGo returned HTTP " + status);

  const $ = cheerio.load(html);
  const results = [];
  const seen = new Set();

  $("div.result, div.web-result").each((_, el) => {
    if (results.length >= limit) return;
    const $el = $(el);
    const $a = $el.find("a.result__a").first();
    const link = cleanUrl($a.attr("href"));
    const title = cleanText($a.text());
    if (!link || !title || !/^https?:/i.test(link) || seen.has(link)) return;
    seen.add(link);
    results.push({
      title,
      link,
      snippet: cleanText($el.find(".result__snippet").first().text())
    });
  });

  return results;
}

/**
 * Web search with a provider fallback. Bing is attempted first because
 * DuckDuckGo frequently serves an HTTP 202 challenge to bot traffic.
 * @param {string} query
 * @returns {Promise<Array<{title: string, snippet: string, link: string}>>}
 */
async function search(query, limit = 10) {
  for (const provider of [bingSearch, duckSearch]) {
    try {
      const results = await provider(query, limit);
      if (results.length) return results;
    } catch (e) {}
  }
  return [];
}

/**
 * Bing image search. `safe` may be "off" (NSFW groups) or anything else
 * for strict safe search.
 * @returns {Promise<Array<{url: string, title: string, page: string}>>}
 */
async function imageSearch(query, limit = 5, safe = "strict") {
  const { data: html, status } = await axios.get("https://www.bing.com/images/search", {
    params: {
      q: query,
      first: 1,
      count: Math.max(limit * 4, 35),
      adlt: safe === "off" ? "off" : "strict"
    },
    headers: HEADERS,
    timeout: 25000,
    validateStatus: () => true
  });
  if (status !== 200) throw new Error("Bing Images returned HTTP " + status);

  const $ = cheerio.load(html);
  const images = [];
  const seen = new Set();

  $("a.iusc").each((_, el) => {
    if (images.length >= limit) return;
    let meta;
    try {
      meta = JSON.parse($(el).attr("m") || "{}");
    } catch (e) {
      return;
    }
    const url = meta.murl;
    if (!url || !/^https?:\/\//i.test(url) || seen.has(url)) return;
    seen.add(url);
    images.push({
      url,
      title: cleanText(meta.t),
      page: meta.purl || ""
    });
  });

  return images;
}

/**
 * Find a song on lyrics.ovh's suggestion API, then download the first
 * suggestion that actually has lyrics (the first match is not always right).
 * @returns {Promise<{title: string, artist: string, lyrics: string}|null>}
 */
async function lyrics(query) {
  const suggested = await axios.get(
    "https://api.lyrics.ovh/suggest/" + encodeURIComponent(query),
    { headers: HEADERS, timeout: 25000, validateStatus: () => true }
  );
  if (suggested.status !== 200 || !suggested.data || !Array.isArray(suggested.data.data)) {
    throw new Error("Lyrics search returned HTTP " + suggested.status);
  }

  for (const item of suggested.data.data.slice(0, 5)) {
    const title = cleanText(item.title);
    const artist = cleanText(item.artist && item.artist.name);
    if (!title || !artist) continue;

    const result = await axios.get(
      "https://api.lyrics.ovh/v1/" +
        encodeURIComponent(artist) +
        "/" +
        encodeURIComponent(title),
      { headers: HEADERS, timeout: 25000, validateStatus: () => true }
    );
    const text = result.data && result.data.lyrics;
    if (result.status === 200 && typeof text === "string" && text.trim()) {
      return { title, artist, lyrics: text.trim() };
    }
  }

  return null;
}

// Return the JSON value beginning at `start` without being confused by braces
// inside strings. Used for the embedded Next.js payload on Cricbuzz.
function sliceJson(text, start) {
  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let i = start; i < text.length; i++) {
    const ch = text[i];
    if (inString) {
      if (escaped) escaped = false;
      else if (ch === "\\") escaped = true;
      else if (ch === '"') inString = false;
      continue;
    }
    if (ch === '"') inString = true;
    else if (ch === "{" || ch === "[") depth++;
    else if (ch === "}" || ch === "]") {
      depth--;
      if (depth === 0) return text.slice(start, i + 1);
    }
  }
  return null;
}

/**
 * Live cricket scores from Cricbuzz's public live-scores page.
 * The site streams a Next.js payload containing matchesList.matches.
 * @returns {Promise<Array<object>>}
 */
async function cricketLive(limit = 10) {
  const { data: html, status } = await axios.get(
    "https://www.cricbuzz.com/cricket-match/live-scores",
    { headers: HEADERS, timeout: 30000, validateStatus: () => true }
  );
  if (status !== 200) throw new Error("Cricbuzz returned HTTP " + status);

  // Rebuild the streamed Next.js flight data from its escaped script chunks.
  const chunks = [];
  const chunkPattern = /self\.__next_f\.push\((\[[\s\S]*?\])\)<\/script>/g;
  let match;
  while ((match = chunkPattern.exec(String(html)))) {
    try {
      const args = JSON.parse(match[1]);
      if (typeof args[1] === "string") chunks.push(args[1]);
    } catch (e) {}
  }

  const flight = chunks.join("");
  const key = '"matchesList":{"matches":[';
  const at = flight.indexOf(key);
  if (at === -1) throw new Error("Cricbuzz live match data was not found");

  const start = flight.indexOf("[", at + key.length - 1);
  const list = JSON.parse(sliceJson(flight, start));
  if (!Array.isArray(list)) throw new Error("Cricbuzz live match data was invalid");

  return list.slice(0, limit).map(item => {
    const info = item && item.match && item.match.matchInfo;
    if (!info) return null;
    const state = cleanText(info.state);
    return {
      name: cleanText((info.team1 && info.team1.teamName) + " vs " + (info.team2 && info.team2.teamName)),
      series: cleanText(info.seriesName),
      match: cleanText(info.matchDesc),
      status: cleanText(info.status),
      state,
      dateTimeGMT: info.startDate ? new Date(info.startDate).toISOString() : "",
      matchStarted: !!state && !/preview|upcoming|toss/i.test(state),
      matchEnded: /complete|result|abandon|cancel/i.test(state)
    };
  }).filter(Boolean);
}

module.exports = { search, imageSearch, lyrics, cricketLive };
