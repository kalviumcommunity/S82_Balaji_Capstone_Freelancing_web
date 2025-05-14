const mongoose = require('mongoose');
const Project = require('../project'); // ✅ Path depends on where your file is
const connectDB = require('../../config/db');
require('dotenv').config();


const projectList = [
  { name: 'Bug Tracker', deadlineDays: 7, description: 'Track bugs with roles, priorities, and comments.' },
  { name: 'E-learning Platform', deadlineDays: 7, description: 'Learning system with educational content upload.' },
  { name: 'Job Board Platform', deadlineDays: 7, description: 'Post/apply to jobs with search and filters.' },
  { name: 'Mini CRM', deadlineDays: 7, description: 'Compact CRM with contact and lead management.' },
  { name: 'File Storage System', deadlineDays: 7, description: 'Secure file uploads and cloud-like access.' },
  { name: 'Freelance Marketplace', deadlineDays: 7, description: 'Post and accept freelance gigs with payments.' },
  { name: 'Chat App', deadlineDays: 7, description: 'Real-time messaging system.' },
  { name: 'Online Voting System', deadlineDays: 7, description: 'Secure and user-friendly online voting.' },
  { name: 'Inventory & Billing System', deadlineDays: 7, description: 'Track stock and generate bills.' },
  { name: 'Event Registration System', deadlineDays: 7, description: 'Event management with registration handling.' }
];

const seedP = async () => {
  try {
    await connectDB();
    await Project.deleteMany(); // Optional: clear old data
    await Project.insertMany(projectList);
    console.log('✅ Projects seeded successfully');
    process.exit(0);
  } catch (err) {
    console.error('❌ Failed to seed projects:', err);
    process.exit(1);
  }
};

seedP();
