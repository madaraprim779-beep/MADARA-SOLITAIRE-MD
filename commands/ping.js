
async function pingCommand(sock, jid) {
  const start = Date.now();

  await sock.sendMessage(jid, {
    text: `🏓 *PONG !*\n\n🔥 MADARA SOLITAIRE MD\n⚡ Réponse : ${Date.now() - start} ms\n✅ Statut : opérationnel`
  });
}

module.exports = { pingCommand };
