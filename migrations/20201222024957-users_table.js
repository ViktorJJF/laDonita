'use strict';

const validRoles = ['SUPERADMIN', 'ADMIN', 'USER'];

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.createTable('Users', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      first_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      last_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING(200),
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
      },
      img: Sequelize.STRING,
      phone: {
        type: Sequelize.STRING,
      },
      city: {
        type: Sequelize.STRING,
      },
      country: {
        type: Sequelize.STRING,
      },
      role: {
        type: Sequelize.ENUM,
        values: validRoles,
        defaultValue: 'USER',
      },
      verification: Sequelize.STRING,
      verified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      loginAttempts: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      blockExpires: {
        type: Sequelize.DATE,
        defaultValue: Date.now,
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
    queryInterface.dropTable('Users');
  },
};
