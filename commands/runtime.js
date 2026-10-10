
const startedAt = Date.now();

function formatDuration(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${days}j ${hours}h ${minutes}m ${seconds}s`;
}

async function runtimeCommand(sock, jid) {
  const duration = formatDuration(Date.now() - startedAt);

  await sock.sendMessage(jid, {
    text:
      `╭━━━〔 ⏱️ RUNTIME 〕━━━╮\n` +
      `┃ 🤖 MADARA SOLITAIRE MD\n` +
      `┃ ⏳ Durée : ${duration}\n` +
      `╰━━━━━━━━━━━━━━━━━━╯`
  });
}

module.exports = { runtimeCommand };
