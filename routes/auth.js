const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const path = require('path');
const router = express.Router();

/* ===========================
   Serve Login Page
=========================== */
router.get('/', (req, res) => {
  const file = path.resolve(__dirname, '..', 'views', 'login.html');
  return res.sendFile(file); // Sends login.html from views directory
});

/* ===========================
   Serve Profile Page
=========================== */
router.get('/profile', (req, res) => {
  const file = path.resolve(__dirname, '..', 'public', 'profile.html');
  return res.sendFile(file); // Sends profile.html from public directory
});

/* ===========================
   Handle User Login
=========================== */
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Find user by username
  const user = await User.findOne({ username });

  // Validate credentials
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).send('Invalid credentials');
  }

  // Generate JWT token
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

  // Redirect to profile page with token in query string
  res.redirect(`/profile?token=${token}`);
});

/* ===========================
   Fetch User Profile Data
=========================== */
router.post('/getUser', async (req, res) => {
  const { token } = req.body;

  // Reject if token is missing
  if (!token) return res.status(401).send('Missing token');

  try {
    // Verify token and extract user ID
    const { id } = jwt.verify(token, process.env.JWT_SECRET);

    // Find user by ID
    const user = await User.findById(id);
    if (!user) return res.status(404).send('User not found');

    // Return user profile data
    res.json({
      username: user.username,
      email: user.email,
      phone: user.phone,
      dob: user.dob
    });
  } catch (err) {
    res.status(401).send('Invalid token');
  }
});

/* ===========================
   Update User Profile
=========================== */
router.post('/update', async (req, res) => {
  const { email, phone, dob } = req.body;

  // Extract token from Authorization header or body
  const header = req.get('Authorization') || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : req.body.token;

  // Reject if token is missing
  if (!token) return res.status(401).send('Missing token');

  try {
    // Verify token and extract user ID
    const { id } = jwt.verify(token, process.env.JWT_SECRET);

    // Update user profile fields
    await User.findByIdAndUpdate(id, { email, phone, dob });

    res.send('Profile updated');
  } catch (err) {
    res.status(401).send('Invalid token');
  }
});

/* ===========================
   Serve Registration Page
=========================== */
router.get('/register', (req, res) => {
  const file = path.resolve(__dirname, '..', 'views', 'register.html');
  return res.sendFile(file); // Sends register.html from views directory
});

/* ===========================
   Handle User Registration
=========================== */
router.post('/register', async (req, res) => {
  try {
    const { username, password, email } = req.body;

    // Check if username is already taken
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).send('Username already exists');
    }

    // Create and save new user
    const user = new User({ username, password, email: email || '' });
    await user.save();

    // Generate JWT token for immediate login
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    // Redirect to profile page with token
    res.redirect(`/profile?token=${token}`);
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).send('Registration failed');
  }
});

module.exports = router;

const bcrypt = require('bcryptjs');

const isMatch = await bcrypt.compare(password, user.password);