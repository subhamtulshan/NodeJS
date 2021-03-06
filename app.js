const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const mongoSessionStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const flash = require("connect-flash");
const multer = require("multer");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");
const rootDir = require("./util/path");
const errorController = require("./controllers/error");
// const sequelize = require("./util/database");
// const Product = require("./models/product");
const User = require("./models/user");
// const Cart = require("./models/cart");
// const cartItem = require("./models/cartItem");
// const Order = require("./models/order");
// const orderItem = require("./models/orderItem");
// const mongoConnect = require("./util/database");

const app = express();
const store = new mongoSessionStore({
  uri: "mongodb+srv://Subham:subham@123@cluster0-bwsd5.mongodb.net/shop",
  collection: "sessions",
});

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype == "image/png" ||
    file.mimetype == "image/jpg" ||
    file.mimetype == "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("imageUrl")
);
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);
app.use(csrf());
app.use(flash());

app.use((req, res, next) => {
  if (!req.session.user) return next();
  User.findById(req.session.user._id)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpsStatusCode = 500;
      return next(error);
    });
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedin;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use("/500", errorController.get500);
app.use(errorController.get404);
app.use((error, req, res, next) => {
  res.status(404).render("500", {
    pageTitle: "Error",
    path: "/500",
    isAuthenticated: req.session.isLoggedin,
  });
});

mongoose
  .connect(
    "mongodb+srv://Subham:subham@123@cluster0-bwsd5.mongodb.net/shop?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });

// Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
// User.hasMany(Product);
// User.hasOne(Cart);
// Cart.belongsTo(User);
// Cart.belongsToMany(Product, { through: cartItem });
// Product.belongsToMany(Cart, { through: cartItem });
// User.hasMany(Order);
// Order.belongsTo(User);
// Order.belongsToMany(Product, { through: orderItem });
// Product.belongsToMany(Order, { through: orderItem });

// sequelize.sync().then(() => {
//   User.findByPk(1)
//     .then((user) => {
//       if (!user) return User.create({ name: "Subham", email: "test@test.com" });
//       else return user;
//     })
//     .then((user) => {
//       user
//         .getCart({ where: { userId: user.id } })
//         .then((cart) => {
//           if (!cart) return user.createCart();
//         })
//         .catch(() => {});
//     })
//     .then(() => {
//       app.listen(3000);
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// });
