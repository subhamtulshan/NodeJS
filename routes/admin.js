const express = require("express");
const path = require("path");

const rootDir = require("../util/path");
const adminController = require("../controllers/admin");

const router = express.Router();

router.get("/add-product", adminController.getAddProducts);
router.post("/add-product", adminController.postAddProducts);
router.get("/products", adminController.getProducts);
router.get("/edit-product/:productId", adminController.getEditProducts);
router.post("/edit-product", adminController.postEditProducts);
router.post("/delete-product", adminController.postDeleteProducts);

module.exports = router;
