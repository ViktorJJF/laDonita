"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.createTable("investments", {
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
      qty: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      purchasePrice: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      date: {
        type: Sequelize.DATE,
        defaultValue: new Date(),
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
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.dropTable("investments");
  },
};
