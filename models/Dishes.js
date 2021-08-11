const Sequelize = require("sequelize");
const sequelize = require("../database/connection");

const model = sequelize.define("dishes", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: Sequelize.STRING(300),
    unique: true,
    allowNull: false,
  },
  img: {
    type: Sequelize.STRING(200),
  },
  price: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
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
