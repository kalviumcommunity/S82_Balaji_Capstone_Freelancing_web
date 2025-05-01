const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['freelancer', 'recruiter'], default: 'freelancer' },
  isVerified: { type: Boolean, default: false },

  // Reference to Project collection
  assignedProject: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' }, // Reference to Project model
});

module.exports = mongoose.model('User', userSchema);
