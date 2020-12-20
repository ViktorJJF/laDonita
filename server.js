const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const app = express();
const bodyParser = require('body-parser');
//classes
const Bot = require('./classes/Bot');
//library
const { myBot } = require('./miBot');
//connection
require('./database/connection');
//relationships
const Client = require('./models/Clients');
const Advisor = require('./models/Advisors');

Advisor.hasMany(Client, { foreignKey: 'advisorId', sourceKey: 'id' });
Client.belongsTo(Advisor, { foreignKey: 'advisorId', sourceKey: 'id' });

// Enable only in development HTTP request logger middleware
// if (process.env.NODE_ENV === 'development') {
app.use(morgan('dev'));
// }

app.use(cors());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use('/api', require('./routes/api/index.js'));

app.post('/webhook', express.json(), function (req, res) {
  console.log('nueva solicitud...');
  let bot = new Bot(req, res);
  myBot(bot);
  bot.res.json(bot.fulfillmentMessages);
  // delete require.cache[require.resolve("./miBot.js")];
  // require("./miBot.js");
});

let port = 3000;
app.listen(port, () => {
  console.log('Estamos ejecutando el servidor en el puerto ' + port);
});
