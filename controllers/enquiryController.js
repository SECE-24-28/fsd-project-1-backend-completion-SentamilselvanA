const Enquiry = require('../models/Enquiry');
const { sendEnquiryReplyEmail } = require('../services/emailService');

exports.submitEnquiry = async (req, res) => {
  try {
    if (req.user) req.body.user = req.user._id;
    const enquiry = await Enquiry.create(req.body);
    res.status(201).json({ success: true, enquiry });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getMyEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, enquiries });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAllEnquiries = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const query = status ? { status } : {};
    const total = await Enquiry.countDocuments(query);
    const enquiries = await Enquiry.find(query)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    res.json({ success: true, total, enquiries });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.replyEnquiry = async (req, res) => {
  try {
    const enquiry = await Enquiry.findByIdAndUpdate(
      req.params.id,
      { reply: req.body.reply, status: 'Replied' },
      { new: true }
    );
    if (!enquiry) return res.status(404).json({ success: false, message: 'Enquiry not found' });
    try { await sendEnquiryReplyEmail(enquiry, req.body.reply); } catch (e) { console.error(e); }
    res.json({ success: true, enquiry });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteEnquiry = async (req, res) => {
  try {
    await Enquiry.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Enquiry deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
