const Booking = require('../models/Booking');
const Flight = require('../models/Flight');
const Hotel = require('../models/Hotel');
const Train = require('../models/Train');
const Cab = require('../models/Cab');

const getModel = (type) => {
  switch (type) {
    case 'flight': return Flight;
    case 'hotel': return Hotel;
    case 'train': return Train;
    case 'cab': return Cab;
    default: return null;
  }
};

// Simple booking endpoint that accepts direct flight data (for frontend simplicity)
// Expected body: { userId, airline, flightNumber, source, destination, departureTime, arrivalTime, duration, stops, price, date }
// This creates a Booking with serviceType='flight' and stores full details in details field

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res) => {
  try {
    const { serviceType, serviceId, date, price, details, passengers } = req.body;

    // Verify service exists
    const Model = getModel(serviceType);
    if (!Model) return res.status(400).json({ message: 'Invalid service type' });

    const service = await Model.findById(serviceId);
    if (!service) return res.status(404).json({ message: 'Service not found' });

    const booking = new Booking({
      userId: req.user._id,
      serviceType,
      serviceId,
      date,
      price,
      passengers: passengers || 1,
      details: details || service.toObject(),
      status: 'pending' // pending until payment
    });

    const createdBooking = await booking.save();
    res.status(201).json(createdBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user bookings
// @route   GET /api/bookings/mybookings
// @access  Private
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id }).sort('-createdAt');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update booking (cancel)
// @route   PUT /api/bookings/:id/cancel
// @access  Private
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.userId.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
      return res.status(401).json({ message: 'Not authorized' });
    }

    booking.status = 'cancelled';
    await booking.save();
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create simple booking (direct from frontend) - supports all service types
// @route   POST /api/book
// @access  Private
const createSimpleBooking = async (req, res) => {
  try {
    console.log('🔖 Received booking request:', req.body);
    const {
      serviceType,
      price,
      date,
      details,
      passengers
    } = req.body;

    // Validate required fields
    if (!serviceType || !price) {
      console.log('❌ Missing required fields:', { serviceType, price });
      return res.status(400).json({ message: 'Missing required booking details (serviceType and price)' });
    }

    // Create booking with flexible details
    const booking = new Booking({
      userId: req.user._id,
      serviceType, // e.g., 'hotel', 'flight', 'train', 'cab', 'package', 'tour'
      serviceId: null, // No reference to service model since we're storing details directly
      date: date ? new Date(date) : new Date(),
      price,
      passengers: passengers || 1,
      details: details || {}, // Store all service-specific data (name, location, etc.)
      status: 'confirmed' // auto-confirm for simplicity
    });

    const createdBooking = await booking.save();
    console.log('✅ Booking created:', createdBooking._id, 'type:', serviceType, 'title:', details?.name || details?.title || 'no title');
    res.status(201).json({
      success: true,
      message: 'Booking confirmed!',
      booking: createdBooking
    });
  } catch (error) {
    console.error('❌ Booking error:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  cancelBooking,
  createSimpleBooking
};
