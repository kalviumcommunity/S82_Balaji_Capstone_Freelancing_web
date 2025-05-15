import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import './recruiter.css';

function RecruiterDashboard() {
  const [user, setUser] = useState({
    name: '',
    profilePic: '',
    _id: '',
  });

  const defaultProfilePic = "https://via.placeholder.com/150";

  const [projectData, setProjectData] = useState({
    title: '',
    description: '',
    budget: '',
    deadline: '',
  });
  
  const [postingStatus, setPostingStatus] = useState(null);
  const [postingError, setPostingError] = useState(null);

  const fileInputRef = useRef(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser({
        name: storedUser.name || 'Recruiter',
        profilePic: storedUser.profilePic || '',
        _id: storedUser._id || '',
      });
    }
  }, []);

  const handleProfilePicClick = () => {
    fileInputRef.current?.click();
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith('image/')) {
      alert('Please select a valid image file.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const newProfilePic = reader.result;

      const updatedUser = { ...user, profilePic: newProfilePic };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));

      try {
        const res = await fetch(`http://localhost:5000/api/users/${user._id}/profile-pic`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ profilePic: newProfilePic }),
        });

        if (!res.ok) {
          throw new Error('Failed to update profile picture in the database');
        }

        const data = await res.json();
        console.log(data.message);
      } catch (err) {
        console.error('Profile picture update failed:', err);
        alert('Profile picture saved locally but failed to update in database.');
      }
    };

    reader.readAsDataURL(file);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProjectData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePostProject = async (e) => {
    e.preventDefault();

    if (
      !projectData.title.trim() ||
      !projectData.description.trim() ||
      !projectData.budget ||
      !projectData.deadline
    ) {
      setPostingError('All fields are required.');
      setPostingStatus(null);
      return;
    }

    setPostingError(null);
    setPostingStatus(null);

    try {
      const response = await fetch('http://localhost:5000/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to post project');
      }

      setPostingStatus('Project posted successfully!');
      setProjectData({
        title: '',
        description: '',
        budget: '',
        deadline: '',
      });
    } catch (err) {
      setPostingError(err.message);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm("Are you sure you want to delete your account? This action is irreversible.");
    if (!confirmed) return;

    if (!user._id) {
      alert("User ID missing. Please log in again.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/users/${user._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to delete account");
      }

      localStorage.removeItem('user');
      alert("Account deleted successfully.");
      window.location.href = "/";
    } catch (error) {
      console.error("Delete error:", error);
      alert(error.message);
    }
  };
 
    const[freelancer,setFreelancer]=useState([]);
    useEffect(() => {
  const fetchFreelancers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/freelancers');
       console.log('Freelancers fetched:', response.data); 
      setFreelancer(response.data);
    } catch (error) {
      console.error('Error fetching freelancers:', error);
    }
  };

  fetchFreelancers();
}, []);

  
  return (
    <>
    <div className="dashboard-container">
      <div className="profile-section">
        <img
          src={user.profilePic || defaultProfilePic}
          alt="Profile"
          className="profile-pic"
          onClick={handleProfilePicClick}
          style={{ cursor: 'pointer' }}
        />
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleProfilePicChange}
          style={{ display: 'none' }}
        />
        <h1>{user.name || 'Recruiter'}</h1>
      </div>

      <div className="project-posting">
        <h2>Post a New Project</h2>
        <form onSubmit={handlePostProject}>
          <label>
            Project Title:
            <input
              type="text"
              name="title"
              value={projectData.title}
              onChange={handleInputChange}
              placeholder="Enter project title"
              required
            />
          </label>

          <label>
            Project Description:
            <textarea
              name="description"
              value={projectData.description}
              onChange={handleInputChange}
              placeholder="Describe your project"
              rows={4}
              required
            />
          </label>

          <label>
            Budget (₹):
            <input
              type="number"
              name="budget"
              value={projectData.budget}
              onChange={handleInputChange}
              placeholder="Enter budget"
              min="0"
              required
            />
          </label>

          <label>
            Deadline:
            <input
              type="date"
              name="deadline"
              value={projectData.deadline}
              onChange={handleInputChange}
              required
            />
          </label>

          <button type="submit">Post Project</button>
        </form>

        {postingStatus && <p className="success-message">{postingStatus}</p>}
        {postingError && <p className="error-message">{postingError}</p>}
      </div>

      <div className="delete-account-section">
        <h3>Danger Zone</h3>
        <button onClick={handleDeleteAccount} className="delete-button">
          Delete My Account
        </button>
      </div>
     
    </div>
     <div>
        <h3>Available Freelancers</h3>
         <div className="freelancer-container">
  {freelancer.map((freelance) => (
    <div key={freelance._id} className="freelancer-card">
      <h4>{freelance.name}</h4>
      <p>Email: {freelance.email}</p>
      <p>Role: {freelance.role}</p>
    </div>
  ))}
</div>

      </div>
      </>
  );
}

export default RecruiterDashboard;
