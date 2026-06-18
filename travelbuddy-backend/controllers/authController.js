const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'User'
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar || '',
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar || '',
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Logout user / clear session
// @route   POST /api/auth/logout
// @access  Public
const logoutUser = (req, res) => {
  // In a stateless JWT setup, logout is mainly handled client-side.
  // We can just return success or clear a cookie if using cookie-based auth.
  res.status(200).json({ message: 'Logged out successfully' });
};

// @desc    Google OAuth authentication
// @route   POST /api/auth/google
// @access  Public
const googleAuth = async (req, res) => {
  const { id_token } = req.body;

  try {
    // Verify the Google ID token
    const ticket = await googleClient.verifyIdToken({
      idToken: id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const { name, email, picture } = payload;

    // Find user by email
    let user = await User.findOne({ email });

    // If user doesn't exist, create new user with Google data
    if (!user) {
      user = await User.create({
        name,
        email,
        avatar: picture || '',
        password: 'google-auth',
        role: 'User',
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return user data and token
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar || '',
      token,
    });
  } catch (err) {
    console.error('Google auth error:', err);
    res.status(500).json({ message: 'Google login failed' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  googleAuth,
};
