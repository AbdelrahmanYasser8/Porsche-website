const express = require('express');
const router = express.Router();
const { getAll, getMyOrders, create, updateStatus, deleteOrder } = require('../controllers/orderController');
const { requireAuth, requireAdmin } = require('../middleware/auth');

router.get('/', requireAuth, requireAdmin, getAll);
router.get('/mine', requireAuth, getMyOrders);
router.post('/', requireAuth, create);
router.put('/:id/status', requireAuth, requireAdmin, updateStatus);
router.delete('/:id', requireAuth, requireAdmin, deleteOrder);

module.exports = router;
