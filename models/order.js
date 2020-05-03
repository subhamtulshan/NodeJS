const Sequelize = require("sequelize").Sequelize;

const sequelize = require("../util/database");

const Order = sequelize.define("Order", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
});

module.exports = Order;
