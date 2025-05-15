const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  deadlineDays: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  createdBy: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User',
  required: true
}

});

module.exports = mongoose.model('Project', projectSchema);
