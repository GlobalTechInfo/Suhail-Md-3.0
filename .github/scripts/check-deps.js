"use strict";
// CI dependency check: confirms every declared dependency resolves on disk.
// Catches removed/renamed deps and out-of-sync lockfiles before release.
const path = require("path");
const pkg = require(path.join(__dirname, "..", "..", "package.json"));

const ROOT = path.join(__dirname, "..", "..");
const deps = Object.keys(pkg.dependencies || {});
const missing = [];

for (const dep of deps) {
  try {
    require.resolve(dep, { paths: [ROOT] });
  } catch {
    missing.push(dep);
  }
}

missing.forEach(d => console.error(`::error::Cannot resolve dependency: ${d}`));
console.log(`Resolved ${deps.length} dependencies, ${missing.length} missing`);

process.exit(missing.length ? 1 : 0);
