const express = require('express');
const router = express.Router();
const { getAll, getMyOrders, create, updateStatus } = require('../controllers/orderController');
const { requireAuth, requireAdmin } = require('../middleware/auth');

router.get('/', requireAuth, requireAdmin, getAll);
router.get('/mine', requireAuth, getMyOrders);
router.post('/', requireAuth, create);
router.put('/:id/status', requireAuth, requireAdmin, updateStatus);

module.exports = router;
