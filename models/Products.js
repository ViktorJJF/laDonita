const Sequelize = require("sequelize");
const sequelize = require("../database/connection");
const Brands = require("./Brands");

const model = sequelize.define("products", {
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
  img: {
    type: Sequelize.STRING(200),
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
  brandId: {
    type: Sequelize.INTEGER,
    references: {
      model: "brands",
      key: "id",
    },
    onUpdate: "cascade",
    onDelete: "cascade",
  },
  stock: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  },
  minStock: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  },
  purchasePrice: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  },
  minStock: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  },
  price: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  },
  description: Sequelize.TEXT,
  expiration: {
    type: Sequelize.DATE,
  },
  status: {
    type: Sequelize.BOOLEAN,
    defaultValue: true,
  },
});

model.populates = [Brands];

model.addScope("populate", {
  include: [...model.populates.map((el) => ({ model: el }))],
});

model.belongsTo(Brands);
Brands.hasMany(model);

module.exports = model;
