
async function pairCommand(sock, jid, args = []) {
  return sock.sendMessage(jid, {
    text:
      "╭━━〔 🔗 MADARA SOLITAIRE MD 〕━━╮\n" +
      "┃ Le bot utilise la liaison WhatsApp.\n" +
      "┃\n" +
      "┃ Pour la première connexion :\n" +
      "┃ ouvre Termux et démarre le bot.\n" +
      "┃ Le code sera affiché dans Termux.\n" +
      "┃\n" +
      "┃ Cette commande ne génère pas\n" +
      "┃ le code initial depuis WhatsApp.\n" +
      "╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯"
  });
}

module.exports = { pairCommand };
