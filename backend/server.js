const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const cors = require('cors');
const consignmentRoute = require('./routes/consignmentRoute');
dotenv.config();

// Initialize app
const app = express();
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Body parser

// Connect to MongoDB
connectDB();

// Define routes
app.use('/api/auth', authRoutes);
app.use('/api/consignment', consignmentRoute); // Use the consignment route

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
