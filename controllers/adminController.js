const Car = require("../models/Car");
const Order = require("../models/Order");
const User = require("../models/User");
const { serializeOrder } = require("../utils/serializers");

async function getDashboardSummary(req, res) {
  try {
    const [totalUsers, totalCars, totalOrders, revenueAgg, recentOrders] = await Promise.all([
      User.countDocuments(),
      Car.countDocuments(),
      Order.countDocuments(),
      Order.aggregate([
        {
          $match: {
            status: { $ne: "Cancelled" },
          },
        },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$amount" },
          },
        },
      ]),
      Order.find().sort({ createdAt: -1 }).limit(4),
    ]);

    res.json({
      stats: {
        totalUsers,
        totalCars,
        totalOrders,
        revenue: revenueAgg[0]?.totalRevenue || 0,
      },
      recentOrders: recentOrders.map(serializeOrder),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  getDashboardSummary,
};
