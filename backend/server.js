const express = require('express');
const cors = require('cors');
// const nodemailer = require('nodemailer');
// const otpGenerator = require('otp-generator');

const otpRoutes = require('./routes/otp');
const app = express();
require('dotenv').config();
const connectDB = require('./config/db');
connectDB();
app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/otp', otpRoutes);
app.get('/', (req, res) => {
  res.send('Welcome to Freelance Platform API');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
