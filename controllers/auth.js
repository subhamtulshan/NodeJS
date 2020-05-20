const bcrypt = require("bcrypt");
const crypto = require("crypto");
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
                to: "subhamtulshan123@gmail.com",
                from: "agarwalrajiv612@gmail.com",
                subject: "your account is created in a locker",
                html: "<h> You are such a lay person Nanditha !!!!!!!!!</h>",
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

exports.getReset = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/reset", {
    pageTitle: "Reset Password",
    path: "/reset",
    errorMessage: message,
  });
};

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect("/reset");
    }
    const token = buffer.toString("hex");
    User.findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          req.flash("error", "No such email exists");
          return res.redirect("/reset");
        }
        user.resetToken = token;
        user.tokenExpiration = Date.now() + 3600000;
        return user.save();
      })
      .then(() => {
        transporter
          .sendMail({
            to: "subhamtulshan123@gmail.com",
            from: "agarwalrajiv612@gmail.com",
            subject: "Reset Password",
            html: `<h1>Reset password</h1>
        <a href="http://localhost:3000/reset/${token}"></a>`,
          })
          .then((result) => {
            console.log(result);
            req.flash("error", "Email is sent to the email");
            res.redirect(`/reset/${token}`);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  });
};

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;
  User.findOne({ resetToken: token, tokenExpiration: { $gt: Date.now() } })
    .then((user) => {
      res.render("auth/newPassword", {
        pageTitle: "Update Password",
        path: "/reset",
        errorMessage: undefined,
        PasswordToken: token,
        userId: user._id.toString(),
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
exports.postNewPassword = (req, res, next) => {
  const token = req.body.PasswordToken;
  const userId = req.body.userId;
  const newPassword = req.body.password;
  let resetUser;
  User.findOne({
    resetToken: token,
    tokenExpiration: { $gt: Date.now() },
    _id: userId,
  })
    .then((user) => {
      resetUser = user;
      return bcrypt.hash(newPassword, 12);
    })
    .then((hashPassword) => {
      resetUser.password = hashPassword;
      resetUser.resetToken = undefined;
      resetUser.tokenExpiration = undefined;
      return resetUser.save();
    })
    .then((result) => {
      res.redirect("/login");
    })
    .catch((err) => {
      console.log(err);
    });
};
