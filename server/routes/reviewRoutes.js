const express = require('express');
const reviewController = require('../controllers/reviewController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Public: Get reviews for a room
router.get('/room/:roomId', reviewController.getRoomReviews);

// Protected routes (Require Login)
router.use(authMiddleware.protect);

router.post('/', reviewController.createReview);
router.delete('/:id', reviewController.deleteReview);

// Admin only: Get all reviews
router.get('/', authMiddleware.restrictTo('admin', 'manager'), reviewController.getAllReviews);

module.exports = router;
