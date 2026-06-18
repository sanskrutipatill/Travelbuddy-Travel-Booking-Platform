const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
  name: {
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
  amenities: {
    type: [String],
    default: [],
  },
  propertyType: {
    type: String,
    enum: ['Hotel', 'Villa', 'Resort', 'Apartment', 'Boutique', 'Guest House'],
    default: 'Hotel',
  },
  imageUrl: {
    type: String,
    default: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
  image: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  }
}, {
  timestamps: true,
});

const Hotel = mongoose.model('Hotel', hotelSchema);
module.exports = Hotel;
