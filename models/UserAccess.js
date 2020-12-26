const Sequelize = require('sequelize');
const sequelize = require('../database/connection');

const userAccessModel = sequelize.define('user_accesses', {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  email: {
    type: Sequelize.STRING(50),
    allowNull: false,
  },
  ip: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  browser: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  country: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  createdAt: Sequelize.DATE,
  updatedAt: Sequelize.DATE,
});

module.exports = userAccessModel;
