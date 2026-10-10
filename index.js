
require("dotenv").config();

const pino = require("pino");
const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  Browsers
} = require("@whiskeysockets/baileys");

const { handleCommand } = require("./commands");

async function startBot() {
  const { state, saveCreds } =
    await useMultiFileAuthState("session");

  const sock = makeWASocket({
    auth: state,
    logger: pino({ level: "silent" }),
    browser: Browsers.ubuntu("Chrome")
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", ({ connection, lastDisconnect }) => {
    if (connection === "open") {
      console.log("MADARA SOLITAIRE MD est connecté !");
    }

    if (connection === "close") {
      const code = lastDisconnect?.error?.output?.statusCode;

      if (code !== DisconnectReason.loggedOut) {
        setTimeout(() => startBot(), 3000);
      } else {
        console.log("Session déconnectée. Relie ton compte à nouveau.");
      }
    }
  });

  sock.ev.on("messages.upsert", async ({ messages, type }) => {
    if (type !== "notify") return;

    for (const msg of messages) {
      if (!msg.message || msg.key.fromMe) continue;

      const jid = msg.key.remoteJid;
      if (!jid || jid === "status@broadcast") continue;

      const text =
        msg.message.conversation ||
        msg.message.extendedTextMessage?.text ||
        msg.message.imageMessage?.caption ||
        msg.message.videoMessage?.caption ||
        "";

      if (!text.trim().startsWith(".")) continue;

      try {
        await handleCommand(sock, jid, text);
      } catch (error) {
        console.error("Erreur de commande :", error);
        await sock.sendMessage(jid, {
          text: "❌ Une erreur est survenue. Réessaie plus tard."
        });
      }
    }
  });
}

startBot().catch(console.error);
