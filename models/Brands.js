const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection");
// const Products = require("./Products");

const model = sequelize.define("brands", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  name: DataTypes.STRING(50),
  description: DataTypes.TEXT,
  status: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  userId: {
    type: DataTypes.INTEGER,
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
