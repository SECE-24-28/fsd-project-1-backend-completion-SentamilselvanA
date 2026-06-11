const Class = require('../models/Class');
const { cloudinary } = require('../config/cloudinary');

exports.getAllClasses = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, search } = req.query;
    const query = { isActive: true };
    if (category) query.category = category;
    if (search) query.title = new RegExp(search, 'i');

    const total = await Class.countDocuments(query);
    const classes = await Class.find(query)
      .populate('instructor', 'name specialization image')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ success: true, total, page: Number(page), classes });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getClass = async (req, res) => {
  try {
    if (!req.params.id.match(/^[a-f\d]{24}$/i))
      return res.status(400).json({ success: false, message: 'Invalid class ID' });

    const danceClass = await Class.findById(req.params.id).populate('instructor', 'name specialization image bio');
    if (!danceClass) return res.status(404).json({ success: false, message: 'Class not found' });
    res.json({ success: true, class: danceClass });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createClass = async (req, res) => {
  try {
    if (req.file) {
      req.body.image = req.file.path;
      req.body.imagePublicId = req.file.filename;
    }
    if (typeof req.body.schedule === 'string') req.body.schedule = JSON.parse(req.body.schedule);

    const danceClass = await Class.create(req.body);
    res.status(201).json({ success: true, class: danceClass });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateClass = async (req, res) => {
  try {
    if (!req.params.id.match(/^[a-f\d]{24}$/i))
      return res.status(400).json({ success: false, message: 'Invalid class ID' });

    const existing = await Class.findById(req.params.id);
    if (!existing) return res.status(404).json({ success: false, message: 'Class not found' });

    if (req.file) {
      if (existing.imagePublicId) await cloudinary.uploader.destroy(existing.imagePublicId).catch(console.error);
      req.body.image = req.file.path;
      req.body.imagePublicId = req.file.filename;
    }
    if (typeof req.body.schedule === 'string') req.body.schedule = JSON.parse(req.body.schedule);

    const danceClass = await Class.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, class: danceClass });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteClass = async (req, res) => {
  try {
    if (!req.params.id.match(/^[a-f\d]{24}$/i))
      return res.status(400).json({ success: false, message: 'Invalid class ID' });

    const danceClass = await Class.findById(req.params.id);
    if (!danceClass) return res.status(404).json({ success: false, message: 'Class not found' });
    if (danceClass.imagePublicId) await cloudinary.uploader.destroy(danceClass.imagePublicId).catch(console.error);
    await danceClass.deleteOne();
    res.json({ success: true, message: 'Class deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
