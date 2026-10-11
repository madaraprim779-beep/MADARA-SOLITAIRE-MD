
cat > index.js <<'EOF'
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
      "Numéro WhatsApp avec indicatif, sans + ni espaces : ",
      (answer) => resolve(answer.replace(/\D/g, ""))
    );
  });
}

let restarting = false;

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
      console.log("MADARA SOLITAIRE MD est connecté à WhatsApp !");
      if (!rl.closed) rl.close();
    }

    if (connection === "close" && !restarting) {
      const code = lastDisconnect?.error?.output?.statusCode;

      if (code !== DisconnectReason.loggedOut) {
        restarting = true;
        console.log("Connexion interrompue. Nouvelle tentative...");
        setTimeout(() => {
          restarting = false;
          startBot().catch(console.error);
        }, 3000);
      } else {
        console.log("Session déconnectée. Relance la liaison WhatsApp.");
        if (!rl.closed) rl.close();
      }
    }
  });

  if (!state.creds.registered) {
    try {
      const code = await sock.requestPairingCode(phone);
      console.log("\n================================");
      console.log(" MADARA SOLITAIRE MD");
      console.log(" CODE DE LIAISON : " + code);
      console.log("================================\n");
      console.log("WhatsApp > Appareils connectés");
      console.log("> Connecter un appareil");
      console.log("> Connexion avec numéro de téléphone");
    } catch (error) {
      console.error("Erreur de liaison :", error.message);
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
        console.error("Erreur commande :", error.message);
        await sock.sendMessage(jid, {
          text: "Une erreur est survenue. Réessaie."
        });
      }
    }
  });
}

startBot().catch((error) => {
  console.error("Erreur de démarrage :", error);
  if (!rl.closed) rl.close();
});
EOF
