const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const mongoSessionStore = require("connect-mongodb-session")(session);

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

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use((req, res, next) => {
  if (!req.session.user) return next();
  User.findById(req.session.user._id)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => {
      console.log(err);
    });
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use(errorController.get404);

mongoose
  .connect(
    "mongodb+srv://Subham:subham@123@cluster0-bwsd5.mongodb.net/shop?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    User.findOne().then((user) => {
      if (!user) {
        const user = new User({
          name: "test",
          email: "test@test.com",
          cart: { items: [] },
        });
        user.save();
      }
      app.listen(3000);
    });
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
