const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config")[env];
const { Sequelize } = require("sequelize");
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect,
    pool: {
      max: 5,
      min: 0,
      require: 30000,
      idle: 10000,
    },
    logging: false,
  }
);
sequelize.sync({ force: true });
module.exports = sequelize;
global.sequelize = sequelize;
