const mongoose = require('mongoose');

const trainSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  trainNumber: {
    type: String,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
  destination: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  class: {
    type: String,
    required: true,
    enum: ['1AC', '2AC', '3AC', 'Sleeper', 'General']
  },
  timing: {
    type: String, // e.g., "10:30 AM - 05:45 PM"
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  // Additional display fields
  departure: {
    type: String, // e.g., "16:25"
  },
  arrival: {
    type: String, // e.g., "08:35"
  },
  duration: {
    type: String, // e.g., "16h 10m"
  },
  stops: {
    type: String, // e.g., "Non-stop", "1 Stop", "2+ Stops"
  },
  type: {
    type: String, // e.g., "Rajdhani", "Shatabdi", "Superfast"
  }
}, {
  timestamps: true,
});

const Train = mongoose.model('Train', trainSchema);
module.exports = Train;
