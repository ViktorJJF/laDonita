const Sequelize = require("sequelize");
const sequelize = require("../database/connection");

const model = sequelize.define("providers", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: Sequelize.STRING(200),
    unique: true,
    allowNull: false,
  },
  description: Sequelize.TEXT,
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
