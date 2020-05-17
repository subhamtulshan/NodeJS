const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key:
        "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",
    },
  })
);

const User = require("../models/user");

exports.getLogin = (req, res, next) => {
  //const isloggedin = req.get("Cookie").split(":")[1];
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/login", {
    pageTitle: "Login",
    path: "/login",
    errorMessage: message,
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        req.flash("error", "Invalid email or password");
        return res.redirect("/login");
      }
      bcrypt.compare(password, user.password).then((doMatch) => {
        if (doMatch) {
          req.session.isLoggedin = true;
          req.session.user = user;
          return req.session.save(() => {
            res.redirect("/");
            transporter
              .sendMail({
                to: "nandithagowda95@gmail.com",
                from: "agarwalrajiv612@gmail.com",
                subject: "your account is created in a locker",
                html: "<h> You be careful now!!!</h>",
              })
              .then(() => {})
              .catch((err) => {
                console.log(err);
              });
          });
        }
        req.flash("error", "Invalid email or password");
        res.redirect("/login");
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

exports.getSignUp = (req, res, next) => {
  res.render("auth/signup", {
    pageTitle: "SignUp",
    path: "/signup",
  });
};

exports.postSignUp = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  User.findOne({ email: email })
    .then((user) => {
      if (user) {
        req.flash("error", "Email already Exists");
        return res.redirect("/login");
      }
      return bcrypt.hash(password, 12).then((hashpassword) => {
        const newUser = new User({
          email: email,
          password: hashpassword,
          name: "defaultforall",
          cart: { items: [] },
        });
        return newUser.save().then(() => {
          res.redirect("/login");
        });
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
