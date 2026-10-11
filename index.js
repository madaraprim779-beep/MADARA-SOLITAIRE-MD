
const readline = require("readline");
const pino = require("pino");

const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion
} = require("@whiskeysockets/baileys");

const { handleCommand } = require("./commands");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function demanderNumero() {
  return new Promise((resolve) => {
    rl.question(
      "Entre ton numéro WhatsApp avec indicatif, sans + ni espaces (exemple : 225XXXXXXXXXX) : ",
      (numero) => resolve(numero.replace(/\D/g, ""))
    );
  });
}

async function startBot() {
  const { state, saveCreds } =
    await useMultiFileAuthState("./session");

  let numero = "";

  if (!state.creds.registered) {
    numero = await demanderNumero();

    if (numero.length < 8 || numero.length > 15) {
      console.log("❌ Numéro invalide. Relance le bot et réessaie.");
      rl.close();
      return;
    }
  }

  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    auth: state,
    logger: pino({ level: "silent" }),
    printQRInTerminal: false,
    browser: ["MADARA SOLITAIRE MD", "Chrome", "1.0.0"]
  });

  sock.ev.on("creds.update", saveCreds);

  if (!state.creds.registered && numero) {
    try {
      const code = await sock.requestPairingCode(numero);
      console.log("\n╔════════════════════════════╗");
      console.log("   MADARA SOLITAIRE MD");
      console.log("   CODE DE LIAISON WHATSAPP");
      console.log("   " + code);
      console.log("╚════════════════════════════╝\n");
      console.log("Sur WhatsApp : Appareils connectés");
      console.log("Puis Connecter un appareil → Connecter avec un numéro.");
      console.log("Saisis le code affiché ci-dessus dans WhatsApp.");
    } catch (error) {
      console.error("❌ Erreur de liaison :", error.message);
      rl.close();
      return;
    }
  }

  sock.ev.on("connection.update", ({ connection, lastDisconnect }) => {
    if (connection === "open") {
      console.log("✅ MADARA SOLITAIRE MD est connecté !");
      if (!rl.closed) rl.close();
    }

    if (connection === "close") {
      const statusCode = lastDisconnect?.error?.output?.statusCode;

      if (statusCode !== DisconnectReason.loggedOut) {
        console.log("🔄 Connexion interrompue. Nouvelle tentative...");
        setTimeout(() => startBot().catch(console.error), 3000);
      } else {
        console.log("❌ Session déconnectée. Supprime la session uniquement si tu veux relier le compte.");
      }
    }
  });

  sock.ev.on("messages.upsert", async ({ messages, type }) => {
    if (type !== "notify") return;

    for (const message of messages) {
      if (!message.message || message.key.fromMe) continue;

      const jid = message.key.remoteJid;
      if (!jid || jid === "status@broadcast") continue;

      const content =
        message.message.conversation ||
        message.message.extendedTextMessage?.text ||
        message.message.imageMessage?.caption ||
        "";

      if (!content.trim().startsWith(".")) continue;

      try {
        await handleCommand(sock, jid, content);
      } catch (error) {
        console.error("Erreur de commande :", error.message);
        await sock.sendMessage(jid, {
          text: "❌ Une erreur est survenue pendant cette commande."
        });
      }
    }
  });
}

startBot().catch((error) => {
  console.error("Erreur de démarrage :", error);
  if (!rl.closed) rl.close();
});
