function myBot(bot) {
  let intent = bot.getIntent();
  switch (intent) {
    case 'Default Welcome Intent':
      bot.sendTextMessage('aeaa');
      break;
    case 'USMP.sobre':
      bot.sendTextMessage('sobre la USMP...');
      bot.sendCard('hola', 'que hace');
      break;

    default:
      bot.sendTextMessage('creo que no comprendí...');
      break;
  }
}

module.exports = {
  myBot,
};
