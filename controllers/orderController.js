const Order = require("../models/Order");
const { serializeOrder } = require("../utils/serializers");

const getAll = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders.map(serializeOrder));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getMyOrders = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders.map(serializeOrder));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const create = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const { product, color, wheelType, amount, status } = req.body;
    if (!product?.trim() || amount === undefined || amount === null) {
      return res.status(400).json({ error: "Product and amount are required" });
    }

    const order = new Order({
      customer: req.user.name,
      email: req.user.email,
      product: product.trim(),
      color: color?.trim() || "",
      wheelType: wheelType?.trim() || "",
      amount: Number(amount),
      status: status || "Processing",
      user: req.user._id,
    });

    await order.save();
    res.status(201).json(serializeOrder(order));
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ error: err.message });
    }

    res.status(500).json({ error: err.message });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true },
    );
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(serializeOrder(order));
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ error: err.message });
    }

    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAll, getMyOrders, create, updateStatus };
