"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.createTable("products", {
      id: {
        type: Sequelize.BIGINT,
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
          model: "Users",
          key: "id",
        },
        onUpdate: "cascade",
        onDelete: "cascade",
      },
      brandId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Brands",
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
      status: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.dropTable("products");
  },
};
