const Sequelize = require("sequelize");
const sequelize = require("../database/connection");
const bcrypt = require("bcrypt");

const validRoles = ["SUPERADMIN", "ADMIN", "USER"];

const model = sequelize.define(
  "users",
  {
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
      defaultValue: "USER",
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
  },
  {
    hooks: {
      beforeCreate: async function (user) {
        user.email = user.email.toLowerCase();
        //encrypt
        user.password = await hashPassword(user.password);
        return user;
      },
      beforeSave: async function (user) {
        if (user.updatePassword) {
          user.password = await hashPassword(user.password);
        }
        return user;
      },
    },
  }
);

model.populates = [];

model.addScope("populate", {});

async function hashPassword(password) {
  return new Promise((resolve, reject) => {
    bcrypt.hash(
      password,
      parseInt(process.env.SALTROUNDS),
      function (err, hash) {
        if (err) reject(err);
        resolve(hash);
      }
    );
  });
}

model.prototype.comparePassword = function (passwordAttempt, cb) {
  bcrypt.compare(passwordAttempt, this.password, (err, isMatch) =>
    err ? cb(err) : cb(null, isMatch)
  );
};

module.exports = model;
