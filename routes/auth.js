const express = require("express");
const authController = require("../controllers/auth");
const { check, body } = require("express-validator/check");

const User = require("../models/user");

const router = express.Router();

router.get("/login", authController.getLogin);

router.post(
  "/login",
  [
    check("email").isEmail().withMessage("Invalid Email"),
    body("password").isLength({ min: 5 }),
  ],
  authController.postLogin
);

router.post("/logout", authController.postLogout);

router.get("/signup", authController.getSignUp);

router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("Invalid Email")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((user) => {
          if (user) {
            return Promise.reject("Email already Exists");
          }
        });
      })
      .normalizeEmail(),
    body(
      "password",
      "password should numbers and text only and atleast 5 characters"
    )
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim(),
    body("confirmPassword")
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Password do not match");
        }
        return true;
      }),
  ],
  authController.postSignUp
);

router.get("/reset", authController.getReset);

router.post("/reset", authController.postReset);

router.get("/reset/:token", authController.getNewPassword);

router.post("/new-password", authController.postNewPassword);

module.exports = router;
