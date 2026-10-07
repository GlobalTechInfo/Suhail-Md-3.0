const Module = require("module");

const compat = new Proxy(require("file-type"), {
  get: (mod, prop) => (prop === "fromBuffer" ? mod.fileTypeFromBuffer : mod[prop])
});

const load = Module._load;
Module._load = function (request) {
  if (request === "file-type") {
    return compat;
  }
  return load.apply(this, arguments);
};

module.exports = compat;
