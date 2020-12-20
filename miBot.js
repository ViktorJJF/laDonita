const axios = require('axios');

async function myBot(bot) {
  let intent = bot.getIntent();
  switch (intent) {
    case 'Default Welcome Intent':
      bot.sendTextMessage('aeaa');
      break;
    case 'Asesores.obtener':
      let dni = bot.getOriginalParameter('dni');
      let clients = (
        await axios.get('/api/clients', {
          params: {
            dni,
          },
        })
      ).data.payload;
      if (clients.length > 0) {
        let client = clients[0];
        bot.sendTextMessage(
          `Bien ${client.name}, según mi información, tu asesor es ${client.advisor.name} ${client.lastname}`,
        );
      } else {
        bot.sendTextMessage(
          `Parce que no tengo ningún estudiante registrado con ese DNI`,
        );
      }
      break;

    default:
      bot.sendTextMessage('creo que no comprendí...');
      break;
  }
}

module.exports = {
  myBot,
};
