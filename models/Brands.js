const Sequelize = require("sequelize");
const sequelize = require("../database/connection");
// const Products = require("./Products");

const model = sequelize.define("brands", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  name: Sequelize.STRING(50),
  description: Sequelize.TEXT,
  status: {
    type: Sequelize.BOOLEAN,
    defaultValue: true,
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
});

model.populates = [];

model.addScope("populate", {
  include: [],
});

// model.hasMany(Products);

module.exports = model;
