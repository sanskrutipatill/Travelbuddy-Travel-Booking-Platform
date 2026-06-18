const Flight = require('../models/Flight');
const Hotel = require('../models/Hotel');
const Train = require('../models/Train');
const Cab = require('../models/Cab');
const Package = require('../models/Package');
const User = require('../models/User');
const Booking = require('../models/Booking');

// @desc    Get Admin Overview Stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getOverviewStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalBookings = await Booking.countDocuments();
    
    // Calculate total revenue from confirmed bookings
    const bookings = await Booking.find({ status: 'confirmed' });
    const revenue = bookings.reduce((acc, curr) => acc + curr.price, 0);

    const serviceCounts = {
      flights: await Flight.countDocuments(),
      hotels: await Hotel.countDocuments(),
      trains: await Train.countDocuments(),
      cabs: await Cab.countDocuments(),
      packages: await Package.countDocuments(),
    };

    res.json({ totalUsers, totalBookings, revenue, serviceCounts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Generic CRUD handlers to save code
const getModel = (type) => {
  switch (type) {
    case 'flight': return Flight;
    case 'hotel': return Hotel;
    case 'train': return Train;
    case 'cab': return Cab;
    case 'package': return Package;
    default: return null;
  }
};

// @desc    Add a service
// @route   POST /api/admin/service/:type
// @access  Private/Admin
const addService = async (req, res) => {
  const Model = getModel(req.params.type);
  if (!Model) return res.status(400).json({ message: 'Invalid service type' });

  try {
    const newService = await Model.create(req.body);
    res.status(201).json(newService);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a service
// @route   PUT /api/admin/service/:type/:id
// @access  Private/Admin
const updateService = async (req, res) => {
  const Model = getModel(req.params.type);
  if (!Model) return res.status(400).json({ message: 'Invalid service type' });

  try {
    const updatedService = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedService) return res.status(404).json({ message: 'Service not found' });
    res.json(updatedService);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a service
// @route   DELETE /api/admin/service/:type/:id
// @access  Private/Admin
const deleteService = async (req, res) => {
  const Model = getModel(req.params.type);
  if (!Model) return res.status(400).json({ message: 'Invalid service type' });

  try {
    const deletedService = await Model.findByIdAndDelete(req.params.id);
    if (!deletedService) return res.status(404).json({ message: 'Service not found' });
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all bookings for admin
// @route   GET /api/admin/bookings
// @access  Private/Admin
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate('userId', 'name email').sort('-createdAt');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update booking status
// @route   PUT /api/admin/bookings/:id/status
// @access  Private/Admin
const updateBookingStatus = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    
    booking.status = req.body.status;
    await booking.save();
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getOverviewStats,
  addService,
  updateService,
  deleteService,
  getAllBookings,
  updateBookingStatus
};
