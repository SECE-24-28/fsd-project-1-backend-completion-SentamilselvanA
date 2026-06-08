const Faculty = require('../models/Faculty');
const { cloudinary } = require('../config/cloudinary');

exports.getAllFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.find({ isActive: true }).sort({ createdAt: -1 });
    res.json({ success: true, faculty });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.findById(req.params.id);
    if (!faculty) return res.status(404).json({ success: false, message: 'Faculty not found' });
    res.json({ success: true, faculty });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createFaculty = async (req, res) => {
  try {
    if (req.file) {
      req.body.image = req.file.path;
      req.body.imagePublicId = req.file.filename;
    }
    if (typeof req.body.specialization === 'string') req.body.specialization = JSON.parse(req.body.specialization);
    if (typeof req.body.qualifications === 'string') req.body.qualifications = JSON.parse(req.body.qualifications);

    const faculty = await Faculty.create(req.body);
    res.status(201).json({ success: true, faculty });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateFaculty = async (req, res) => {
  try {
    const existing = await Faculty.findById(req.params.id);
    if (!existing) return res.status(404).json({ success: false, message: 'Faculty not found' });

    if (req.file) {
      if (existing.imagePublicId) await cloudinary.uploader.destroy(existing.imagePublicId).catch(console.error);
      req.body.image = req.file.path;
      req.body.imagePublicId = req.file.filename;
    }
    if (typeof req.body.specialization === 'string') req.body.specialization = JSON.parse(req.body.specialization);
    if (typeof req.body.qualifications === 'string') req.body.qualifications = JSON.parse(req.body.qualifications);

    const faculty = await Faculty.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, faculty });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.findById(req.params.id);
    if (!faculty) return res.status(404).json({ success: false, message: 'Faculty not found' });
    if (faculty.imagePublicId) await cloudinary.uploader.destroy(faculty.imagePublicId).catch(console.error);
    await faculty.deleteOne();
    res.json({ success: true, message: 'Faculty deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
