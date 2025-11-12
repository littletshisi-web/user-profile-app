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
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const path = require('path');
const cookieParser = require('cookie-parser');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

console.log('Connecting to MongoDB:', process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log(' Connected to MongoDB successfully');
    app.use('/', authRoutes);
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log( Server running on http://localhost:);
      console.log( Health check: http://localhost:/health);
    });
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error( Port  is already in use);
        process.exit(1);
      }
    });
  })
  .catch((err) => {
    console.error(' Failed to connect to MongoDB');
    console.error('Error details:', err.message);
    console.error('Connection string:', process.env.MONGO_URI);
    process.exit(1);
  });
