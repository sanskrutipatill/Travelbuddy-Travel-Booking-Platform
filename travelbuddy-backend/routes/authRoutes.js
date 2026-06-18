const express = require('express');
const router = express.Router();

// 🔥 DEBUG (confirms file loaded)
console.log("✅ AUTH ROUTES LOADED");

// 🔥 IMPORT CONTROLLERS
const {
  registerUser,
  loginUser,
  logoutUser,
  googleAuth
} = require('../controllers/authController');


// ================= ROUTES =================

// ✅ Register
// POST /api/auth/register
router.post('/register', (req, res, next) => {
  console.log("📌 REGISTER ROUTE HIT");
  next();
}, registerUser);


// ✅ Login
// POST /api/auth/login
router.post('/login', (req, res, next) => {
  console.log("📌 LOGIN ROUTE HIT");
  next();
}, loginUser);


// ✅ Logout
// POST /api/auth/logout
router.post('/logout', (req, res, next) => {
  console.log("📌 LOGOUT ROUTE HIT");
  next();
}, logoutUser);


// ✅ Google Auth (MOST IMPORTANT)
// POST /api/auth/google
router.post('/google', (req, res, next) => {
  console.log("🔥 GOOGLE ROUTE HIT");
  console.log("📦 BODY:", req.body); // see incoming data
  next();
}, googleAuth);

// TEST: Simple catch-all test route
router.post('/test-route', (req, res) => {
  console.log("✅ TEST ROUTE HIT");
  res.json({ success: true, message: 'Test route works' });
});


// ================= EXPORT =================
module.exports = router;