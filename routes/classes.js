const router = require('express').Router();
const { getAllClasses, getClass, createClass, updateClass, deleteClass } = require('../controllers/classController');
const { protect, authorize } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

router.get('/', getAllClasses);
router.get('/:id', getClass);
router.post('/', protect, authorize('admin'), upload.single('image'), createClass);
router.put('/:id', protect, authorize('admin'), upload.single('image'), updateClass);
router.delete('/:id', protect, authorize('admin'), deleteClass);

module.exports = router;
