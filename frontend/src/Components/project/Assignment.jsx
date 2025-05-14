import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ass.css';

function AssignProject() {
  const [projectList, setProjectList] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  const userId = user ? user._id : null;

  useEffect(() => {
    if (!userId) {
      setError('User not logged in');
      return;
    }

    const fetchProjects = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/projects');
        const data = await response.json();
        setProjectList(data.projects || []);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError('Failed to load projects from server');
      }
    };

    fetchProjects();
  }, [userId]);

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
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          projectName: selectedProject.name, // Ensure this matches the API request structure
        }),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        setError(`Error assigning project: ${errorResponse.message}`);
        return;
      }

      const data = await response.json();
      console.log('Project assigned:', data);

      const updatedUser = { ...user, assignedProject: selectedProject.name };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);

      setSuccess(true);
      setTimeout(() => navigate('/submission'), 1500);
    } catch (error) {
      console.error('Failed to assign project:', error);
      setError('An error occurred while assigning the project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="assignment-container">
      <h2>🎯 Select any one Project</h2>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">Project assigned successfully!</p>}

      <div className="project-cards">
        {projectList.length === 0 ? (
          <p>No projects available at the moment</p>
        ) : (
          projectList.map((proj, index) => (
            <div
              className={`project-card ${selectedProject?.name === proj.name ? 'selected' : ''}`}
              key={index}
              onClick={() => setSelectedProject(proj)}
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
          ))
        )}
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
