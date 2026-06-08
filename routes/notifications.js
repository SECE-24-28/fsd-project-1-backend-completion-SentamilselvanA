const router = require('express').Router();
const { createNotification, getNotifications, getAllNotificationsAdmin, markAsRead, deleteNotification } = require('../controllers/notificationController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('admin'), createNotification);
router.get('/', protect, getNotifications);
router.get('/admin/all', protect, authorize('admin'), getAllNotificationsAdmin);
router.put('/:id/read', protect, markAsRead);
router.delete('/:id', protect, authorize('admin'), deleteNotification);

module.exports = router;
