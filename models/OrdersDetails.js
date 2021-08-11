const Sequelize = require("sequelize");
const sequelize = require("../database/connection");
const Dishes = require("./Dishes");
const Orders = require("./Orders");

const model = sequelize.define("orders_details", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  orderId: {
    type: Sequelize.INTEGER,
    references: {
      model: "orders",
      key: "id",
    },
    onUpdate: "cascade",
    onDelete: "cascade",
  },
  dishId: {
    type: Sequelize.INTEGER,
    references: {
      model: "dishes",
      key: "id",
    },
    onUpdate: "cascade",
    onDelete: "cascade",
  },
  salePrice: {
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

model.populates = [Dishes];

model.addScope("populate", {
  include: [...model.populates.map((el) => ({ model: el }))],
});

model.belongsTo(Orders);
Orders.hasMany(model);
model.belongsTo(Dishes);
Dishes.hasMany(model);

module.exports = model;
