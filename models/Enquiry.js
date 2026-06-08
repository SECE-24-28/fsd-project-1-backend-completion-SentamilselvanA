const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  mobile: { type: String, required: true },
  courseInterested: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ['New', 'Read', 'Replied'], default: 'New' },
  reply: { type: String, default: '' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Enquiry', enquirySchema);
