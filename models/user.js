const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          required: true,
          ref: "Product",
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
  },
});

userSchema.methods.addToCart = function (product) {
  const productExistsIndex = this.cart.items.findIndex((p) => {
    return p.productId.toString() === product._id.toString();
  });

  let newQuantity = 1;
  const updatedCartItems = [...this.cart.items];

  if (productExistsIndex >= 0) {
    newQuantity = this.cart.items[productExistsIndex].quantity + 1;
    updatedCartItems[productExistsIndex].quantity = newQuantity;
  } else {
    updatedCartItems.push({
      productId: product._id,
      quantity: newQuantity,
    });
  }
  const updatedCart = {
    items: updatedCartItems,
  };

  this.cart = updatedCart;
  this.save();
};

userSchema.methods.deleteCartItem = function (productId) {
  const updatedCartitems = this.cart.items.filter((i) => {
    return i.productId.toString() !== productId.toString();
  });
  this.cart = { items: updatedCartitems };
  return this.save();
};

userSchema.methods.clearCart = function () {
  this.cart = { items: [] };
  return this.save();
};

module.exports = mongoose.model("User", userSchema);

//##########mongodb model##############
// const mongodb = require("mongodb");

// const getDb = require("../util/database");

// class User {
//   constructor(name, email, cart, id) {
//     (this.email = email),
//       (this.name = name),
//       (this.cart = cart), //item:[{productid:,quantity:}]
//       (this._id = id);
//   }

//   save() {
//     const db = getDb.getDb();
//     return db
//       .collection("users")
//       .insertOne(this)
//       .then(() => {
//         console.log("user inserted");
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }

//   addToCart(product) {
//     const productExistsIndex = this.cart.items.findIndex((p) => {
//       return p.productId.toString() === product._id.toString();
//     });

//     let newQuantity = 1;
//     const updatedCartItems = [...this.cart.items];

//     if (productExistsIndex >= 0) {
//       newQuantity = this.cart.items[productExistsIndex].quantity + 1;
//       updatedCartItems[productExistsIndex].quantity = newQuantity;
//     } else {
//       updatedCartItems.push({
//         productId: new mongodb.ObjectID(product._id),
//         quantity: newQuantity,
//       });
//     }
//     const db = getDb.getDb();

//     const updatedCart = {
//       items: updatedCartItems,
//     };

//     return db
//       .collection("users")
//       .updateOne(
//         { _id: new mongodb.ObjectID(this._id) },
//         { $set: { cart: updatedCart } }
//       );
//   }

//   getCartData() {
//     const db = getDb.getDb();
//     const productIds = this.cart.items.map((p) => {
//       return p.productId;
//     });
//     return db
//       .collection("product")
//       .find({ _id: { $in: productIds } })
//       .toArray()
//       .then((products) => {
//         const product = products.map((p) => {
//           return {
//             ...p,
//             quantity: this.cart.items.find(
//               (i) => i.productId.toString() === p._id.toString()
//             ).quantity,
//           };
//         });

//         return product;
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }

//   deleteCartItem(productId) {
//     const db = getDb.getDb();

//     const updatedCartitems = this.cart.items.filter(
//       (i) => i.productId.toString() !== productId
//     );

//     return db
//       .collection("users")
//       .updateOne(
//         { _id: new mongodb.ObjectID(this._id) },
//         { $set: { cart: { items: updatedCartitems } } }
//       )
//       .then((result) => {
//         console.log("deleted");
//         return result;
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }

//   addOrders() {
//     const db = getDb.getDb();
//     return this.getCartData()
//       .then((products) => {
//         const orders = {
//           items: [...products],
//           user: { _id: new mongodb.ObjectID(this._id), name: this.name },
//         };
//         return db.collection("orders").insertOne(orders);
//       })
//       .then((result) => {
//         this.cart = { items: [] };
//         return db
//           .collection("users")
//           .updateOne(
//             { _id: new mongodb.ObjectID(this._id) },
//             { $set: { cart: this.cart } }
//           );
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }

//   getOrders(userId) {
//     const db = getDb.getDb();
//     return db
//       .collection("orders")
//       .find({ "user._id": new mongodb.ObjectID(this._id) })
//       .toArray()
//       .then((orders) => {
//         console.log(orders);
//         return orders;
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }

//   static findById(userId) {
//     const db = getDb.getDb();
//     return db
//       .collection("users")
//       .findOne({ _id: new mongodb.ObjectID(userId) })
//       .then((user) => {
//         return user;
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }
// }

// module.exports = User;
//########sequelizeUSer############
// const Sequelize = require("sequelize").Sequelize;

// const sequelize = require("../util/database");

// const User = sequelize.define("user", {
//   id: {
//     type: Sequelize.INTEGER,
//     allowNull: false,
//     autoIncrement: true,
//     primaryKey: true,
//   },
//   name: {
//     type: Sequelize.STRING,
//     allowNull: false,
//   },
//   email: {
//     type: Sequelize.STRING,
//     allowNull: false,
//   },
// });

// module.exports = User;
