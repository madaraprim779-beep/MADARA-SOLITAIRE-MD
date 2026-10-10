
async function aliveCommand(sock, jid) {
  const message = `
╭━━━〔 🔥 MADARA SOLITAIRE MD 〕━━━╮
┃
┃ ✅ STATUT : EN LIGNE
┃ 🤖 BOT : MADARA SOLITAIRE MD
┃ 👑 OWNER : MADARA SOLITAIRE
┃ ⚡ Système : WhatsApp
┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
`;

  await sock.sendMessage(jid, { text: message });
}

module.exports = { aliveCommand };
