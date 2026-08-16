const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const defaultAdminUser = process.env.ADMIN_USERNAME || "admin";
  const defaultAdminPass = process.env.ADMIN_PASSWORD || "neatify2026";

  if (username === defaultAdminUser && password === defaultAdminPass) {
    const token = jwt.sign(
      { isAdmin: true, username },
      process.env.SESSION_SECRET || "change-this-to-a-long-random-string",
      { expiresIn: "30d" }
    );
    return res.json({ token, username });
  }

  res.status(401).json({ error: "Invalid username or password" });
});

module.exports = router;
