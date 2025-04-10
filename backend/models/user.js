// models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  occupation: { type: String, enum: ['freelancer', 'recruiter'], required: true },
});

module.exports = mongoose.model('user', UserSchema);
