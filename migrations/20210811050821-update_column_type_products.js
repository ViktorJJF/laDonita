"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn("products", "price", {
        type: Sequelize.FLOAT,
      }),
      queryInterface.changeColumn("products", "purchasePrice", {
        type: Sequelize.FLOAT,
      }),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn("products", "price", {
        type: Sequelize.INTEGER,
      }),
      queryInterface.changeColumn("products", "purchasePrice", {
        type: Sequelize.INTEGER,
      }),
    ]);
  },
};
