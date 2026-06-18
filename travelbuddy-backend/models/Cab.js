const mongoose = require('mongoose');

const cabSchema = new mongoose.Schema({
  pickup: {
    type: String,
    required: true,
  },
  drop: {
    type: String,
    required: true,
  },
  cabType: {
    type: String,
    enum: ['Mini', 'Sedan', 'SUV'],
    required: true,
  },
  distance: {
    type: Number, // in km
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  driverName: {
    type: String,
    default: 'TravelBuddy Diver',
  },
  carModel: {
    type: String,
    default: 'Standard',
  }
}, {
  timestamps: true,
});

const Cab = mongoose.model('Cab', cabSchema);
module.exports = Cab;
