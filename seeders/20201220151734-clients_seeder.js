'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('clients', [
      {
        dni: '71203064',
        name: 'Blanca',
        lastname: 'Jimenez',
        advisorId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        dni: '71203065',
        name: 'Juan',
        lastname: 'Jimenez 2',
        advisorId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('clients', null, {});
  },
};
