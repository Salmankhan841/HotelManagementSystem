const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', authMiddleware.protect, authController.getMe);

// Admin user management routes
router.get('/users', authMiddleware.protect, authMiddleware.restrictTo('admin', 'manager'), authController.getAllUsers);
router.post('/staff', authMiddleware.protect, authMiddleware.restrictTo('admin', 'manager'), authController.createStaff);
router.put('/users/:id/role', authMiddleware.protect, authMiddleware.restrictTo('admin', 'manager'), authController.updateUserRole);
router.delete('/users/:id', authMiddleware.protect, authMiddleware.restrictTo('admin'), authController.deleteUser);

module.exports = router;
