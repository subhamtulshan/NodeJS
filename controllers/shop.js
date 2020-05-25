const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");

const Product = require("../models/product");
const Order = require("../models/order");

exports.getProduct = (req, res, next) => {
  // Product.fetchAll()
  //   .then(([rows, filecontent]) => {
  //     res.render("shop/product-list", {
  //       prods: rows,
  //       pageTitle: "Shop",
  //       path: "/products",
  //     });
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });

  Product.find()
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "Shop",
        path: "/products",
        isAuthenticated: req.session.isLoggedin,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpsStatusCode = 500;
      return next(error);
    });
};

exports.getIndex = (req, res, next) => {
  // Product.fetchAll()
  //   .then(([rows, filecontent]) => {
  //     res.render("shop/index", {
  //       prods: rows,
  //       pageTitle: "Index",
  //       path: "/",
  //     });
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
  Product.find()
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Index",
        path: "/",
        isAuthenticated: req.session.isLoggedin,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpsStatusCode = 500;
      return next(error);
    });
};
exports.getCart = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .execPopulate()
    .then((products) => {
      products = products.cart.items;
      res.render("shop/cart", {
        products: products,
        pageTitle: "Your Cart",
        path: "/cart",
        isAuthenticated: req.session.isLoggedin,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpsStatusCode = 500;
      return next(error);
    });

  // req.user
  //   .getCart()
  //   .then((cart) => {
  //     console.log(cart);
  //     return cart.getProducts();
  //   })
  //   .then((products) => {
  //     res.render("shop/cart", {
  //       products: products,
  //       pageTitle: "Your Cart",
  //       path: "/cart",
  //     });
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });

  // Cart.getCartData((CartData) => {
  //   Product.fetchAll((product) => {
  //     const UpdatedCartData = [];
  //     product.forEach((p) => {
  //       const cartProduct = CartData.products.find((c) => c.id === p.id);
  //       if (cartProduct) {
  //         UpdatedCartData.push({ productData: p, qty: cartProduct.qty });
  //       }
  //     });
  //     console.log(UpdatedCartData);
  //     res.render("shop/cart", {
  //       products: UpdatedCartData,
  //       pageTitle: "Your Cart",
  //       path: "/cart",
  //     });
  //   });
  // });
};

exports.postCart = (req, res, next) => {
  const productId = req.body.productId;

  Product.findById(productId)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpsStatusCode = 500;
      return next(error);
    });

  // const productId = req.body.productId;
  // let fetchedCart;
  // let newQuantity = 1;
  // req.user
  //   .getCart()
  //   .then((cart) => {
  //     fetchedCart = cart;
  //     return cart.getProducts({ where: { id: productId } });
  //   })
  //   .then((products) => {
  //     if (products.length > 0) {
  //       const product = products[0];
  //       const oldQuantity = product.cartItem.quantity;
  //       newQuantity = oldQuantity + 1;
  //       return product;
  //     } else {
  //       return Product.findByPk(productId);
  //     }
  //   })
  //   .then((product) => {
  //     return fetchedCart.addProduct(product, {
  //       through: { quantity: newQuantity },
  //     });
  //   })
  //   .then(() => {
  //     res.redirect("/cart");
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });

  // Product.findByID(productId, (product) => {
  //   Cart.addProduct(productId, product.price);
  // });
  // res.redirect("/cart");
};

// exports.getCheckout = (req, res, next) => {
//   Product.fetchAll()
//     .then(([rows, filecontent]) => {
//       res.render("shop/checkout", {
//         prods: rows,
//         pageTitle: "Checkout",
//         path: "/checkout",
//       });
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// };

exports.getOrders = (req, res, next) => {
  Order.find({ "User.userId": req.user._id })
    .then((orders) => {
      res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Your Orders",
        orders: orders,
        isAuthenticated: req.session.isLoggedin,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpsStatusCode = 500;
      return next(error);
    });
};

