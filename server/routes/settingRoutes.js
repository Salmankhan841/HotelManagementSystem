const express = require('express');
const settingController = require('../controllers/settingController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Public / Authenticated read
router.get('/', settingController.getSettings);

// Protected routes (Admin / Manager)
router.put('/', authMiddleware.protect, authMiddleware.restrictTo('admin', 'manager'), settingController.updateSettings);
router.put('/profile', authMiddleware.protect, settingController.updateAdminProfile);

module.exports = router;
