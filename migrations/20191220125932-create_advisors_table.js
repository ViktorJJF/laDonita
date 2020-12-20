'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.createTable('advisors', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      dni: Sequelize.STRING(10),
      name: Sequelize.STRING(30),
      lastname: Sequelize.STRING(40),
      cellphone: Sequelize.STRING(15),
      email: Sequelize.STRING(15),
      titulos: Sequelize.STRING(500),
      maestrias: Sequelize.STRING(500),
      doctorados: Sequelize.STRING(500),
      renacyt: Sequelize.BOOLEAN,
      registerDate: Sequelize.DATE,
      inactiveDate: Sequelize.DATE,
      status: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.dropTable('advisors');
  },
};
