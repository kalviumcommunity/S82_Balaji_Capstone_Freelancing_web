import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './signup.css';

function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'freelancer', // Default role
  });

  const [loading, setLoading] = useState(false); // For showing loading state
  const [error, setError] = useState(''); // For displaying error messages
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true); // Show loading state
    setError(''); // Reset any previous errors
    console.log("Signup initiated with:", formData);

    try {
      const res = await fetch('http://localhost:5000/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      console.log("Server response:", data);

      if (res.ok) {
        alert('Signup successful!');

        if (data && data.token && data.user) {
          // Store JWT token and user in localStorage
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
        }

        // Redirect based on role
        if (formData.role === 'freelancer') {
          console.log("Redirecting to /assignment");
          navigate('/ass');  // Make sure '/assignment' is correct
        } else if (formData.role === 'recruiter') {
          console.log("Redirecting to /recruiter-dashboard");
          navigate('/recruiter-dashboard');  // Make sure this route is correct
        }
      } else {
        setError(data.message || 'Signup failed');
      }
    } catch (error) {
      console.error("Signup error:", error);
      setError('Something went wrong during signup');
    } finally {
      setLoading(false); // Stop loading state
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2>Create Your Account</h2>
        {error && <div className="error-message">{error}</div>}  {/* Error message display */}
        
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
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="freelancer">Freelancer</option>
            <option value="recruiter">Recruiter</option>
          </select>
          <button type="submit" disabled={loading}>
            {loading ? 'Signing Up...' : 'Join Now'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <a href="/login">Log In</a>
        </p>
      </div>
    </div>
  );
}

export default Signup;
