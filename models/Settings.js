const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  academyName: { type: String, default: 'Rhythm Dance Academy' },
  tagline: { type: String, default: 'Where Every Step Tells a Story' },
  email: { type: String, default: '' },
  phone: { type: String, default: '' },
  address: { type: String, default: '' },
  logo: { type: String, default: '' },
  logoPublicId: { type: String, default: '' },
  socialMedia: {
    facebook: { type: String, default: '' },
    instagram: { type: String, default: '' },
    youtube: { type: String, default: '' },
    twitter: { type: String, default: '' },
  },
  emailSettings: {
    sendWelcomeEmail: { type: Boolean, default: true },
    sendApplicationUpdate: { type: Boolean, default: true },
  },
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema);
