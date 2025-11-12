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
// Note: Some managed Node runtimes restrict certain crypto APIs during early middleware execution.
// Avoid using crypto.randomBytes synchronously in generic middleware.
// We'll fall back to a lightweight token generator.

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Validate critical environment variables early to give clear errors
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error('\n✗ Fatal: MONGO_URI is not set. The app cannot connect to MongoDB without a valid connection string.');
  console.error('  - Create a `.env` file based on `.env.example` and set MONGO_URI.');
  console.error('  - Or set the environment variable MONGO_URI before starting the app.');
  console.error('  Example (PowerShell): $env:MONGO_URI = "mongodb+srv://user:pass@cluster0.../dbname"; npm start\n');
  process.exit(1);
}

// Detect obviously-placeholder connection strings and fail with a clear message
// Check for literal angle brackets (e.g., <username>, <password>) which indicate unfilled placeholders
const hasAngleBrackets = MONGO_URI.includes('<') && MONGO_URI.includes('>');
if (hasAngleBrackets) {
  console.error('\n✗ Fatal: MONGO_URI appears to contain placeholder values.');
  console.error('  - The connection string in your .env has unfilled placeholders like <username> or <password>.');
  console.error('  - Open `.env` and replace these with your actual Atlas credentials.');
  console.error('  - To use a local MongoDB instead, set MONGO_URI=mongodb://localhost:27017/user-profile-app');
  console.error('  Example (PowerShell): $env:MONGO_URI = "mongodb+srv://<dbUser>:<dbPass>@cluster0.xxxxx.mongodb.net/user-profile-app?retryWrites=true&w=majority"\n');
  process.exit(1);
}

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Lightweight non-cryptographic token to avoid runtime crypto issues on some platforms.
// For true CSRF protection, integrate a dedicated CSRF library (e.g., csurf) with a proper secret.
app.use((req, res, next) => {
  try {
    // Use Web Crypto if available, otherwise fallback to a timestamp-based token.
    const token = (globalThis.crypto && globalThis.crypto.randomUUID)
      ? globalThis.crypto.randomUUID().replace(/-/g, '')
      : (Date.now().toString(36) + Math.random().toString(36).slice(2));
    res.locals.csrfToken = token;
    res.cookie('csrfToken', token, { httpOnly: false, sameSite: 'lax' });
  } catch (e) {
    // Final fallback
    const token = (Date.now().toString(36) + Math.random().toString(36).slice(2));
    res.locals.csrfToken = token;
    res.cookie('csrfToken', token, { httpOnly: false, sameSite: 'lax' });
  }
  next();
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});


console.log('Connecting to MongoDB:', MONGO_URI);

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  // Note: MongoDB Atlas URIs (mongodb+srv://) automatically enforce TLS/SSL encryption
  .then(() => {
    console.log('✓ Connected to MongoDB successfully');
    app.use('/', authRoutes);
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`✓ Server running on http://localhost:${PORT}`);
      console.log(`✓ Health check: http://localhost:${PORT}/health`);
    });
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`✗ Port ${PORT} is already in use`);
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
