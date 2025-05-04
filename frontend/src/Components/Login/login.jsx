import React, { useState } from 'react';
import './login.css';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      // Check if the response is valid JSON
      let data;
      try {
        data = await res.json();
      } catch (err) {
        console.error('Error parsing response JSON:', err);
        alert('Failed to process the response. Please try again.');
        return;
      }

      if (!res.ok) {
        alert(data.error || 'Login failed');
        return;
      }

      // Check if user exists and if they have the correct role
      if (data && data.user) {
        const user = data.user;
        if (user.role === 'freelancer') {
          if (user.assignedProject && user.assignedProject.status === 'passed') {
            // Redirect to freelancer dashboard if project status is 'passed'
            navigate('/freelancer-dashboard');
          } else {
            // Otherwise, redirect to submission page
            navigate('/submission');
          }
        } else if (user.role === 'recruiter') {
          // Redirect to recruiter dashboard if role is 'recruiter'
          navigate('/recruiter-dashboard');
        } else {
          // If the role is neither freelancer nor recruiter
          alert('Unknown role');
        }
      } else {
        alert('Failed to find user data');
      }
    } catch (err) {
      console.error('Login error:', err);
      alert('Something went wrong');
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2>Welcome Back</h2> 
        <form onSubmit={handleLogin} className="auth-form">
          <input
            name="email"
            type="email"
            placeholder="Email Address"
            onChange={handleChange}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />
          <button type="submit">Log In</button>
        </form>

        <p className="auth-footer">
          <a href="/forgot-password">Forgot Password?</a>
        </p>

        <p className="auth-footer">
          New to the platform? <a href="/signup">Join Now</a>
        </p>
      </div>
    </div>
  );
}

export default Login;
