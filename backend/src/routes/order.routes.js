const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");
const { protect, adminOnly } = require("../middleware/auth");

router.post("/", orderController.createOrder);
router.get("/", protect, adminOnly, orderController.getOrders);
router.patch("/:id", protect, adminOnly, orderController.updateOrderStatus);
router.delete("/:id", protect, adminOnly, orderController.deleteOrder);

module.exports = router;
