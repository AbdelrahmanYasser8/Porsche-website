const express = require('express');
const router = express.Router();
const { register, login, logout, getMe, updateProfile, changePassword } = require('../controllers/authController');
const { requireAuth } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', requireAuth, getMe);
router.put('/profile', requireAuth, updateProfile);
router.put('/password', requireAuth, changePassword);

module.exports = router;
