const express = require('express');
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  cancelBooking,
  createSimpleBooking
} = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

// Original generic booking route
router.post('/book', protect, createBooking);

// Get user's bookings
router.get('/my-bookings', protect, getMyBookings);

// Cancel booking
router.put('/cancel/:id', protect, cancelBooking);

module.exports = router;
