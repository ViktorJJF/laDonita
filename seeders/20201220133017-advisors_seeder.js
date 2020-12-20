'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('advisors', [
      {
        dni: '71203062',
        name: 'Victor',
        lastname: 'Jimenez',
        cellphone: '983724475',
        email: 'vj.jimenez96@gmail.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        dni: '71203063',
        name: 'Victor 2',
        lastname: 'Jimenez 2',
        cellphone: '983724475',
        email: 'vj.jimenez966@gmail.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('advisors', null, {});
  },
};
