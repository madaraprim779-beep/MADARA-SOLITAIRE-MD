
async function menuCommand(sock, jid) {
  const menu = `
╭━━━〔 🔥 MADARA SOLITAIRE MD 〕━━━╮
┃
┃ 👑 OWNER : MADARA SOLITAIRE
┃ 🤖 VERSION : 1.0.0
┃
┃ 🤖 GÉNÉRAL
┃ • .menu
┃ • .ping
┃ • .alive
┃ • .owner
┃ • .botinfo
┃ • .runtime
┃
┃ 🛡️ PROTECTION
┃ • .antcall on
┃ • .antcall off
┃ • .antcall status
┃ • .antilink on/off
┃ • .antispam on/off
┃ • .antiflood on/off
┃
┃ 👥 GROUPE
┃ • .groupinfo
┃ • .admins
┃ • .members
┃ • .tagall
┃ • .add
┃ • .kick
┃ • .promote
┃ • .demote
┃ • .warn
┃ • .mute
┃
┃ 🎨 MÉDIAS
┃ • .sticker
┃ • .toimg
┃ • .togif
┃ • .toaudio
┃
┃ 🎮 FUN
┃ • .joke
┃ • .meme
┃ • .quiz
┃ • .dice
┃ • .8ball
┃
┃ 👑 OWNER
┃ • .block
┃ • .unblock
┃ • .broadcast
┃ • .restart
┃ • .pair
┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━╯
`;

  await sock.sendMessage(jid, { text: menu });
}

module.exports = { menuCommand };
