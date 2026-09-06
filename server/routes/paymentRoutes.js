const express = require('express');
const paymentController = require('../controllers/paymentController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Require login for payment operations
router.use(authMiddleware.protect);

router.post('/process', paymentController.processPaymentAndBook);
router.post('/checkout-session', paymentController.createCheckoutSession);

module.exports = router;
