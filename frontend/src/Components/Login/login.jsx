import React, { useState } from 'react';
import './login.css';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // 1 = credentials, 2 = otp

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Step 1: Send OTP after credentials are entered
      const res = await fetch('http://localhost:5888/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("OTP sent to your email 📩");
        setOtpSent(true);
        setStep(2);
      } else {
        alert(data.message || "Failed to send OTP");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Something went wrong while sending OTP");
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:5888/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, otp }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("OTP Verified! 🎉 You are logged in.");
        // Redirect to dashboard or store JWT here
      } else {
        alert(data.message || "Invalid OTP");
      }
    } catch (err) {
      console.error("OTP Verification Error:", err);
      alert("Something went wrong");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Welcome Back</h2>
        <p>Login to your account</p>

        {step === 1 && (
          <form onSubmit={handleLogin} className="login-form">
            <label>Email Address</label>
            <input
              type="email"
              required
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />

            <label>Password</label>
            <input
              type="password"
              required
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />

            <button type="submit" className="login-btn">
              Send OTP
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="otp-form">
            <label>Enter OTP</label>
            <input
              type="text"
              required
              maxLength={6}
              placeholder="123456"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />

            <button type="submit" className="login-btn">
              Verify OTP & Login
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Login;
