const Notification = require('../models/Notification');

exports.createNotification = async (req, res) => {
  try {
    const notification = await Notification.create(req.body);
    res.status(201).json({ success: true, notification });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getNotifications = async (req, res) => {
  try {
    const query = {
      isActive: true,
      $or: [{ targetRole: 'all' }, { targetRole: req.user.role }],
    };
    const notifications = await Notification.find(query).sort({ createdAt: -1 }).limit(20);
    const enriched = notifications.map(n => ({
      ...n.toObject(),
      isRead: n.readBy.includes(req.user._id),
    }));
    res.json({ success: true, notifications: enriched });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAllNotificationsAdmin = async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    res.json({ success: true, notifications });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { $addToSet: { readBy: req.user._id } });
    res.json({ success: true, message: 'Marked as read' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteNotification = async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Notification deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
