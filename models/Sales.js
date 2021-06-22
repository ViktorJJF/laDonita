const Sequelize = require("sequelize");
const sequelize = require("../database/connection");

const model = sequelize.define("sales", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  history: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  date: {
    type: Sequelize.DATE,
    defaultValue: new Date(),
  },
  userId: {
    type: Sequelize.INTEGER,
    references: {
      model: "users",
      key: "id",
    },
    onUpdate: "cascade",
    onDelete: "cascade",
  },
  status: {
    type: Sequelize.BOOLEAN,
    defaultValue: true,
  },
});

model.populates = [];

model.addScope("populate", {
  include: [],
});

module.exports = model;
