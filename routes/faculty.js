const router = require('express').Router();
const { getAllFaculty, getFaculty, createFaculty, updateFaculty, deleteFaculty } = require('../controllers/facultyController');
const { protect, authorize } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

router.get('/', getAllFaculty);
router.get('/:id', getFaculty);
router.post('/', protect, authorize('admin'), upload.single('image'), createFaculty);
router.put('/:id', protect, authorize('admin'), upload.single('image'), updateFaculty);
router.delete('/:id', protect, authorize('admin'), deleteFaculty);

module.exports = router;
