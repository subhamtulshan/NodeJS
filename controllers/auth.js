const User = require("../models/user");

exports.getLogin = (req, res, next) => {
  //const isloggedin = req.get("Cookie").split(":")[1];
  console.log(req.session.isLoggedin);
  res.render("auth/login", {
    pageTitle: "Login",
    path: "/login",
    isAuthenticated: req.session.isLoggedin,
  });
};

exports.postLogin = (req, res, next) => {
  User.findById("5eb80e2c1601869154000a36")
    .then((user) => {
      req.session.isLoggedin = true;
      req.session.user = user;
      req.session.save(() => {
        res.redirect("/");
      });
    })
    .catch((err) => {
      console.log(err);
    });
  // res.setHeader("set-Cookie", "isloggedin:true");
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
};
