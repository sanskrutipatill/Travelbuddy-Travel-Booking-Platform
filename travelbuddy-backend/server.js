const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/db');
const { protect } = require('./middleware/authMiddleware');
const { createSimpleBooking } = require('./controllers/bookingController');

// Load env FIRST
dotenv.config();

// Connect DB
connectDB();

//INIT APP
const app = express();

console.log("SERVER STARTING...");

// MIDDLEWARE
app.use((req, res, next) => {
  console.log(` ${req.method} ${req.path} ${req.url}`);
  next();
});
app.use(express.json());
app.use(morgan('dev'));

app.use(cors({
  origin: [
    'http://localhost:5174',
    'http://127.0.0.1:5174',
    'http://localhost:5173' // also allow frontend dev server
  ],
  credentials: true
}));

// ROUTES IMPORT
const authRoutes = require('./routes/authRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const adminRoutes = require('./routes/adminRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

console.log(' Routes loaded: auth, service, admin, booking, payment');

//  ROUTES
app.use('/api/auth', authRoutes);
app.use('/api', serviceRoutes); // Mount directly at /api/flights, /api/hotels, etc.
app.use('/api/admin', adminRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);

// ✅ SIMPLE BOOKING ROUTE (direct /api/book)
app.post('/api/book', protect, (req, res, next) => {
  console.log('👉 POST /api/book hit');
  createSimpleBooking(req, res, next);
});

// ✅ TEST ROUTE
app.get('/', (req, res) => {
  res.send('TravelBuddy API is running...');
});

// ✅ BOOKING TEST ROUTE (public for testing)
app.get('/api/book/test', (req, res) => {
  res.json({ message: 'Booking API works', routes: { POST: '/api/book' } });
});

// ✅ 404 HANDLER (FIXED — NO '*')
app.use((req, res) => {
  console.log("❌ UNKNOWN ROUTE:", req.originalUrl);
  res.status(404).json({ message: 'Route not found' });
});

// ✅ ERROR HANDLER
app.use((err, req, res, next) => {
  console.error("🔥 SERVER ERROR:", err);
  res.status(500).json({ message: 'Internal Server Error' });
});

// ✅ START SERVER
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});