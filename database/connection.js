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
    define: {
      timestamps: true,
    },
    logging: false,
  }
);
// // sequelize.sync({ force: true });

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();

module.exports = sequelize;
global.sequelize = sequelize;
