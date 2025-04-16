import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ass.css';

function AssignProject() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userEmail = localStorage.getItem('userEmail');

  const projectList = [
    { name: 'Bug Tracker', deadlineDays: 5, description: 'Track bugs with roles, priorities, and comments.' },
    { name: 'E-learning Platform', deadlineDays: 7, description: 'Learning system with educational content upload.' },
    { name: 'Job Board Platform', deadlineDays: 6, description: 'Post/apply to jobs with search and filters.' },
    { name: 'Mini CRM', deadlineDays: 6, description: 'Compact CRM with contact and lead management.' },
    { name: 'File Storage System', deadlineDays: 4, description: 'Secure file uploads and cloud-like access.' },
    { name: 'Freelance Marketplace', deadlineDays: 7, description: 'Post and accept freelance gigs with payments.' },
    { name: 'Chat App', deadlineDays: 3, description: 'Real-time messaging system.' },
    { name: 'Online Voting System', deadlineDays: 4, description: 'Secure and user-friendly online voting.' },
    { name: 'Inventory & Billing System', deadlineDays: 6, description: 'Track stock and generate bills.' },
    { name: 'Event Registration System', deadlineDays: 5, description: 'Event management with registration handling.' }
  ];

  const handleAssignProject = async () => {
    if (!selectedProject) {
      setError('Please select a project');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await fetch('http://localhost:5000/api/assign-project', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: userEmail,
          projectName: selectedProject.name,
        }),
      });
      

      // Check if the response is OK (status code 200)
      if (!response.ok) {
        const errorResponse = await response.text();  // Get response body as text in case of non-JSON response
        console.error('Error response:', errorResponse);
        setError('Error assigning project: ' + errorResponse);
        return;
      }

      // Check if response body is empty or not JSON
      const contentType = response.headers.get('Content-Type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        console.log('Project assigned:', data);
        setSuccess(true);
        setTimeout(() => navigate('/submission'), 1500); // Navigate to submission page after successful assignment
      } else {
        const errorText = await response.text();
        console.error('Unexpected response:', errorText);
        setError('Unexpected error occurred.');
      }
    } catch (error) {
      console.error('Failed to assign project:', error);
      setError('An error occurred while assigning the project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="assignment-container">
      <h2>🎯 Select Your Evaluation Project</h2>
      
      {/* Display Error or Success Messages */}
      {error && <p className="error">{error}</p>}
      {success && <p className="success">Project assigned successfully!</p>}

      <div className="project-cards">
        {projectList.map((proj, index) => (
          <div
            className={`project-card ${selectedProject?.name === proj.name ? 'selected' : ''}`}
            key={index}
            onClick={() => setSelectedProject(proj)} // Allows users to select by clicking on the card
          >
            <h3>{proj.name}</h3>
            <p>{proj.description}</p>
            <p><strong>Deadline:</strong> {proj.deadlineDays} days</p>
            <label>
              <input
                type="radio"
                name="project"
                value={proj.name}
                onChange={() => setSelectedProject(proj)}
                checked={selectedProject?.name === proj.name}
              />
              Select this project
            </label>
          </div>
        ))}
      </div>

      <button
        className="assign-btn"
        onClick={handleAssignProject}
        disabled={loading}
      >
        {loading ? 'Assigning Project...' : 'Assign Project'}
      </button>
    </div>
  );
}

export default AssignProject;
