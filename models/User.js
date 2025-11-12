// Import the Mongoose library for MongoDB object modeling
const mongoose = require('mongoose');

// Import bcrypt for hashing passwords securely
const bcrypt = require('bcryptjs');

// Define the schema for a User document in MongoDB
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true, // Ensure usernames are unique
    trim: true
  },
  password: {
    type: String,
    required: true // Password is mandatory
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensure emails are unique
    match: /.+\@.+\..+/ // Basic email format validation
  },
  phone: {
    type: String
  },
  dob: {
    type: Date
  }
});

// Pre-save middleware to hash the password before saving the user document
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    try {
      this.password = await bcrypt.hash(this.password, 10); // Hash with salt rounds
    } catch (err) {
      return next(err); // Pass error to Mongoose
    }
  }
  next(); // Proceed with save
});

// Instance method to compare a candidate password with the hashed one
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Export the User model so it can be used in other parts of the application
module.exports = mongoose.model('User', userSchema);