const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const router = express.Router();

// Signup Route
router.post('/signup', async (req, res) => {
  const { phoneNumber, email, password } = req.body;

  // Check if phone number or email already exists
  const userExists = await User.findOne({ $or: [{ phoneNumber }, { email }] });
  if (userExists) {
    return res.status(400).json({ message: 'User with this phone number or email already exists' });
  }

  // Create a new user with phoneNumber
  const newUser = new User({ phoneNumber, email, password });
  try {
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error registering user' });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  const {email, password } = req.body;

  // Check if the user exists by either phone number or email
  const user = await User.findOne( { email });
  if (!user) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  // Compare password
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  // Generate JWT with phoneNumber instead of userId
  const token = jwt.sign({ phoneNumber: user.phoneNumber }, process.env.JWT_SECRET, { expiresIn: '1h' });

  // Return the phone number and token in the response
  res.json({ message: 'Login successful', token, phoneNumber: user.phoneNumber });
});

// Protected Route (Dashboard)
router.get('/dashboard', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]; // Get token from header
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Verify token and extract the phone number from the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ message: 'Welcome to the Dashboard!', phoneNumber: decoded.phoneNumber });
  } catch (error) {
    res.status(400).json({ message: 'Invalid token' });
  }
});

// Route to validate pincode
router.post('/validate-pincode', async (req, res) => {
  const { pincode } = req.body;

  if (!pincode) {
      return res.status(400).json({ error: 'Pincode is required' });
  }

  try {
      // Forward the request to the Flask backend
      const flaskResponse = await axios.post('http://localhost:5000/validate_pincode', { pincode });
      res.status(flaskResponse.status).json(flaskResponse.data);
  } catch (error) {
      res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

module.exports = router;
