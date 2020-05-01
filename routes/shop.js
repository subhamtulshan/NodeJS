const express = require("express");
const path = require("path");

const rootDir = require("../util/path");
const shopController = require("../controllers/shop");

const router = express.Router();

router.get("/", shopController.getIndex);
router.get("/cart", shopController.getCart);
router.post("/cart", shopController.postCart);
router.get("/checkout", shopController.getCheckout);
router.get("/products", shopController.getProduct);
router.get("/products/:productId", shopController.getProductById);
router.post("/cart-delete-item", shopController.postDeleteCartProduct);
router.get("/orders", shopController.getOrders);

module.exports = router;
