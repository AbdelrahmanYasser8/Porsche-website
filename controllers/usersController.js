const User = require("../models/User");
const Order = require("../models/Order");
const { serializeUser } = require("../utils/serializers");

async function buildUserOrderCounts(userIds) {
  if (!userIds.length) {
    return new Map();
  }

  const counts = await Order.aggregate([
    {
      $match: {
        user: {
          $in: userIds,
        },
      },
    },
    {
      $group: {
        _id: "$user",
        ordersCount: {
          $sum: 1,
        },
      },
    },
  ]);

  return new Map(
    counts.map((entry) => [entry._id.toString(), entry.ordersCount]),
  );
}

async function listUsers(req, res) {
  try {
    const { search, status, role } = req.query;
    const filter = {};

    if (status && status !== "All") {
      filter.status = status;
    }

    if (role && role !== "All") {
      filter.role = role;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const users = await User.find(filter).sort({ createdAt: -1 });
    const orderCounts = await buildUserOrderCounts(users.map((user) => user._id));

    res.json(users.map((user) => serializeUser(user, orderCounts.get(user._id.toString()) || 0)));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getUserById(req, res) {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const ordersCount = await Order.countDocuments({ user: user._id });
    res.json(serializeUser(user, ordersCount));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function updateUserStatus(req, res) {
  try {
    const { status } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true },
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const ordersCount = await Order.countDocuments({ user: user._id });
    res.json(serializeUser(user, ordersCount));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function updateUserRole(req, res) {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true },
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const ordersCount = await Order.countDocuments({ user: user._id });
    res.json(serializeUser(user, ordersCount));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function deleteUser(req, res) {
  try {
    if (req.user && req.user._id.toString() === req.params.id) {
      return res.status(400).json({ error: "You cannot delete your own account" });
    }

    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const processingOrders = await Order.find({ user: user._id, status: "Processing" });

    for (const order of processingOrders) {
      order.status = "Cancelled";
      await order.save();
    }

    res.json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  listUsers,
  getUserById,
  updateUserStatus,
  updateUserRole,
  deleteUser,
};
