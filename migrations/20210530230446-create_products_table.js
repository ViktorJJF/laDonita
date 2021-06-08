"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.createTable("products", {
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
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.dropTable("products");
  },
};
