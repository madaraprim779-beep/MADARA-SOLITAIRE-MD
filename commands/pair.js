
async function pairCommand(sock, jid) {
  await sock.sendMessage(jid, {
    text:
      "╭━━━〔 🔗 MADARA SOLITAIRE MD 〕━━━╮\n" +
      "┃\n" +
      "┃ 🔐 LIAISON WHATSAPP\n" +
      "┃\n" +
      "┃ La génération du code de liaison\n" +
      "┃ n'est pas encore activée.\n" +
      "┃\n" +
      "┃ Envoie .pair uniquement lorsque\n" +
      "┃ le service de liaison est prêt.\n" +
      "┃\n" +
      "╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯"
  });
}

module.exports = { pairCommand };
