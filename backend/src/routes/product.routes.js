const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");
const { protect, adminOnly } = require("../middleware/auth");

router.get("/", productController.getProducts);
router.get("/all", productController.getAllProducts);
router.get("/:id", productController.getProduct);

router.post("/", protect, adminOnly, productController.createProduct);
router.patch("/:id", protect, adminOnly, productController.updateProduct);
router.delete("/:id", protect, adminOnly, productController.deleteProduct);
router.patch("/:id/restore", protect, adminOnly, productController.restoreProduct);

module.exports = router;
