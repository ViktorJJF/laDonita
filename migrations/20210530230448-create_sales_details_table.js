"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.createTable("sales_details", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      saleId: {
        type: Sequelize.INTEGER,
        references: {
          model: "sales",
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
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.dropTable("sales_details");
  },
};
