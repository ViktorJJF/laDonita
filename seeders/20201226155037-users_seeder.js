'use strict';
const bcrypt = require('bcrypt');

async function hashPassword(password) {
  return new Promise((resolve, reject) => {
    bcrypt.hash(
      password,
      parseInt(process.env.SALTROUNDS),
      function (err, hash) {
        if (err) reject(err);
        resolve(hash);
      },
    );
  });
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('users', [
      {
        first_name: 'Víctor',
        last_name: 'Jimenez',
        password: await hashPassword('123456'),
        email: 'vj@gmail.com',
        role: 'SUPERADMIN',
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', null, {});
  },
};
