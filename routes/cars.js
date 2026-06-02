const express = require('express');
const router = express.Router();
const { getAll, getById, create, update, remove, seed } = require('../controllers/carController');
const { requireAuth, requireAdmin } = require('../middleware/auth');

router.get('/', getAll);
router.get('/seed', requireAuth, requireAdmin, seed);
router.get('/:id', getById);
router.post('/', requireAuth, requireAdmin, create);
router.put('/:id', requireAuth, requireAdmin, update);
router.delete('/:id', requireAuth, requireAdmin, remove);

module.exports = router;
