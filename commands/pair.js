const {
  isJidUser
} = require("@whiskeysockets/baileys");

async function pairCommand(sock, jid, args = []) {
  const phone = String(args[0] || "").replace(/\D/g, "");

  if (!phone) {
    return sock.sendMessage(jid, {
      text:
        "╭━━〔 🔗 MADARA SOLITAIRE MD 〕━━╮\n" +
        "┃ Pour générer le code de liaison :\n" +
        "┃ .pair NUMERO_INTERNATIONAL\n" +
        "┃ Exemple : .pair 225XXXXXXXXXX\n" +
        "┃ Remplace X par ton numéro.\n" +
        "╰━━━━━━━━━━━━━━━━━━━━━━━━━━╯"
    });
  }

  if (phone.length < 8 || phone.length > 15) {
    return sock.sendMessage(jid, {
      text: "❌ Numéro invalide. Utilise le format international sans + ni espaces."
    });
  }

  try {
    if (sock.authState.creds.registered) {
      return sock.sendMessage(jid, {
        text: "✅ Ce bot est déjà lié à un compte WhatsApp."
      });
    }

    const code = await sock.requestPairingCode(phone);

    return sock.sendMessage(jid, {
      text:
        "╭━━〔 🔗 MADARA SOLITAIRE MD 〕━━╮\n" +
        "┃ CODE DE LIAISON\n" +
        "┃\n" +
        "┃ " + code + "\n" +
        "┃\n" +
        "┃ Sur ton WhatsApp :\n" +
        "┃ Appareils connectés\n" +
        "┃ → Connecter un appareil\n" +
        "┃ → Connecter avec un numéro\n" +
        "╰━━━━━━━━━━━━━━━━━━━━━━━━━━╯"
    });
  } catch (error) {
    console.error("Erreur pairing :", error);

    return sock.sendMessage(jid, {
      text: "❌ Impossible de générer le code. Vérifie que le bot est démarré et réessaie."
    });
  }
}

module.exports = { pairCommand };