const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  mobile: { type: String, required: true },
  address: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  selectedCourse: { type: String, required: true },
  previousExperience: { type: String, default: 'None' },
  photo: { type: String, default: '' },
  photoPublicId: { type: String, default: '' },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected', 'Under Review'], default: 'Pending' },
  adminNote: { type: String, default: '' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);
