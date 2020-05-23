const Product = require("../models/product");
const { validationResult } = require("express-validator/check");

exports.getAddProducts = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "admin/add-product",
    editing: false,
    hasError: false,
    errorMessage: undefined,
    isAuthenticated: req.session.isLoggedin,
  });
};

exports.postAddProducts = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const userId = req.user._id;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "admin/add-product",
      editing: false,
      hasError: true,
      errorMessage: errors.array()[0].msg,
      product: {
        title: title,
        imageUrl: imageUrl,
        price: price,
        description: description,
      },
    });
  }
  const product = new Product({
    title: title,
    price: price,
    imageUrl: imageUrl,
    description: description,
    userId: userId,
  });
  product
    .save(this)
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
  // req.user
  //   .createProduct({
  //     title: title,
  //     imageUrl: imageUrl,
  //     description: description,
  //     price: price,
  //   })
  //   .then(() => {
  //     res.redirect("/");
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
};

exports.getEditProducts = (req, res, next) => {
  const edit = req.query.edit;
  if (!edit) {
    res.redirect("/");
  }
  const productId = req.params.productId;

  Product.findById(productId)
    .then((product) => {
      if (!product) res.redirect("/");
      res.render("admin/edit-product", {
        pageTitle: "Add Product",
        path: "admin/add-product",
        editing: true,
        hasError: false,
        product: product,
        errorMessage: undefined,
        _id: productId,
        isAuthenticated: req.session.isLoggedin,
      });
    })
    .catch((err) => {
      console.log(err);
    });

  // const product = Product.findByID(productId, (product) => {
  //   if (!product) res.redirect("/");
  //   res.render("admin/edit-product", {
  //     pageTitle: "Add Product",
  //     path: "admin/add-product",
  //     editing: true,
  //     product: product,
  //   });
  // });

  // req.user
  //   .getProducts({ where: { id: productId } })
  //   .then((product) => {
  //     if (!product) res.redirect("/");
  //     res.render("admin/edit-product", {
  //       pageTitle: "Add Product",
  //       path: "admin/add-product",
  //       editing: true,
  //       product: product[0],
  //     });
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
};

exports.postEditProducts = (req, res, next) => {
  const id = req.body.productId;
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  // const userId = req.user._id;
  // const product = new Product(title, price, imageUrl, description, id, userId);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "admin/add-product",
      editing: true,
      hasError: true,
      errorMessage: errors.array()[0].msg,
      product: {
        title: title,
        imageUrl: imageUrl,
        price: price,
        description: description,
      },
    });
  }

  Product.findById(id)
    .then((product) => {
      if (product.userId.toString() !== req.user._id.toString()) {
        return res.redirect("/");
      }
      product.title = title;
      product.price = price;
      product.imageUrl = imageUrl;
      product.description = description;
      return product.save().then(() => {
        res.redirect("/");
        console.log("Updated Product");
      });
    })
    .catch((err) => {
      console.log(err);
    });
  // Product.findByPk(id)
  //   .then((product) => {
  //     product.title = title;
  //     product.imageUrl = imageUrl;
  //     product.description = description;
  //     product.price = price;
  //     return product.save();
  //   })
  //   .then(() => {
  //     res.redirect("/");
  //     console.log("Updated Product");
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
};

exports.getProducts = (req, res, next) => {
  Product.find({ userId: req.user._id })
    .then((products) => {
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/product",
        isAuthenticated: req.session.isLoggedin,
      });
    })
    .catch((err) => {
      console.log(err);
    });

  // Product.fetchAll((products) => {
  //   res.render("admin/products", {
  //     prods: products,
  //     pageTitle: "Admin Products",
  //     path: "/admin/product",
  //   });
  // });
  // req.user
  //   .getProducts()
  //   .then((products) => {
  //     res.render("admin/products", {
  //       prods: products,
  //       pageTitle: "Admin Products",
  //       path: "/admin/product",
  //     });
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
};

exports.postDeleteProducts = (req, res, next) => {
  const productId = req.body.productId;
  Product.deleteOne({ _id: productId, userId: req.user._id })
    .then(() => {
      res.redirect("/admin/products");
      console.log("Product deleted");
    })
    .catch((err) => {
      console.log(err);
    });
  // Product.deleteById(productId);
  // res.redirect("/admin/products");
  // Product.findByPk(productId)
  //   .then((product) => {
  //     return product.destroy();
  //   })
  //   .then(() => {
  //     res.redirect("/admin/products");
  //     console.log("Product Updated");
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
};
