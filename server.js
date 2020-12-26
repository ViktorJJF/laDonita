require('dotenv-safe').config();
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

let port = 3000;

//axios
const axios = require('axios');
if (process.env.NODE_ENV === 'development') {
  axios.defaults.baseURL = 'http://localhost:' + port;
} else {
  axios.defaults.baseURL = 'https://usmp.jfbots.com';
}

// Enable only in development HTTP request logger middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.static(__dirname + '/public'));

app.use(cors());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use('/api', require('./routes/api/index.js'));

app.post('/webhook', express.json(), async function (req, res) {
  let bot = new Bot(req, res);
  await myBot(bot);
  bot.res.json(bot.fulfillmentMessages);
  // delete require.cache[require.resolve("./miBot.js")];
  // require("./miBot.js");
});

//Handle SPA
app.get(/.*/, (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.listen(port, () => {
  console.log('Estamos ejecutando el servidor en el puerto ' + port);
});
