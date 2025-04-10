const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const otpGenerator = require('otp-generator');

let otpStore = {}; // Temporary storage

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,  // your@gmail.com
    pass: process.env.EMAIL_PASS,  // your App Password (not Gmail password!)
  },
});

// Generate and send OTP
router.post('/send-otp', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const otp = otpGenerator.generate(6, {
    digits: true,
    
    upperCaseAlphabets: false,
    specialChars: false,
  });

  otpStore[email] = otp;
  console.log(`Generated OTP for ${email}: ${otp}`);

  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is: ${otp}`,
    });

    console.log(`✅ Email sent to ${email}: ${info.response}`);
    res.json({ message: "OTP sent to email." });
  } catch (err) {
    console.error("❌ Failed to send email:", err.message);
    res.status(500).json({ message: "Failed to send OTP", error: err.message });
  }
});

// Verify OTP
router.post('/verify-otp', (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ success: false, message: "Email and OTP required" });
  }

  if (otpStore[email] === otp) {
    delete otpStore[email]; // Clear OTP after successful use
    return res.json({ success: true, message: "OTP Verified" });
  }

  res.status(400).json({ success: false, message: "Invalid OTP" });
});

module.exports = router;
