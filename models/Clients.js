const Sequelize = require("sequelize");
const sequelize = require("../database/connection");
const Advisor = require("./Advisors");

const ClientModel = sequelize.define("clients", {
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
      model: "advisors",
      key: "id",
    },
    onUpdate: "cascade",
    onDelete: "cascade",
  },
  status: {
    type: Sequelize.BOOLEAN,
    defaultValue: true,
  },
});

ClientModel.addScope("populate", {
  include: [
    {
      model: Advisor,
    },
  ],
});

// ClientModel.belongsTo(Advisor, { foreignKey: "advisorId", sourceKey: "id" });

module.exports = ClientModel;
