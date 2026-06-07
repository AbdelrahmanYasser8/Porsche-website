const Order = require("../models/Order");
const {
  sendOrderPlacedEmail,
  sendOrderStatusEmail,
} = require("../utils/orderEmails");
const { serializeOrder } = require("../utils/serializers");
const {
  buildPagination,
  getPaginationParams,
} = require("../utils/pagination");

const getAll = async (req, res) => {
  try {
    const { search, status } = req.query;
    const pagination = getPaginationParams(req.query, 8);
    const normalizedSearch = search?.trim().toLowerCase();
    const orders = await Order.find().sort({ createdAt: -1 });
    const serializedOrders = orders.map(serializeOrder);

    const filteredOrders = serializedOrders.filter((order) => {
      const matchesStatus = !status || status === "All" || order.status === status;

      if (!normalizedSearch) {
        return matchesStatus;
      }

      const matchesSearch = [
        order.id,
        order.customer,
        order.email,
        order.product,
        order.color,
        order.wheelType,
        order.status,
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedSearch);

      return matchesStatus && matchesSearch;
    });

    if (!pagination) {
      return res.json(filteredOrders);
    }

    const summary = {
      totalOrders: filteredOrders.length,
      processingCount: filteredOrders.filter((order) => order.status === "Processing").length,
      completedCount: filteredOrders.filter((order) => order.status === "Completed").length,
      totalRevenue: filteredOrders
        .filter((order) => order.status !== "Cancelled")
        .reduce((total, order) => total + Number(order.amount || 0), 0),
    };
    const paginated = buildPagination(filteredOrders, pagination.page, pagination.limit);
    res.json({
      ...paginated,
      summary,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getMyOrders = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    const pagination = getPaginationParams(req.query, 5);
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    const serializedOrders = orders.map(serializeOrder);

    if (!pagination) {
      return res.json(serializedOrders);
    }

    const paginated = buildPagination(serializedOrders, pagination.page, pagination.limit);
    res.json({
      ...paginated,
      summary: {
        totalOrders: serializedOrders.length,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const create = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const { product, color, wheelType, amount } = req.body;
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
      user: req.user._id,
    });

    await order.save();
    const serializedOrder = serializeOrder(order);
    await sendOrderPlacedEmail(serializedOrder);
    res.status(201).json(serializedOrder);
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
    if (!status) {
      return res.status(400).json({ error: "Status is required" });
    }

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    const previousStatus = order.status;
    order.status = status;
    await order.save();

    const serializedOrder = serializeOrder(order);
    if (previousStatus !== order.status) {
      await sendOrderStatusEmail(serializedOrder);
    }

    res.json(serializedOrder);
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ error: err.message });
    }

    res.status(500).json({ error: err.message });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json({ message: 'Order deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAll, getMyOrders, create, updateStatus, deleteOrder };
