const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Protect route (Customer or Admin)
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.SESSION_SECRET || "change-this-to-a-long-random-string");

      if (decoded.isAdmin) {
        req.user = { id: "admin", role: "Admin", name: "Admin" };
        return next();
      }

      // Find customer
      req.user = await User.findOne({ _id: decoded.id, isDeleted: false });
      if (!req.user) {
        return res.status(401).json({ error: "Not authorized, user not found" });
      }

      next();
    } catch (error) {
      console.error("Auth error:", error);
      res.status(401).json({ error: "Not authorized, token failed" });
    }
  }

  if (!token) {
    res.status(401).json({ error: "Not authorized, no token" });
  }
};

// Admin only route
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "Admin") {
    next();
  } else {
    res.status(403).json({ error: "Not authorized as an admin" });
  }
};

module.exports = { protect, adminOnly };
