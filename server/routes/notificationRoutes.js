const express = require('express');
const notificationController = require('../controllers/notificationController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Protected routes (Admin / Staff)
router.use(authMiddleware.protect);

router.get('/', notificationController.getNotifications);
router.post('/', notificationController.createNotification);
router.put('/read-all', notificationController.markAllAsRead);
router.put('/:id/read', notificationController.markAsRead);
router.delete('/', notificationController.clearAllNotifications);

module.exports = router;
