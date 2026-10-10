
async function botinfoCommand(sock, jid) {
  const message = `
╭━━━〔 🔥 BOT INFORMATION 〕━━━╮
┃
┃ 🤖 Nom : MADARA SOLITAIRE MD
┃ 👑 Créateur : MADARA SOLITAIRE
┃ 🏷️ Version : 1.0.0
┃ 💬 Préfixe : .
┃ 📱 Plateforme : WhatsApp
┃ ⚙️ Bibliothèque : Baileys
┃
┃ ✨ Créé pour discuter librement.
┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━╯
`;

  await sock.sendMessage(jid, { text: message });
}

module.exports = { botinfoCommand };
