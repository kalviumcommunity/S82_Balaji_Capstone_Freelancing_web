import React, { useState } from 'react';
import './verify.css';
function OtpVerification() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:5888/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("OTP Verified! 🎉");
        // You can redirect to dashboard or password setup here
      } else {
        alert(data.message || "Invalid OTP");
      }

    } catch (err) {
      console.error("Error verifying OTP:", err);
      alert("Something went wrong");
    }
  };

  return (
    <div className="otp-container">
      <div className="otp-box">
        <h2>Verify OTP</h2>
        <form onSubmit={handleSubmit} className="otp-form">
          <label>Email Address</label>
          <input
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Enter OTP</label>
          <input
            type="text"
            required
            maxLength={6}
            placeholder="123456"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />

          <button type="submit" className="submit-btn">Verify OTP</button>
        </form>
      </div>
    </div>
  );
}

export default OtpVerification;
