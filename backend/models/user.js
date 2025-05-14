const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true 
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['freelancer', 'recruiter'],
    default: 'freelancer'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  assignedProject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  },
  projectAssignedAt: {
    type: Date
  },
  projectDeadline: {
    type: Date
  },
  submission: {
  githubLink: { type: String, default: null },
  zipUrl: { type: String, default: null },
  submittedAt: { type: Date }
}

});

module.exports = mongoose.model('User', userSchema);
