const express = require('express');
const router = express.Router();
const {
  register,
  login,
  verifyCode,
  resendCode,
  logout,
  getMe,
  updateProfile,
  changePassword,
  seedAdmin,
} = require("../controllers/authController");
const { requireAuth } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.post("/verify-code", verifyCode);
router.post("/resend-code", resendCode);
router.post('/logout', logout);
router.post('/seed-admin', seedAdmin);
router.get('/me', requireAuth, getMe);
router.put('/profile', requireAuth, updateProfile);
router.put('/password', requireAuth, changePassword);

module.exports = router;
