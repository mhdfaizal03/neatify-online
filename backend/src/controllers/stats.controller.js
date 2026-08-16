const Product = require("../models/Product");
const Order = require("../models/Order");
const Subscriber = require("../models/Subscriber");

class StatsController {
  async getStats(req, res, next) {
    try {
      const totalProducts = await Product.countDocuments({ isDeleted: false });
      const totalOrders = await Order.countDocuments({ isDeleted: false });
      const totalSubscribers = await Subscriber.countDocuments();

      // Calculate total revenue
      const revenueData = await Order.aggregate([
        {
          $match: {
            isDeleted: false,
            status: { $ne: "Cancelled" },
          },
        },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$total" },
          },
        },
      ]);

      const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

      // Category counts
      const categories = await Product.aggregate([
        { $match: { isDeleted: false } },
        { $group: { _id: "$category", count: { $sum: 1 } } },
      ]);

      const categoryCounts = {};
      categories.forEach((c) => {
        categoryCounts[c._id] = c.count;
      });

      // Recent 5 orders
      const recentOrders = await Order.find({ isDeleted: false })
        .sort("-createdAt")
        .limit(5);

      const formattedRecentOrders = recentOrders.map((o) => ({
        id: o._id.toString(),
        customer: o.customer,
        total: o.total,
        status: o.status,
        createdAt: o.createdAt,
      }));

      res.status(200).json({
        totalProducts,
        totalOrders,
        totalRevenue,
        totalSubscribers,
        categoryCounts,
        recentOrders: formattedRecentOrders,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new StatsController();
