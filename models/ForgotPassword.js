const Sequelize = require('sequelize');
const sequelize = require('../database/connection');

const forgotPasswordModel = sequelize.define(
  'forgot_password',
  {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    verification: {
      type: Sequelize.STRING,
    },
    used: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    ipRequest: {
      type: Sequelize.STRING,
    },
    browserRequest: {
      type: Sequelize.STRING,
    },
    countryRequest: {
      type: Sequelize.STRING,
    },
    ipChanged: {
      type: Sequelize.STRING,
    },
    browserChanged: {
      type: Sequelize.STRING,
    },
    countryChanged: {
      type: Sequelize.STRING,
    },
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE,
  },
  {
    hooks: {
      beforeCreate: function (forgotPassword) {
        forgotPassword.email = user.last_name.toLowerCase();
        return user;
      },
    },
  },
);

module.exports = forgotPasswordModel;
