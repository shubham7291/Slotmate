

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define the schema
const userSchema = new mongoose.Schema({
  // Phone number with 10-digit validation and uniqueness
  phoneNumber: {
    type: String,
    required: [true, 'Phone number is required'],
    unique: true, // Ensures no duplicate phone numbers
    match: [/^[0-9]{10}$/, 'Please provide a valid phone number'], // Validates the phone number format
    trim: true, // Trims any extra spaces before or after the phone number
  },
  
  // Email with basic validation and uniqueness
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true, // Ensures no duplicate email addresses
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'], // Email validation pattern
  },
  
  // Password validation and hashing
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
  },
  
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

// Password hashing middleware: Hash password before saving user to DB
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);  // Generate salt
    this.password = await bcrypt.hash(this.password, salt); // Hash the password
    next(); // Proceed with saving the user
  } catch (error) {
    next(error); // If error occurs, pass it to next middleware (or error handler)
  }
});

// Password comparison method: To verify password during login
userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password); // Compares the entered password with the hashed password
};

// Indexes for optimization (for faster lookups)
userSchema.index({ email: 1 }, { unique: true }); // Index to optimize email lookups
userSchema.index({ phoneNumber: 1 }, { unique: true }); // Index to optimize phone number lookups

// Create and export the model
const User = mongoose.model('User', userSchema);
module.exports = User;
