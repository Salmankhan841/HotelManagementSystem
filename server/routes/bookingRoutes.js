const express = require('express');
const bookingController = require('../controllers/bookingController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// All booking routes require authentication
router.use(authMiddleware.protect);

// Routes for normal users
router.post('/', bookingController.createBooking);
router.get('/my-bookings', bookingController.getMyBookings);
router.put('/:id/cancel', bookingController.cancelBooking);

// Routes restricted to Admins/Managers
router.use(authMiddleware.restrictTo('admin', 'manager'));
router.get('/', bookingController.getAllBookings);
router.put('/:id', bookingController.updateBookingStatus);

module.exports = router;
