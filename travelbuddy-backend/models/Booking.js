const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  serviceType: {
    type: String,
    required: true,
    enum: ['flight', 'hotel', 'train', 'cab', 'package', 'tour', 'destination'],
  },
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    required: false, // Not required for simple bookings where details are stored directly
  },
  date: {
    type: Date,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['confirmed', 'cancelled', 'pending'],
    default: 'pending',
  },
  passengers: {
    type: Number,
    default: 1,
  },
  details: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  } // Generic mixed field to store snapshot of the booking details at time of booking
}, {
  timestamps: true,
});

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;
