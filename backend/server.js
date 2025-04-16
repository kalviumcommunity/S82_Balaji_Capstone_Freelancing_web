const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');  // Import the auth routes

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Register the routes
app.use('/api', authRoutes); // Register auth routes

app.get('/', (req, res) => {
  res.send('Welcome to Freelance Platform API');
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server started on port ${port}`));
