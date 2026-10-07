global.SmdOfficial = "yes";
require("./config.js");
const Module = require("module");
const path = require("path");
const slow = [];
const load = Module._load;
Module._load = function (request, parent, isMain) {
  const t = Date.now();
  const r = load.apply(this, arguments);
  const ms = Date.now() - t;
  if (ms > 400) {
    let f = request;
    try { f = Module._resolveFilename(request, parent, isMain); } catch (e) {}
    slow.push([ms, f]);
    console.log("  SLOW " + String(ms).padStart(7) + "ms  " + String(f).replace("/root/Suhail-Md-3.0/", ""));
  }
  return r;
};
const t = Date.now();
require("./lib/smd.js");
console.log("  TOTAL require(smd) :", Date.now() - t, "ms");
slow.sort((a, b) => b[0] - a[0]);
console.log("  --- top 12 slowest ---");
slow.slice(0, 12).forEach(([ms, f]) => console.log("   " + String(ms).padStart(7) + "ms  " + f));