exports.postOrders = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .execPopulate()
    .then((products) => {
      const product = products.cart.items.map((i) => {
        return { product: { ...i.productId }, quantity: i.quantity };
      });
      const order = new Order({
        User: {
          name: req.user.name,
          userId: req.user._id,
        },
        products: product,
      });
      return order.save();
    })
    .then(() => {
      return req.user.clearCart();
    })
    .then(() => {
      res.redirect("/orders");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpsStatusCode = 500;
      return next(error);
    });
  // let fetchedCart;
  // req.user
  //   .getCart()
  //   .then((cart) => {
  //     fetchedCart = cart;
  //     return cart.getProducts();
  //   })
  //   .then((products) => {
  //     return req.user
  //       .createOrder()
  //       .then((order) => {
  //         return order.addProducts(
  //           products.map((product) => {
  //             product.orderItem = { quantity: product.cartItem.quantity };
  //             return product;
  //           })
  //         );
  //       })
  //       .catch((err) => console.log(err));
  //   })
  //   .then((result) => {
  //     return fetchedCart.setProducts(null);
  //   })
  //   .then((result) => {
  //     res.redirect("/orders");
  //   })
  //   .catch((err) => console.log(err));
};

exports.getProductById = (req, res, next) => {
  const id = req.params.productId;
  // Product.findByID(id)
  //   .then(([product]) => {
  //     res.render("shop/product-detail", {
  //       product: product[0],
  //       pageTitle: product.title,
  //       path: "/products",
  //     });
  //   })
  //   .catch(() => {});

  Product.findById(id)
    .then((product) => {
      res.render("shop/product-detail", {
        product: product,
        pageTitle: product.title,
        path: "/products",
        isAuthenticated: req.session.isLoggedin,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpsStatusCode = 500;
      return next(error);
    });
};

exports.postDeleteCartProduct = (req, res, next) => {
  const id = req.body.productId;
  return req.user
    .deleteCartItem(id)
    .then((result) => {
      res.redirect("/");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpsStatusCode = 500;
      return next(error);
    });

  //   req.user
  //     .getCart()
  //     .then((cart) => {
  //       return cart.getProducts({ where: { id: id } });
  //     })
  //     .then((products) => {
  //       products[0].cartItem.destroy();
  //       res.redirect("/");
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });

  //   // const product = Product.findByID(id, (product) => {
  //   //   Cart.deleteProduct(id, product.price);
  //   //   res.redirect("/");
  //   // });
};

exports.getInvoice = (req, res, next) => {
  const orderId = req.params.orderId;
  Order.findById(orderId)
    .then((order) => {
      if (order.User.userId.toString() !== req.user._id.toString()) {
        return next(new Error("You are not Authorized to see the invoice"));
      }
      const invoiceName = "invoice-" + orderId + ".pdf";
      const invoicePath = path.join("data", "invoices", invoiceName);
      const pdfDoc = new PDFDocument();
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        'inline; filename="' + invoiceName + '"'
      );
      pdfDoc.pipe(fs.createWriteStream(invoicePath));
      pdfDoc.pipe(res);

      pdfDoc.fontSize(26).text("Invoice", {
        underline: true,
      });
      pdfDoc.text("-----------------------");
      let totalPrice = 0;
      order.products.forEach((prod) => {
        totalPrice += prod.quantity * prod.product.price;
        pdfDoc
          .fontSize(14)
          .text(
            prod.product.title +
              " - " +
              prod.quantity +
              " x " +
              "$" +
              prod.product.price
          );
      });
      pdfDoc.text("---");
      pdfDoc.fontSize(20).text("Total Price: $" + totalPrice);
      pdfDoc.end();

      //   console.log(invoiceName, invoicePath);
      //   fs.readFile(invoicePath, (err, data) => {
      //     if (err) return next(err);

      //     res.setHeader("Content-Type", "application/pdf");
      //     res.setHeader("Content-Disposition", "inline");
      //     res.send(data);
      //   });
    })
    .catch((err) => {
      return next(err);
    });
};
