'use strict';

const { query } = require('express');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.createTable('clients', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      dni: Sequelize.STRING(10),
      name: Sequelize.STRING(30),
      lastname: Sequelize.STRING(40),
      initService: Sequelize.DATE,
      endService: Sequelize.DATE,
      extension: Sequelize.BOOLEAN,
      extensionDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      advisorId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'advisors',
          key: 'id',
        },
        onUpdate: 'cascade',
        onDelete: 'cascade',
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
    queryInterface.dropTable('clients');
  },
};
