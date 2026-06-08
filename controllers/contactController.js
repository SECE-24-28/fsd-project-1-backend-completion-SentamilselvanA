const Contact = require('../models/Contact');

exports.submitContact = async (req, res) => {
  try {
    const contact = await Contact.create(req.body);
    res.status(201).json({ success: true, contact });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAllContacts = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const query = status ? { status } : {};
    const total = await Contact.countDocuments(query);
    const contacts = await Contact.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    res.json({ success: true, total, contacts });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!contact) return res.status(404).json({ success: false, message: 'Contact not found' });
    res.json({ success: true, contact });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteContact = async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Contact message deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
