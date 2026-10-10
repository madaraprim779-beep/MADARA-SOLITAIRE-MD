
async function ownerCommand(sock, jid) {
  const message = `
╭━━━〔 👑 OWNER INFO 〕━━━╮
┃
┃ 👑 Nom : MADARA SOLITAIRE
┃ 🤖 Bot : MADARA SOLITAIRE MD
┃ 💬 Préfixe : .
┃ 🌐 Plateforme : WhatsApp
┃
╰━━━━━━━━━━━━━━━━━━━━━━╯
`;

  await sock.sendMessage(jid, { text: message });
}

module.exports = { ownerCommand };
