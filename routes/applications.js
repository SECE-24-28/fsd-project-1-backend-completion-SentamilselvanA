const router = require('express').Router();
const { submitApplication, getMyApplications, getAllApplications, getApplication, updateApplicationStatus, deleteApplication } = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

router.post('/', protect, upload.single('photo'), submitApplication);
router.get('/my', protect, getMyApplications);
router.get('/', protect, authorize('admin'), getAllApplications);
router.get('/:id', protect, authorize('admin'), getApplication);
router.put('/:id/status', protect, authorize('admin'), updateApplicationStatus);
router.delete('/:id', protect, authorize('admin'), deleteApplication);

module.exports = router;
