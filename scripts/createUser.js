const mongoose = require('mongoose');
// ⚠️ Do not import bcrypt here — password hashing is handled by the User model's pre-save hook
const dotenv = require('dotenv');
const User = require('../models/User');

// ✅ Load environment variables from .env file
dotenv.config();

async function main() {
  // ✅ Extract command-line arguments: node scripts/createUser.js <username> <password> [email]
  const [,, username, password, email] = process.argv;

  // ❌ Exit if required arguments are missing
  if (!username || !password) {
    console.error('Usage: node scripts/createUser.js <username> <password> [email]');
    process.exit(1);
  }

  // ✅ Connect to MongoDB using URI from environment variables
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  // ✅ Create new user instance (password will be hashed by model hook)
  const user = new User({
    username,
    password,
    email: email || '' // Optional email fallback
  });

  // ✅ Save user to database
  await user.save();
  console.log('Created user', username);

  // ✅ Disconnect from MongoDB
  await mongoose.disconnect();
}

// ✅ Run the script and handle any unexpected errors
main().catch(err => {
  console.error(err);
  process.exit(1);
});