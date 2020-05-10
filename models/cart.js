// const Sequelize = require("sequelize").Sequelize;

// const sequelize = require("../util/database");

// const Cart = sequelize.define("cart", {
//   id: {
//     type: Sequelize.INTEGER,
//     allowNull: false,
//     autoIncrement: true,
//     primaryKey: true,
//   },
// });

// module.exports = Cart;

// //#######File############
// // const fs = require("fs");
// // const path = require("path");

// // const p = path.join(
// //   path.dirname(process.mainModule.filename),
// //   "data",
// //   "cart.json"
// // );

// // module.exports = class Cart {
// //   static addProduct(id, price) {
// //     fs.readFile(p, (err, fileContent) => {
// //       let cart = { products: [], totalPrice: 0 };
// //       if (!err) {
// //         cart = JSON.parse(fileContent);
// //       }
// //       const existingProductIndex = cart.products.findIndex((p) => p.id === id);
// //       const existingProduct = cart.products[existingProductIndex];

// //       if (existingProduct) {
// //         const updateProduct = { ...existingProduct };
// //         updateProduct.qty = updateProduct.qty + 1;
// //         cart.products = [...cart.products];
// //         cart.products[existingProductIndex] = updateProduct;
// //       } else {
// //         const newProduct = { id: id, qty: 1 };
// //         cart.products = [...cart.products, newProduct];
// //       }

// //       cart.totalPrice = cart.totalPrice + +price;

// //       fs.writeFile(p, JSON.stringify(cart), (err) => {});
// //     });
// //   }

// //   static deleteProduct(id, price) {
// //     fs.readFile(p, (err, fileContent) => {
// //       const cart = JSON.parse(fileContent);
// //       const product = cart.products.find((p) => p.id === id);
// //       if (!product) return;
// //       const updatedCartProduct = cart.products.filter((p) => p.id !== id);
// //       const totalPrice = cart.totalPrice - product.qty * price;
// //       cart.products = updatedCartProduct;
// //       cart.totalPrice = totalPrice;

// //       fs.writeFile(p, JSON.stringify(cart), (err) => {});
// //     });
// //   }

// //   static getCartData(cb) {
// //     fs.readFile(p, (err, fileContent) => {
// //       if (err) {
// //         cb(null);
// //       } else {
// //         cb(JSON.parse(fileContent));
// //       }
// //     });
// //   }
// // };
