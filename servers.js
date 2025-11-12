/*
  servers.js
  - Application entrypoint for the User Profile app
  - Responsibilities:
    * Load configuration from environment (.env)
    * Configure Express middleware and static file serving
    * Connect to MongoDB via Mongoose
    * Mount route handlers (authentication/profile)
    * Start HTTP server and expose a /health endpoint

  Environment variables used:
    - MONGO_URI : MongoDB connection string
    - PORT      : Port to listen on (defaults to 3000)
    - NODE_ENV  : 'production' toggles secure cookie behavior

  Keep this file small: move business logic into route modules
*/
const express = require('express');           // Web framework for building APIs
const mongoose = require('mongoose');         // ODM for MongoDB
const dotenv = require('dotenv');             // Loads environment variables from .env file
const authRoutes = require('./routes/auth');  // Import authentication routes
const path = require('path');                 // Utility for handling file paths
const cookieParser = require('cookie-parser'); // Parse cookies for HttpOnly token

// Load environment variables from .env
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse incoming JSON requests
app.use(express.json());

// Parse cookies (for HttpOnly JWT cookie)
app.use(cookieParser());

// Middleware to parse URL-encoded data (e.g., form submissions)
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// Connect to MongoDB using credentials from .env
console.log('Connecting to MongoDB:', process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('✓ Connected to MongoDB successfully');

    // Mount authentication routes at the root path
    app.use('/', authRoutes);

    // Start the server on dynamic port
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`✓ Server running on http://localhost:${PORT}`);
      console.log(`✓ Health check: http://localhost:${PORT}/health`);
    });

    // Handle port already in use error
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`✗ Port ${PORT} is already in use`);
        process.exit(1);
      }
    });
  })
  .catch((err) => {
    // Log connection error with more details
    console.error('✗ Failed to connect to MongoDB');
    console.error('Error details:', err.message);
    console.error('Connection string:', process.env.MONGO_URI);
    process.exit(1);
  });