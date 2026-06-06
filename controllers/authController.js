const User = require('../models/User');
const bcrypt = require('bcryptjs');

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    req.session.user = { id: user._id, name: user.name, email: user.email, role: user.role };
    res.status(201).json({ user: req.session.user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    req.session.user = { id: user._id, name: user.name, email: user.email, role: user.role };
    res.json({ user: req.session.user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const logout = (req, res) => {
  req.session.destroy();
  res.json({ message: 'Logged out' });
};

const getMe = (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  res.json({ user: req.session.user });
};

const updateProfile = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const user = await User.findByIdAndUpdate(
      req.session.user.id,
      { name: req.body.name },
      { new: true }
    );

    req.session.user.name = user.name;
    res.json({ user: req.session.user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const changePassword = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.session.user.id);

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: 'Password updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { register, login, logout, getMe, updateProfile, changePassword };
