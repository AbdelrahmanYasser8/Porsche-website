const express = require('express');
const router = express.Router();
const {
  listUsers,
  getUserById,
  updateUserStatus,
  updateUserRole,
  deleteUser,
} = require('../controllers/usersController');
const { requireAuth, requireAdmin } = require('../middleware/auth');

router.use(requireAuth, requireAdmin);
router.get('/', listUsers);
router.get('/:id', getUserById);
router.put('/:id/status', updateUserStatus);
router.put('/:id/role', updateUserRole);
router.delete('/:id', deleteUser);

module.exports = router;
