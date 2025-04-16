const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  deadline: { type: Date, required: true }, // Store the deadline as a date
});

module.exports = mongoose.model('Project', projectSchema);
