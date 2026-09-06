const express = require('express');
const roomController = require('../controllers/roomController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

// Public routes
router.get('/', roomController.getAllRooms);
router.get('/:id', roomController.getRoom);

// Protected routes (Admin & Manager only)
router.use(authMiddleware.protect);
router.use(authMiddleware.restrictTo('admin', 'manager'));

// Configure multer to expect an array of files under the field name 'images'
router.post('/', upload.array('images', 5), roomController.createRoom);
router.put('/:id', upload.array('images', 5), roomController.updateRoom);

// Only Admin can delete rooms
router.delete('/:id', authMiddleware.restrictTo('admin'), roomController.deleteRoom);

module.exports = router;
