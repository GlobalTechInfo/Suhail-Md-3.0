var config = require("../config");
var commands = [];
function cmd(command, handler) {
  var commandObj = command;
  commandObj.function = handler;
  if (!commandObj.pattern && command.cmdname) {
    commandObj.pattern = command.cmdname;
  }
  if (!commandObj.alias) {
    commandObj.alias = [];
  }
  if (!commandObj.dontAddCommandList) {
    commandObj.dontAddCommandList = false;
  }
  if (!commandObj.desc) {
    commandObj.desc = command.info ? command.info : "";
  }
  if (!commandObj.fromMe) {
    commandObj.fromMe = false;
  }
  if (!commandObj.category) {
    commandObj.category = command.type ? command.type : "misc";
  }
  commandObj.info = commandObj.desc;
  commandObj.type = commandObj.category;
  if (!commandObj.use) {
    commandObj.use = "";
  }
  if (!commandObj.filename) {
    commandObj.filename = "Not Provided";
  }
  commands.push(commandObj);
  return commandObj;
}
const Module = {
  export: cmd
};
module.exports = {
  cmd: cmd,
  AddCommand: cmd,
  Function: cmd,
  Module: Module,
  smd: cmd,
  commands: commands,
  bot: cmd
};
