const Payment = require('../models/Payment');
const Booking = require('../models/Booking');

// @desc    Simulate Payment Processing
// @route   POST /api/payments/pay
// @access  Private
const processPayment = async (req, res) => {
  try {
    console.log('💳 Processing payment:', req.body);
    const { bookingId, amount, paymentMethod } = req.body;

    // Support both ObjectId and string bookingId
    let booking;
    try {
      booking = await Booking.findById(bookingId);
    } catch (err) {
      console.error('❌ Error finding booking:', err);
    }

    if (!booking) {
      console.log('❌ Booking not found:', bookingId);
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Simulate payment logic (80% success rate)
    const isSuccess = Math.random() < 0.8;

    const payment = new Payment({
      bookingId,
      amount,
      status: isSuccess ? 'Success' : 'Failed'
    });

    const createdPayment = await payment.save();
    console.log('✅ Payment created:', createdPayment._id);

    if (isSuccess) {
      booking.status = 'confirmed';
      await booking.save();
      console.log('✅ Booking confirmed:', booking._id);
    }

    res.status(201).json(createdPayment);
  } catch (error) {
    console.error('❌ Payment processing error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's own payments
// @route   GET /api/payments/my-payments
// @access  Private
const getMyPayments = async (req, res) => {
  try {
    console.log('🔍 Fetching payments for user:', req.user._id);

    // Find payments where booking belongs to the current user
    let payments = await Payment.find()
      .populate({
        path: 'bookingId',
        match: { userId: req.user._id },
        select: 'serviceType title details createdAt',
      })
      .sort('-createdAt');

    // Filter out any payments that didn't match (shouldn't happen but safety)
    let userPayments = payments.filter(p => p.bookingId);

    // Add computed displayTitle to each payment's booking
    userPayments = userPayments.map(payment => {
      const booking = payment.bookingId;
      let displayTitle = 'Unknown Booking';

      if (booking) {
        // Try to get a meaningful title from various sources
        displayTitle =
          booking.title ||
          booking.details?.name ||
          booking.details?.title ||
          booking.details?.hotelName ||
          booking.details?.airline ||
          (booking.details?.source && booking.details?.destination
            ? `${booking.details.source} → ${booking.details.destination}`
            : null) ||
          (booking.details?.pickup && booking.details?.drop
            ? `${booking.details.pickup} → ${booking.details.drop}`
            : null) ||
          booking.serviceType ||
          'Unknown Booking';
      }

      // Return payment with enhanced booking object
      return {
        ...payment.toObject(),
        bookingId: {
          ...booking.toObject(),
          displayTitle,
        }
      };
    });

    // If no payments in database, return empty array (no error)
    if (!userPayments || userPayments.length === 0) {
      console.log(`📭 No payments found for user ${req.user._id}, returning empty array`);
      userPayments = [];
    }

    console.log(`✅ Returned ${userPayments.length} payments for user ${req.user._id}`);
    res.json(userPayments);
  } catch (error) {
    console.error('❌ Error fetching my payments:', error);
    // Return empty array instead of error to prevent frontend crash
    res.status(500).json({ message: error.message, payments: [] });
  }
};

// @desc    Get all payments (Admin)
// @route   GET /api/payments
// @access  Private/Admin
const getPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate({
        path: 'bookingId',
        populate: { path: 'userId', select: 'name email' }
      })
      .sort('-createdAt');
    res.json(payments);
  } catch (error) {
    console.error('❌ Error fetching all payments:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  processPayment,
  getMyPayments,
  getPayments
};
