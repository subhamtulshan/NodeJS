const express = require("express");
const path = require("path");

const rootDir = require("../util/path");
const shopController = require("../controllers/shop");
const isAuth = require("../middleware/isAuth").isAuth;

const router = express.Router();

router.get("/", shopController.getIndex);
router.get("/cart", isAuth, shopController.getCart);
router.post("/cart", isAuth, shopController.postCart);
// // router.get("/checkout", shopController.getCheckout);
router.get("/products", shopController.getProduct);
router.get("/products/:productId", shopController.getProductById);
router.post("/cart-delete-item", isAuth, shopController.postDeleteCartProduct);
router.post("/create-order", isAuth, shopController.postOrders);
router.get("/orders", isAuth, shopController.getOrders);

module.exports = router;
