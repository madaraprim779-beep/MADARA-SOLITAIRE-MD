
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

function askPhone() {
  return new Promise((resolve) => {
    rl.question(
      "Numéro WhatsApp international (sans + ni espaces) : ",
      (answer) => resolve(answer.replace(/\D/g, ""))
    );
  });
}

async function startBot() {
  const { state, saveCreds } =
    await useMultiFileAuthState("./session");

  let phone = "";

  if (!state.creds.registered) {
    phone = await askPhone();

    if (phone.length < 8 || phone.length > 15) {
      console.log("Numéro invalide. Relance npm start.");
      rl.close();
      return;
    }
  }

  let version;

  try {
    ({ version } = await fetchLatestBaileysVersion());
  } catch (error) {
    console.error("Impossible de récupérer la version WhatsApp :", error.message);
    rl.close();
    return;
  }

  const sock = makeWASocket({
    version,
    auth: state,
    logger: pino({ level: "silent" }),
    printQRInTerminal: false,
    browser: ["MADARA SOLITAIRE MD", "Chrome", "1.0.0"]
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", ({ connection, lastDisconnect }) => {
    if (connection === "open") {
      console.log("✅ MADARA SOLITAIRE MD est connecté !");
      if (!rl.closed) rl.close();
    }

    if (connection === "close") {
      const status = lastDisconnect?.error?.output?.statusCode;
      console.log("Connexion fermée. Code de statut :", status ?? "inconnu");

      if (status === DisconnectReason.loggedOut) {
        console.log("La session est déconnectée. Une nouvelle liaison sera nécessaire.");
      } else {
        console.log("Vérifie Internet, puis relance npm start.");
      }

      if (!rl.closed) rl.close();
    }
  });

  if (!state.creds.registered) {
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      const code = await sock.requestPairingCode(phone);

      console.log("\n================================");
      console.log(" MADARA SOLITAIRE MD");
      console.log(" CODE DE LIAISON : " + code);
      console.log("================================\n");
      console.log("WhatsApp > Appareils connectés");
      console.log("> Connecter un appareil");
      console.log("> Connexion avec numéro de téléphone");
    } catch (error) {
      console.error("❌ Erreur de liaison :", error.message);
      sock.end(error);
      if (!rl.closed) rl.close();
    }
  }

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
      }
    }
  });
}

startBot().catch(error => {
  console.error("Erreur de démarrage :", error.message);
  if (!rl.closed) rl.close();
});
