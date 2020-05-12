const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const OrderSchema = new Schema({
  products: [
    {
      product: { type: Object, required: true },
      quantity: { type: Number, required: true },
    },
  ],

  User: {
    name: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  },
});

module.exports = mongoose.model("Order", OrderSchema);
//########### sequelize #################
// const Sequelize = require("sequelize").Sequelize;

// const sequelize = require("../util/database");

// const Order = sequelize.define("Order", {
//   id: {
//     type: Sequelize.INTEGER,
//     allowNull: false,
//     autoIncrement: true,
//     primaryKey: true,
//   },
// });

// module.exports = Order;
