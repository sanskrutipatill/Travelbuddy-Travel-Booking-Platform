const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Booking',
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['Success', 'Failed', 'Pending'],
    default: 'Pending',
  },
  transactionId: {
    type: String,
    default: () => 'TXN' + Math.floor(Math.random() * 1000000000),
  }
}, {
  timestamps: true,
});

const Payment = mongoose.model('Payment', paymentSchema);
module.exports = Payment;
