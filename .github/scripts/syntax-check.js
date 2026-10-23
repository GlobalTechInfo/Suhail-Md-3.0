"use strict";
// CI syntax check: compiles every first-party JS/.smd file WITHOUT executing it,
// so it needs no config, env vars, or session files to run.
// Catches broken edits in lib/ and plugins/ before a release is published.
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.resolve(__dirname, "..", "..");
const SKIP = new Set(["node_modules", ".git", "temp", "tmp", "data", ".npm"]);
const files = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (/\.(js|cjs|mjs|smd)$/.test(entry.name)) files.push(full);
  }
}

walk(ROOT);

let failed = 0;
for (const file of files) {
  try {
    new vm.Script(fs.readFileSync(file, "utf8"), { filename: file });
  } catch (err) {
    failed++;
    console.error(`::error file=${path.relative(ROOT, file)}::Syntax error: ${err.message}`);
  }
}

console.log(`Syntax-checked ${files.length} files, ${failed} failed`);
process.exit(failed ? 1 : 0);
