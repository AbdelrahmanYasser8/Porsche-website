const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { buildSessionUser, syncSessionUser } = require("../utils/session");

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name?.trim() || !email?.trim() || !password) {
      return res.status(400).json({ error: "Name, email, and password are required" });
    }

    const existing = await User.findOne({ email: email.trim().toLowerCase() });
    if (existing) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
    });

    const sessionUser = syncSessionUser(req, user);
    res.status(201).json({ user: sessionUser });
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ error: err.message });
    }

    res.status(500).json({ error: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email?.trim() || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    if (user.status === "Inactive") {
      return res.status(403).json({ error: "Account is inactive" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const sessionUser = syncSessionUser(req, user);
    res.json({ user: sessionUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const logout = (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({ message: "Logged out" });
  });
};

const getMe = (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  res.json({ user: buildSessionUser(req.user) });
};

const updateProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const nextName = req.body.name?.trim();
    if (!nextName) {
      return res.status(400).json({ error: "Name is required" });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name: nextName },
      { new: true, runValidators: true },
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const sessionUser = syncSessionUser(req, user);
    res.json({ user: sessionUser });
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ error: err.message });
    }

    res.status(500).json({ error: err.message });
  }
};

const changePassword = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: "Current and new passwords are required" });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Current password is incorrect" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Password updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { register, login, logout, getMe, updateProfile, changePassword };
