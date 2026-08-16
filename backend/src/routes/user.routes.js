const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { protect } = require("../middleware/auth");

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/me", protect, userController.getMe);
router.put("/profile", protect, userController.updateProfile);
router.put("/password", protect, userController.updatePassword);
router.get("/orders", protect, userController.getMyOrders);

module.exports = router;
