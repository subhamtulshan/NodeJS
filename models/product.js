const Sequelize = require("sequelize").Sequelize;

const sequelize = require("../util/database");

const Product = sequelize.define("product", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  imageUrl: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  description: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  price: {
    type: Sequelize.DOUBLE,
    allowNull: false,
  },
});

module.exports = Product;

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
