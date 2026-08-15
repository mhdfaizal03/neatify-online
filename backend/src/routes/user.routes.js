const express = require("express");
const router = express.Router();
// const { validateUser } = require("../validators/user.validator");
// const userController = require("../controllers/user.controller");
// const { protect, authorize } = require("../middleware/auth");

router.get("/", (req, res) => {
  res.json({ success: true, message: "Users endpoint" });
});

module.exports = router;
