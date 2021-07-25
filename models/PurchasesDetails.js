const Sequelize = require("sequelize");
const sequelize = require("../database/connection");
const Products = require("./Products");
const Purchases = require("./Purchases");

const model = sequelize.define("purchases_details", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  purchaseId: {
    type: Sequelize.INTEGER,
    references: {
      model: "purchases",
      key: "id",
    },
    onUpdate: "cascade",
    onDelete: "cascade",
  },
  productId: {
    type: Sequelize.INTEGER,
    references: {
      model: "products",
      key: "id",
    },
    onUpdate: "cascade",
    onDelete: "cascade",
  },
  purchasePrice: {
    type: Sequelize.FLOAT,
    defaultValue: 0,
  },
  qty: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
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

model.populates = [Products];

model.addScope("populate", {
  include: [...model.populates.map((el) => ({ model: el }))],
});

model.belongsTo(Purchases);
Purchases.hasMany(model);
model.belongsTo(Products);
Products.hasMany(model);

module.exports = model;
