const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion
} = require("@whiskeysockets/baileys");

const pino = require("pino");
const { handleCommand } = require("./commands");

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("./session");
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    auth: state,
    logger: pino({ level: "silent" }),
    printQRInTerminal: false,
    browser: ["MADARA SOLITAIRE MD", "Chrome", "1.0.0"]
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === "open") {
      console.log("✅ MADARA SOLITAIRE MD est connecté à WhatsApp !");
    }

    if (connection === "close") {
      const statusCode = lastDisconnect?.error?.output?.statusCode;

      if (statusCode !== DisconnectReason.loggedOut) {
        console.log("🔄 Connexion interrompue. Nouvelle tentative...");
        setTimeout(() => startBot().catch(console.error), 3000);
      } else {
        console.log("❌ Session déconnectée. Relie le compte à nouveau.");
      }
    }
  });

  sock.ev.on("messages.upsert", async ({ messages, type }) => {
    if (type !== "notify") return;

    for (const message of messages) {
      if (!message.message || message.key.fromMe) continue;

      const jid = message.key.remoteJid;
      if (!jid || jid === "status@broadcast" || jid.endsWith("@g.us")) continue;

      const content =
        message.message.conversation ||
        message.message.extendedTextMessage?.text ||
        "";

      if (!content.trim().startsWith(".")) continue;

      try {
        await handleCommand(sock, jid, content);
      } catch (error) {
        console.error("Erreur de commande :", error);
        await sock.sendMessage(jid, {
          text: "❌ Une erreur est survenue pendant l'exécution de la commande."
        });
      }
    }
  });
}

startBot().catch(console.error);