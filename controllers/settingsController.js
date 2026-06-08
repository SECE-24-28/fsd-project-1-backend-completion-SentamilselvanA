const Settings = require('../models/Settings');

exports.getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) settings = await Settings.create({});
    res.json({ success: true, settings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) settings = await Settings.create(req.body);
    else settings = await Settings.findByIdAndUpdate(settings._id, req.body, { new: true, runValidators: true });
    res.json({ success: true, settings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
