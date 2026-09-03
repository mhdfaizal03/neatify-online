const mongoose = require("mongoose");
const Product = require("../models/Product");
const Order = require("../models/Order");

const formatOrder = (o) => {
  if (!o) return null;
  return {
    id: o._id ? o._id.toString() : o.id,
    customer: o.customer,
    items: o.items.map((it) => ({
      id: it.id,
      name: it.name,
      price: it.price,
      qty: it.qty,
    })),
    total: o.total,
    shipping: o.shipping,
    enquiryType: o.customer?.enquiryType || "availability",
    source: o.source || "whatsapp-enquiry",
    status: o.status || "Pending",
    createdAt: o.createdAt || new Date(),
  };
};

class OrderController {
  async createOrder(req, res, next) {
    try {
      const { customer, items, total, shipping, enquiryType } = req.body;

      if (!customer || !items || items.length === 0) {
        return res.status(400).json({ error: "Invalid order data" });
      }

      if (mongoose.connection.readyState === 0) {
        console.warn("Database not connected, returning mock success for order placement.");
        const mockOrder = {
          id: "ENQ-" + Math.floor(100000 + Math.random() * 900000),
          customer,
          items,
          total,
          shipping,
          status: "Pending",
          source: "whatsapp-enquiry",
          createdAt: new Date(),
        };
        return res.status(201).json(mockOrder);
      }

      // Check current availability without reserving or decrementing stock.
      for (const item of items) {
        const product = await Product.findOne({ id: item.id, isDeleted: false });
        if (!product) {
          return res.status(404).json({ error: `Product "${item.name}" not found.` });
        }
        if (product.stock < item.qty) {
          return res.status(400).json({ error: `Product "${item.name}" is out of stock (only ${product.stock} left).` });
        }
      }

      const order = await Order.create({
        customer: {
          ...customer,
          enquiryType: enquiryType || customer.enquiryType || "availability",
        },
        items,
        total,
        shipping,
        source: "whatsapp-enquiry",
        status: "Pending",
      });

      res.status(201).json(formatOrder(order));
    } catch (error) {
      next(error);
    }
  }

  async getOrders(req, res, next) {
    try {
      if (mongoose.connection.readyState === 0) {
        console.warn("Database not connected, returning empty orders list.");
        return res.status(200).json([]);
      }

      const orders = await Order.find({ isDeleted: false }).sort("-createdAt");
      res.status(200).json(orders.map(formatOrder));
    } catch (error) {
      next(error);
    }
  }

  async updateOrderStatus(req, res, next) {
    try {
      if (mongoose.connection.readyState === 0) {
        return res.status(400).json({ error: "Database not connected. Cannot perform write operations." });
      }

      const { status } = req.body;
      const order = await Order.findOneAndUpdate(
        { _id: req.params.id, isDeleted: false },
        { status },
        { new: true }
      );

      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }

      res.status(200).json(formatOrder(order));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new OrderController();
