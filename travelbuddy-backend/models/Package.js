const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  originalPrice: {
    type: Number,
    default: null,
  },
  rating: {
    type: Number,
    required: true,
    default: 0,
  },
  reviews: {
    type: Number,
    default: 0,
  },
  duration: {
    type: String,
    required: true, // e.g., "4 Days / 3 Nights"
  },
  highlights: {
    type: [String],
    default: [],
  },
  type: {
    type: String, // e.g., "Leisure", "Adventure", "Heritage"
    default: 'Leisure',
  },
  image: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
  includes: {
    type: [String],
    default: [], // What's included: Hotel Stay, Transfers, Meals, etc.
  }
}, {
  timestamps: true,
});

const Package = mongoose.model('Package', packageSchema);
module.exports = Package;
