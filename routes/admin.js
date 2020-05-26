const express = require("express");
const path = require("path");
const { check, body } = require("express-validator/check");

const rootDir = require("../util/path");
const adminController = require("../controllers/admin");
const isAuth = require("../middleware/isAuth").isAuth;

const router = express.Router();

router.get("/add-product", isAuth, adminController.getAddProducts);
router.post(
  "/add-product",
  [
    body("title", "Title should only be string").isString(),
    body("price", "Price should be number").isFloat(),
    body("description", "description not correct").isLength({
      max: 400,
      min: 5,
    }),
  ],
  isAuth,
  adminController.postAddProducts
);
router.get("/products", isAuth, adminController.getProducts);
router.get("/edit-product/:productId", isAuth, adminController.getEditProducts);
router.post(
  "/edit-product",
  [
    body("title", "Title should only be string").isString(),
    body("price", "Price should be number").isFloat(),
    body("description", "description not correct").isLength({
      max: 400,
      min: 5,
    }),
  ],
  isAuth,
  adminController.postEditProducts
);
router.delete(
  "/product/:productId",
  isAuth,
  adminController.postDeleteProducts
);

module.exports = router;
