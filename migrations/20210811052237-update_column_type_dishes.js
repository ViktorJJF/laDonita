"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.changeColumn("dishes", "price", {
      type: Sequelize.FLOAT,
    });
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.changeColumn("dishes", "price", {
      type: Sequelize.INTEGER,
    });
  },
};
