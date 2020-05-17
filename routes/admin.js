const express = require("express");
const path = require("path");

const rootDir = require("../util/path");
const adminController = require("../controllers/admin");
const isAuth = require("../middleware/isAuth").isAuth;

const router = express.Router();

router.get("/add-product", isAuth, adminController.getAddProducts);
router.post("/add-product", isAuth, adminController.postAddProducts);
router.get("/products", isAuth, adminController.getProducts);
router.get("/edit-product/:productId", isAuth, adminController.getEditProducts);
router.post("/edit-product", isAuth, adminController.postEditProducts);
router.post("/delete-product", isAuth, adminController.postDeleteProducts);

module.exports = router;
