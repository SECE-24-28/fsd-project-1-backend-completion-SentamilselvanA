const router = require('express').Router();
const { getFAQs, createFAQ, updateFAQ, deleteFAQ, getDashboardStats } = require('../controllers/faqController');
const { protect, authorize } = require('../middleware/auth');

router.get('/stats', protect, authorize('admin'), getDashboardStats);
router.get('/', getFAQs);
router.post('/', protect, authorize('admin'), createFAQ);
router.put('/:id', protect, authorize('admin'), updateFAQ);
router.delete('/:id', protect, authorize('admin'), deleteFAQ);

module.exports = router;
