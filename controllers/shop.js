const Product = require("../models/product");
const Cart = require("../models/cart");

exports.getProduct = (req, res, next) => {
  Product.fetchAll()
    .then(([rows, filecontent]) => {
      res.render("shop/product-list", {
        prods: rows,
        pageTitle: "Shop",
        path: "/products",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll()
    .then(([rows, filecontent]) => {
      res.render("shop/index", {
        prods: rows,
        pageTitle: "Index",
        path: "/",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
exports.getCart = (req, res, next) => {
  Cart.getCartData((CartData) => {
    Product.fetchAll((product) => {
      const UpdatedCartData = [];
      product.forEach((p) => {
        const cartProduct = CartData.products.find((c) => c.id === p.id);
        if (cartProduct) {
          UpdatedCartData.push({ productData: p, qty: cartProduct.qty });
        }
      });
      console.log(UpdatedCartData);
      res.render("shop/cart", {
        products: UpdatedCartData,
        pageTitle: "Your Cart",
        path: "/cart",
      });
    });
  });
};

exports.postCart = (req, res, next) => {
  const productId = req.body.productId;
  Product.findByID(productId, (product) => {
    Cart.addProduct(productId, product.price);
  });
  res.redirect("/cart");
};
exports.getCheckout = (req, res, next) => {
  Product.fetchAll()
    .then(([rows, filecontent]) => {
      res.render("shop/checkout", {
        prods: rows,
        pageTitle: "Checkout",
        path: "/checkout",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getOrders = (req, res, next) => {
  Product.fetchAll()
    .then(([rows, filecontent]) => {
      res.render("shop/orders", {
        prods: rows,
        pageTitle: "Your Orders",
        path: "/orders",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
exports.getProductById = (req, res, next) => {
  const id = req.params.productId;
  console.log(id);
  Product.findByID(id)
    .then(([product]) => {
      res.render("shop/product-detail", {
        product: product[0],
        pageTitle: product.title,
        path: "/products",
      });
    })
    .catch(() => {});
};
exports.postDeleteCartProduct = (req, res, next) => {
  const id = req.body.productId;
  const product = Product.findByID(id, (product) => {
    Cart.deleteProduct(id, product.price);
    res.redirect("/");
  });
};
