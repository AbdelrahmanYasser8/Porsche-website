const express = require('express');
const router = express.Router();
const {
  getAll,
  getById,
  getModel,
  create,
  update,
  remove,
  seed,
  uploadModel,
} = require('../controllers/carController');
const { requireAuth, requireAdmin } = require('../middleware/auth');

router.get('/', getAll);
router.get('/seed', requireAuth, requireAdmin, seed);
router.get('/:id/model', getModel);
router.get('/:id', getById);
router.post('/model-assets', requireAuth, requireAdmin, express.raw({ type: '*/*', limit: '200mb' }), uploadModel);
router.post('/', requireAuth, requireAdmin, create);
router.put('/:id', requireAuth, requireAdmin, update);
router.delete('/:id', requireAuth, requireAdmin, remove);

module.exports = router;
