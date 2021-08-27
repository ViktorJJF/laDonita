"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.addIndex("products", ["name", "brandId"], { unique: true });
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
