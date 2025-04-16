import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './signup.css';

function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'freelancer', // Default role set to 'freelancer'
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSignup = async (e) => {
    e.preventDefault();
    console.log("Signup initiated with:", formData);
  
    try {
      const res = await fetch('http://localhost:5000/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      const data = await res.json(); // Now parse the response as JSON
      console.log("Server response:", data);
  
      if (res.ok) {
        alert('Signup successful!');
        localStorage.setItem('token', data.token); // Store the token from the response
        localStorage.setItem('userEmail', formData.email);
  
        // Redirect based on role
        if (formData.role === 'freelancer') {
          navigate('/assignment');  // Redirect to assignment page if freelancer
        } else if (formData.role === 'recruiter') {
          navigate('/recruiter-dashboard');  // Redirect to recruiter dashboard if recruiter
        }
      } else {
        alert(data.message || 'Signup failed');
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert('Something went wrong during signup');
    }
  };
  
  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2>Create Your Account</h2>
        <form onSubmit={handleSignup} className="auth-form">
          <input
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            value={formData.name}
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email Address"
            onChange={handleChange}
            value={formData.email}
            required
          />
          <input
            name="phone"
            placeholder="Phone Number"
            onChange={handleChange}
            value={formData.phone}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            value={formData.password}
            required
          />

          {/* Role selection */}
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="freelancer">Freelancer</option>
            <option value="recruiter">Recruiter</option>
          </select>

          <button type="submit">Join Now</button>
        </form>
        <p className="auth-footer">
          Already have an account? <a href="/login">Log In</a>
        </p>
      </div>
    </div>
  );
}

export default Signup;
