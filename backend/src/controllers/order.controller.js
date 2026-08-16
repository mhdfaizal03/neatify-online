const Order = require("../models/Order");

const formatOrder = (o) => {
  if (!o) return null;
  return {
    id: o._id.toString(),
    customer: o.customer,
    items: o.items.map((it) => ({
      name: it.name,
      price: it.price,
      qty: it.qty,
    })),
    total: o.total,
    shipping: o.shipping,
    status: o.status || "Pending",
    createdAt: o.createdAt,
  };
};

class OrderController {
  async createOrder(req, res, next) {
    try {
      const { customer, items, total, shipping } = req.body;

      if (!customer || !items || items.length === 0) {
        return res.status(400).json({ error: "Invalid order data" });
      }

      const order = await Order.create({
        customer,
        items,
        total,
        shipping,
        status: "Pending",
      });

      res.status(201).json(formatOrder(order));
    } catch (error) {
      next(error);
    }
  }

  async getOrders(req, res, next) {
    try {
      const orders = await Order.find({ isDeleted: false }).sort("-createdAt");
      res.status(200).json(orders.map(formatOrder));
    } catch (error) {
      next(error);
    }
  }

  async updateOrderStatus(req, res, next) {
    try {
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
