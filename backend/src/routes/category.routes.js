const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category.controller");
const { protect, adminOnly } = require("../middleware/auth");

router.get("/", categoryController.getCategories);
router.post("/", protect, adminOnly, categoryController.createCategory);
router.delete("/:id", protect, adminOnly, categoryController.deleteCategory);

module.exports = router;
