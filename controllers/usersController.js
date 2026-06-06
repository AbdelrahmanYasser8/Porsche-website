const User = require("../models/User");
const Order = require("../models/Order");
const { serializeUser } = require("../utils/serializers");
const {
  buildPagination,
  getPaginationParams,
} = require("../utils/pagination");

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
    const pagination = getPaginationParams(req.query, 8);
    const filter = {};
    const normalizedSearch = search?.trim();

    if (status && status !== "All") {
      filter.status = status;
    }

    if (role && role !== "All") {
      filter.role = role;
    }

    if (normalizedSearch) {
      filter.$or = [
        { name: { $regex: normalizedSearch, $options: "i" } },
        { email: { $regex: normalizedSearch, $options: "i" } },
      ];
    }

    const users = await User.find(filter).sort({ createdAt: -1 });
    const orderCounts = await buildUserOrderCounts(users.map((user) => user._id));
    const serializedUsers = users.map((user) => serializeUser(user, orderCounts.get(user._id.toString()) || 0));

    if (!pagination) {
      return res.json(serializedUsers);
    }

    const summary = {
      totalUsers: serializedUsers.length,
      activeUsers: serializedUsers.filter((user) => user.status === "Active").length,
      inactiveUsers: serializedUsers.filter((user) => user.status !== "Active").length,
      totalOrders: serializedUsers.reduce((total, user) => total + Number(user.ordersCount || 0), 0),
    };
    const paginated = buildPagination(serializedUsers, pagination.page, pagination.limit);
    res.json({
      ...paginated,
      summary,
    });
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
