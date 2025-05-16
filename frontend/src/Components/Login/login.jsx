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

      let data;
      try {
        data = await res.json();
      } catch (err) {
        console.error('Error parsing JSON:', err);
        alert('Invalid response from server.');
        return;
      }

      if (!res.ok) {
        alert(data.error || 'Login failed');
        return;
      }

      const { token, user } = data;

      if (!token || !user) {
        alert('Login successful, but user data is missing.');
        return;
      }

      // Store token and user in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      if (user.role === 'freelancer') {
        const hasSubmitted = user.submission && (user.submission.githubLink || user.submission.zipUrl);
        if (hasSubmitted) {
          navigate('/freelancer-dashboard');
        } else {
          navigate('/submission');
        }
      } else if (user.role === 'recruiter') {
        navigate('/recruiter-dashboard');
      } else {
        alert('Unknown user role.');
      }


    } catch (err) {
      console.error('Login error:', err);
      alert('Something went wrong. Please try again.');
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
