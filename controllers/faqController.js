const FAQ = require('../models/FAQ');

exports.getFAQs = async (req, res) => {
  try {
    const faqs = await FAQ.find({ isActive: true }).sort({ order: 1, createdAt: 1 });
    res.json({ success: true, faqs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createFAQ = async (req, res) => {
  try {
    const faq = await FAQ.create(req.body);
    res.status(201).json({ success: true, faq });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateFAQ = async (req, res) => {
  try {
    const faq = await FAQ.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!faq) return res.status(404).json({ success: false, message: 'FAQ not found' });
    res.json({ success: true, faq });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteFAQ = async (req, res) => {
  try {
    await FAQ.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'FAQ deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const User = require('../models/User');
    const Class = require('../models/Class');
    const Application = require('../models/Application');
    const Enquiry = require('../models/Enquiry');
    const Faculty = require('../models/Faculty');

    const [totalStudents, totalClasses, totalApplications, totalEnquiries, totalFaculty,
      pendingApplications, newEnquiries] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      Class.countDocuments({ isActive: true }),
      Application.countDocuments(),
      Enquiry.countDocuments(),
      Faculty.countDocuments({ isActive: true }),
      Application.countDocuments({ status: 'Pending' }),
      Enquiry.countDocuments({ status: 'New' }),
    ]);

    res.json({
      success: true,
      stats: { totalStudents, totalClasses, totalApplications, totalEnquiries, totalFaculty, pendingApplications, newEnquiries },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
