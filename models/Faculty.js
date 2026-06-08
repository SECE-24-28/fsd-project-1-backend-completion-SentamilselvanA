const mongoose = require('mongoose');

const facultySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  specialization: [{ type: String }],
  experience: { type: Number, required: true },
  bio: { type: String },
  image: { type: String, default: '' },
  imagePublicId: { type: String, default: '' },
  email: { type: String },
  mobile: { type: String },
  qualifications: [{ type: String }],
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Faculty', facultySchema);
