const User = require("../models/User");
const Order = require("../models/Order");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.SESSION_SECRET || "change-this-to-a-long-random-string", {
    expiresIn: "30d",
  });
};

const formatUserResponse = (user) => ({
  name: user.name,
  email: user.email,
  phone: user.phone || "",
  address: user.address || "",
  createdAt: user.createdAt,
});

class UserController {
  async register(req, res, next) {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({ error: "Please enter all fields" });
      }

      const userExists = await User.findOne({ email, isDeleted: false });
      if (userExists) {
        return res.status(400).json({ error: "User already exists" });
      }

      const user = await User.create({
        name,
        email,
        password,
      });

      res.status(201).json({
        token: generateToken(user._id),
        user: formatUserResponse(user),
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: "Please enter all fields" });
      }

      const user = await User.findOne({ email, isDeleted: false }).select("+password");

      if (user && (await user.matchPassword(password))) {
        res.json({
          token: generateToken(user._id),
          user: formatUserResponse(user),
        });
      } else {
        res.status(401).json({ error: "Invalid email or password" });
      }
    } catch (error) {
      next(error);
    }
  }

  async getMe(req, res, next) {
    try {
      res.json(formatUserResponse(req.user));
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req, res, next) {
    try {
      const { name, phone, address } = req.body;
      const user = req.user;

      if (name) user.name = name;
      user.phone = phone || "";
      user.address = address || "";

      const updatedUser = await user.save();
      res.json(formatUserResponse(updatedUser));
    } catch (error) {
      next(error);
    }
  }

  async updatePassword(req, res, next) {
    try {
      const { currentPassword, newPassword } = req.body;
      const user = await User.findById(req.user._id).select("+password");

      if (user && (await user.matchPassword(currentPassword))) {
        user.password = newPassword;
        await user.save();
        res.json({ success: true, message: "Password updated successfully" });
      } else {
        res.status(401).json({ error: "Invalid current password" });
      }
    } catch (error) {
      next(error);
    }
  }

  async getMyOrders(req, res, next) {
    try {
      const orders = await Order.find({
        "customer.email": req.user.email,
        isDeleted: false,
      }).sort("-createdAt");

      const formattedOrders = orders.map((o) => ({
        id: o._id.toString(),
        customer: o.customer,
        items: o.items,
        total: o.total,
        shipping: o.shipping,
        status: o.status,
        createdAt: o.createdAt,
      }));

      res.json(formattedOrders);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();
