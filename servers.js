// Import required modules
const express = require('express');           // Web framework for building APIs
const mongoose = require('mongoose');         // ODM for MongoDB
const dotenv = require('dotenv');             // Loads environment variables from .env file
const authRoutes = require('./routes/auth');  // Import authentication routes
const path = require('path');                 // Utility for handling file paths

// Load environment variables from .env
dotenv.config();

// Initialize Express app
const app = express();

// Middleware to parse incoming JSON requests
app.use(express.json());

// Middleware to parse URL-encoded data (e.g., form submissions)
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Connect to MongoDB using credentials from .env
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');

    // Mount authentication routes at the root path
    app.use('/', authRoutes);

    // Start the server on port 3000
    app.listen(3000, () => console.log('Server running on http://localhost:3000'));
  })
  .catch((err) => {
    // Log connection error and exit the process
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
  });