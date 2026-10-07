const axios = require("axios");
const cheerio = require("cheerio");

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36";

const cleanUrl = href => {
  if (!href) return "";
  // DDG wraps results in /l/?uddg=<encoded>
  const wrapped = href.match(/[?&]uddg=([^&]+)/);
  return wrapped ? decodeURIComponent(wrapped[1]) : href;
};

/**
 * @param {string} query
 * @returns {Promise<Array<{title: string, snippet: string, link: string}>>}
 */
async function search(query, limit = 10) {
  const { data: html } = await axios.get("https://html.duckduckgo.com/html/", {
    params: { q: query },
    headers: { "User-Agent": UA, "Accept-Language": "en-US,en;q=0.9" },
    timeout: 20000,
    validateStatus: () => true
  });

  const $ = cheerio.load(html);
  const results = [];
  const seen = new Set();

  $("div.result, div.web-result").each((_, el) => {
    if (results.length >= limit) return;
    const $el = $(el);
    const $a = $el.find("a.result__a").first();
    const link = cleanUrl($a.attr("href"));
    const title = $a.text().replace(/\s+/g, " ").trim();
    if (!link || !title || !/^https?:/i.test(link) || seen.has(link)) return;
    seen.add(link);
    results.push({
      title,
      link,
      snippet: $el
        .find(".result__snippet")
        .first()
        .text()
        .replace(/\s+/g, " ")
        .trim()
    });
  });

  return results;
}

module.exports = { search };