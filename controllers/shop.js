const Product = require("../models/product");
const Cart = require("../models/cart");

exports.getProduct = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("shop/product-list", {
      prods: products,
      pageTitle: "Shop",
      path: "/products",
    });
  });
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("shop/index", {
      prods: products,
      pageTitle: "Index",
      path: "/",
    });
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
  Product.fetchAll((products) => {
    res.render("shop/checkout", {
      prods: products,
      pageTitle: "Checkout",
      path: "/checkout",
    });
  });
};

exports.getOrders = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("shop/orders", {
      prods: products,
      pageTitle: "Your Orders",
      path: "/orders",
    });
  });
};
exports.getProductById = (req, res, next) => {
  const id = req.params.productId;
  console.log("in getPRoductbyid" + id);
  Product.findByID(id, (product) => {
    res.render("shop/product-detail", {
      product: product,
      pageTitle: product.title,
      path: "/products",
    });
  });
};
exports.postDeleteCartProduct = (req, res, next) => {
  const id = req.body.productId;
  const product = Product.findByID(id, (product) => {
    Cart.deleteProduct(id, product.price);
    res.redirect("/");
  });
};
