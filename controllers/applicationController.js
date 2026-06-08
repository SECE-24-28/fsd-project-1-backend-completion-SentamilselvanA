const Application = require('../models/Application');
const { cloudinary } = require('../config/cloudinary');
const { sendApplicationStatusEmail } = require('../services/emailService');

exports.submitApplication = async (req, res) => {
  try {
    if (req.file) {
      req.body.photo = req.file.path;
      req.body.photoPublicId = req.file.filename;
    }
    if (req.user) req.body.user = req.user._id;

    const application = await Application.create(req.body);
    res.status(201).json({ success: true, application });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, applications });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAllApplications = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    const query = {};
    if (status) query.status = status;
    if (search) query.$or = [{ fullName: new RegExp(search, 'i') }, { email: new RegExp(search, 'i') }];

    const total = await Application.countDocuments(query);
    const applications = await Application.find(query)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ success: true, total, page: Number(page), applications });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id).populate('user', 'name email');
    if (!application) return res.status(404).json({ success: false, message: 'Application not found' });
    res.json({ success: true, application });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status, adminNote } = req.body;
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status, adminNote },
      { new: true }
    );
    if (!application) return res.status(404).json({ success: false, message: 'Application not found' });

    try { await sendApplicationStatusEmail(application, status); } catch (e) { console.error(e); }

    res.json({ success: true, application });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteApplication = async (req, res) => {
  try {
    const application = await Application.findByIdAndDelete(req.params.id);
    if (!application) return res.status(404).json({ success: false, message: 'Application not found' });
    if (application.photoPublicId) await cloudinary.uploader.destroy(application.photoPublicId).catch(console.error);
    res.json({ success: true, message: 'Application deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
