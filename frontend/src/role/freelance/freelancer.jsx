import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./freelancer.css";

function FreelancerDashboard() {
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const userData = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!token || !userData) {
      navigate('/login');
      return;
    }

    // Fetch fresh user details
    fetch(`http://localhost:5000/api/auth/user/${userData._id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setUser(data))
      .catch(err => console.error('Fetch user error:', err));

    // Fetch projects posted by recruiters
    fetch('http://localhost:5000/api/projects', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setProjects(data.projects || []))
      .catch(err => console.error('Fetch projects error:', err))
      .finally(() => setLoading(false));
  }, [navigate, token, userData]);

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action is irreversible.')) return;

    try {
      const res = await fetch(`http://localhost:5000/api/auth/delete/${user._id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();

      if (res.ok) {
        alert('Account deleted successfully');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/signup');
      } else {
        alert(data.message || 'Failed to delete account');
      }
    } catch (err) {
      console.error('Delete account error:', err);
      alert('Something went wrong while deleting the account');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="freelancer-dashboard">
      <h1>Freelancer Dashboard</h1>

      <section className="user-details">
        <h2>Your Details</h2>
        {user ? (
          <div>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Phone:</strong> {user.phone || 'N/A'}</p>
            <p><strong>Role:</strong> {user.role}</p>
            <button className="delete-account-btn" onClick={handleDeleteAccount}>
              Delete Account
            </button>
          </div>
        ) : (
          <p>User data not found</p>
        )}
      </section>

      <section>
        <h2>Available Projects</h2>
        {projects.length === 0 ? (
          <p>No projects available at the moment</p>
        ) : (
          <ul className="project-list">
            {projects.map(project => (
              <li key={project._id}>
                <strong>{project.name}</strong>
                <p>{project.description || 'No description available'}</p>
                <p><small>Deadline: {project.deadlineDays} days</small></p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="chat-section">
        <h2>Chat</h2>
        <p>Chat functionality coming soon! 
          <button className="chat-btn" onClick={() => alert('Chat page coming soon!')}>
            Open Chat
          </button>
        </p>
      </section>
    </div>
  );
}

export default FreelancerDashboard;
