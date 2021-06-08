const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection");
const Brands = require("./Brands");

const model = sequelize.define("products", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(200),
    unique: true,
    allowNull: false,
  },
  img: {
    type: DataTypes.STRING(200),
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: "Users",
      key: "id",
    },
    onUpdate: "cascade",
    onDelete: "cascade",
  },
  brandId: {
    type: DataTypes.INTEGER,
    references: {
      model: "Brands",
      key: "id",
    },
    onUpdate: "cascade",
    onDelete: "cascade",
  },
  stock: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  minStock: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  purchasePrice: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  minStock: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  price: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  description: DataTypes.TEXT,
  status: {
    type: DataTypes.BOOLEAN,
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
