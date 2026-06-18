const express = require('express');
const router = express.Router();
const {
  getOverviewStats,
  addService,
  updateService,
  deleteService,
  getAllBookings,
  updateBookingStatus
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/stats', protect, admin, getOverviewStats);
router.post('/service/:type', protect, admin, addService);
router.put('/service/:type/:id', protect, admin, updateService);
router.delete('/service/:type/:id', protect, admin, deleteService);
router.get('/bookings', protect, admin, getAllBookings);
router.put('/bookings/:id/status', protect, admin, updateBookingStatus);

module.exports = router;
