const Product = require("../models/product");
// const Cart = require("../models/cart");

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

  Product.fetchAll()
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "Shop",
        path: "/products",
      });
    })
    .catch((err) => {
      console.log(err);
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
  Product.fetchAll()
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Index",
        path: "/",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
exports.getCart = (req, res, next) => {
  req.user
    .getCartData()
    .then((products) => {
      res.render("shop/cart", {
        products: products,
        pageTitle: "Your Cart",
        path: "/cart",
      });
    })
    .catch((err) => {
      console.log(err);
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
      console.log(err);
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
  req.user
    .getOrders()
    .then((orders) => {
      res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Your Orders",
        orders: orders,
      });
    })
    .catch((err) => console.log(err));
};

exports.postOrders = (req, res, next) => {
  req.user
    .addOrders()
    .then(() => {
      res.redirect("/orders");
    })
    .catch((err) => {
      console.log(err);
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
      });
    })
    .catch(() => {});
};

exports.postDeleteCartProduct = (req, res, next) => {
  const id = req.body.productId;
  req.user
    .deleteCartItem(id)
    .then((result) => {
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
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
