const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const productSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
});

module.exports = mongoose.model("Product", productSchema);

//###########mongodb models#################3
//const mongodb = require("mongodb");

// const getDb = require("../util/database");

// class Product {
//   constructor(title, price, imageUrl, description, id, userId) {
//     this.title = title;
//     this.imageUrl = imageUrl;
//     this.price = price;
//     this.description = description;
//     this._id = id ? new mongodb.ObjectID(id) : null;
//     this.userId = userId;
//   }

//   save() {
//     const db = getDb.getDb();
//     let odb;
//     if (this._id) {
//       odb = db
//         .collection("product")
//         .updateOne({ _id: this._id }, { $set: this });
//     } else {
//       odb = db.collection("product").insertOne(this);
//     }
//     return odb
//       .then((result) => {
//         console.log(result);
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }

//   static fetchAll() {
//     const db = getDb.getDb();
//     return db
//       .collection("product")
//       .find()
//       .toArray()
//       .then((products) => {
//         console.log(products);
//         return products;
//       })
//       .catch((err) => {
//         console.log(products);
//       });
//   }

//   static findById(prodId) {
//     const db = getDb.getDb();
//     return db
//       .collection("product")
//       .find({ _id: new mongodb.ObjectID(prodId) })
//       .next()
//       .then((products) => {
//         console.log(products);
//         return products;
//       })
//       .catch((err) => {
//         console.log(products);
//       });
//   }

//   static deleteProduct(prodId) {
//     const db = getDb.getDb();
//     return db
//       .collection("product")
//       .remove({ _id: new mongodb.ObjectID(prodId) })
//       .then((products) => {
//         console.log(products);
//       })
//       .catch((err) => {
//         console.log(products);
//       });
//   }
// }

// module.exports = Product;

//############product model with Sequelize##################

// const Sequelize = require("sequelize").Sequelize;

// const sequelize = require("../util/database");

// const Product = sequelize.define("product", {
//   id: {
//     type: Sequelize.INTEGER,
//     allowNull: false,
//     autoIncrement: true,
//     primaryKey: true,
//   },
//   title: {
//     type: Sequelize.STRING,
//     allowNull: false,
//   },
//   imageUrl: {
//     type: Sequelize.STRING,
//     allowNull: false,
//   },
//   description: {
//     type: Sequelize.TEXT,
//     allowNull: false,
//   },
//   price: {
//     type: Sequelize.DOUBLE,
//     allowNull: false,
//   },
// });

// module.exports = Product;

//############product model with FILE##################
// const db = require("../util/database");
// const Cart = require("./cart");

// module.exports = class Product {
//   constructor(id, title, imageUrl, price, description) {
//     this.id = id;
//     this.title = title;
//     this.imageUrl = imageUrl;
//     this.description = description;
//     this.price = price;
//   }
//   save() {
//     return db.execute(
//       "INSERT INTO products(title,imageUrl,description,price) VALUES(?,?,?,?)",
//       [this.title, this.imageUrl, this.description, this.price]
//     );
//   }

//   static fetchAll() {
//     return db.execute("SELECT * FROM products");
//   }

//   static findByID(id) {
//     return db.execute("SELECT * FROM products WHERE id=?", [id]);
//   }

//   static deleteById(id) {}
// };
