const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['Announcement', 'Event', 'General'], default: 'General' },
  targetRole: { type: String, enum: ['all', 'student', 'admin'], default: 'all' },
  targetClass: { type: String, default: '' },
  readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
