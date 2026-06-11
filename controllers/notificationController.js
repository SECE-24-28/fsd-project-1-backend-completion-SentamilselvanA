const Notification = require('../models/Notification');
const Application = require('../models/Application');

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
    // Get courses the student is enrolled in (approved applications)
    let studentCourses = [];
    if (req.user.role === 'student') {
      const apps = await Application.find({ user: req.user._id, status: 'Approved' }).select('selectedCourse');
      studentCourses = apps.map(a => a.selectedCourse);
    }

    const notifications = await Notification.find({ isActive: true }).sort({ createdAt: -1 }).limit(50);

    const filtered = notifications.filter(n => {
      const roleMatch = n.targetRole === 'all' || n.targetRole === req.user.role;
      if (!roleMatch) return false;
      if (n.targetClass) return studentCourses.includes(n.targetClass);
      return true;
    });

    const enriched = filtered.slice(0, 20).map(n => ({
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
