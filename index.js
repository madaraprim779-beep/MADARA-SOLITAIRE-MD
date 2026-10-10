require("dotenv").config();

const pino = require("pino");

const {
default: makeWASocket,
useMultiFileAuthState,
DisconnectReason,
Browsers
} = require("@whiskeysockets/baileys");

const PREFIX = ".";
const BOT_NAME = "MADARA SOLITAIRE MD";
const OWNER_NAME = "MADARA SOLITAIRE";

async function startBot() {
const { state, saveCreds } = await useMultiFileAuthState("session");

const sock = makeWASocket({
auth: state,
logger: pino({ level: "silent" }),
browser: Browsers.ubuntu("Chrome")
});

sock.ev.on("creds.update", saveCreds);

sock.ev.on("connection.update", ({ connection, lastDisconnect }) => {
if (connection === "open") {
console.log("${BOT_NAME} connecté à WhatsApp.");
}

if (connection === "close") {
  const code = lastDisconnect?.error?.output?.statusCode;
  if (code !== DisconnectReason.loggedOut) {
    console.log("Connexion interrompue. Nouvelle tentative...");
    setTimeout(startBot, 3000);
  } else {
    console.log("Session déconnectée. Relie le compte à nouveau.");
  }
}

});

sock.ev.on("messages.upsert", async ({ messages, type }) => {
if (type !== "notify") return;

for (const msg of messages) {
  if (!msg.message || msg.key.fromMe) continue;

  const from = msg.key.remoteJid;
  if (!from || from === "status@broadcast") continue;

  const text =
    msg.message.conversation ||
    msg.message.extendedTextMessage?.text ||
    "";

  if (!text.startsWith(PREFIX)) continue;

  const [command] = text.slice(PREFIX.length).trim().split(/\s+/);
  let reply = "";

  switch ((command || "").toLowerCase()) {
    case "menu":
      reply =
        `╭━━━〔 ${BOT_NAME} 〕━━━╮\n` +
        `│ .menu\n│ .ping\n│ .alive\n│ .owner\n│ .about\n│ .pair\n` +
        `╰━━━━━━━━━━━━━━━━━━╯`;
      break;

    case "ping":
      reply = "🏓 Pong ! MADARA SOLITAIRE MD est actif.";
      break;

    case "alive":
      reply = `✅ ${BOT_NAME} est en ligne.`;
      break;

    case "owner":
      reply = `👑 Propriétaire : ${OWNER_NAME}`;
      break;

    case "about":
      reply = `${BOT_NAME}\nBot WhatsApp créé par ${OWNER_NAME}.`;
      break;

    case "pair":
      reply =
        "🔗 Pour lier ton compte, utilise le code de liaison " +
        "depuis le service sécurisé prévu pour le bot. " +
        "Cette commande n'est pas encore activée.";
      break;

    default:
      reply = "";
  }

  if (reply) {
    await sock.sendMessage(from, { text: reply }, { quoted: msg });
  }
}

});
}

startBot().catch((err) => {
console.error("Erreur de démarrage :", err);
});