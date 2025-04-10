import React, { useState } from 'react';
import './signup.css';

function Signup() {
  const [role, setRole] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // 1: signup form, 2: otp

  const handleSignupSubmit = async (e) => {
    e.preventDefault();

    if (!role) {
      alert("Please select a role: Freelancer or Recruiter");
      return;
    }

    try {
      const res = await fetch('http://localhost:5888/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await res.json();

      if (res.ok) {
        alert(data.message); // e.g. "OTP sent to email."
        setOtpSent(true);
        setStep(2);
      } else {
        alert(data.message || "Failed to send OTP");
      }
    } catch (err) {
      console.error("Error sending OTP:", err);
      alert("Something went wrong. Please try again.");
    }
  };

  const handleOtpVerify = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:5888/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: formData.email, otp }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("OTP Verified! 🎉 Signup Successful.");

        // ✅ Send final data to your user creation route here
        // await fetch('/signup', { method: 'POST', body: JSON.stringify({ ...formData, role }) })

        // Optionally redirect to login/dashboard
      } else {
        alert(data.message || "Invalid OTP");
      }
    } catch (err) {
      console.error("OTP Verification Error:", err);
      alert("Something went wrong");
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2>Join Our Platform</h2>
        <p>Select your role to get started</p>

        <div className="role-selector">
          <button
            className={role === 'freelancer' ? 'active' : ''}
            onClick={() => setRole('freelancer')}
          >
            Freelancer
          </button>
          <button
            className={role === 'recruiter' ? 'active' : ''}
            onClick={() => setRole('recruiter')}
          >
            Recruiter
          </button>
        </div>

        {step === 1 && (
          <form onSubmit={handleSignupSubmit} className="signup-form">
            <label>Full Name</label>
            <input
              type="text"
              required
              placeholder="Balaji"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />

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

            <label>Phone Number</label>
            <input
              type="tel"
              required
              placeholder="+91 8125678935"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />

            <button
              type="submit"
              className="submit-btn"
              disabled={!formData.name || !formData.email || !formData.phone || !role}
            >
              Sign Up
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleOtpVerify} className="otp-form">
            <label>Enter OTP sent to your email</label>
            <input
              type="text"
              required
              maxLength={6}
              placeholder="123456"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button type="submit" className="submit-btn">Verify OTP & Complete Signup</button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Signup;
