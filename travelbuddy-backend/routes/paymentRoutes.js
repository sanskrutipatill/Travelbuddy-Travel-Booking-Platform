const express = require('express');
const router = express.Router();
const { processPayment, getMyPayments, getPayments } = require('../controllers/paymentController');
const { protect, admin } = require('../middleware/authMiddleware');

// @route   GET /api/payments/test
// @desc    Test route to verify payment routes are loaded
router.get('/test', (req, res) => {
  res.json({ message: 'Payment routes are working!', timestamp: new Date().toISOString() });
});

// @route   POST /api/payments/pay
// @desc    Process a payment for a booking
router.post('/pay', protect, processPayment);

// @route   GET /api/payments/my-payments
// @desc    Get current user's payments
router.get('/my-payments', protect, getMyPayments);

// @route   GET /api/payments
// @desc    Get all payments (admin only)
router.get('/', protect, admin, getPayments);

module.exports = router;
