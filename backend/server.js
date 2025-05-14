const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');

dotenv.config();
connectDB(); // DB connection setup
const fs = require('fs');
const path = require('path');

const uploadPath = path.join(__dirname, 'uploads');

// Create the uploads directory if it doesn't exist
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

const app = express();
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse incoming JSON

app.use('/api', authRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to Freelance Platform API');
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server started on port ${port}`));
