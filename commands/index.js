const { menuCommand } = require("./menu");
const { pingCommand } = require("./ping");
const { aliveCommand } = require("./alive");
const { ownerCommand } = require("./owner");
const { botinfoCommand } = require("../botinfo");
const { runtimeCommand } = require("./runtime");
const { pairCommand } = require("./pair");

async function handleCommand(sock, jid, text) {
  if (typeof text !== "string") return;

  const parts = text.trim().split(/\s+/);
  const command = (parts[0] || "").toLowerCase();
  const args = parts.slice(1);

  if (!command.startsWith(".")) return;

  switch (command) {
    case ".menu":
    case ".help":
      return menuCommand(sock, jid);

    case ".ping":
      return pingCommand(sock, jid);

    case ".alive":
      return aliveCommand(sock, jid);

    case ".owner":
      return ownerCommand(sock, jid);

    case ".botinfo":
      return botinfoCommand(sock, jid);

    case ".runtime":
      return runtimeCommand(sock, jid);

    case ".pair":
      return pairCommand(sock, jid, args);

    default:
      return;
  }
}

module.exports = { handleCommand };