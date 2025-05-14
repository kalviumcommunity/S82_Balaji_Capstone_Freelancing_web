import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // for decoding JWT
import './submission.css';

function SubmissionPage() {
  const [githubLink, setGithubLink] = useState('');
  const [zipFile, setZipFile] = useState(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  // Get user and token from localStorage
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');
  const userId = user ? user._id : null;
  const projectId = user?.assignedProject || '';

  // Decode token to check for expiration
  const isTokenExpired = () => {
    if (!token) return true; // No token present
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000; // Get current time in seconds
      return decoded.exp < currentTime;
    } catch (err) {
      return true; // Token is malformed or invalid
    }
  };

  const handleSubmit = async () => {
    if (!githubLink && !zipFile) {
      setError('Please upload a ZIP file or provide a GitHub link');
      return;
    }

    if (!userId || !projectId || !token) {
      setError('User not logged in, project not assigned, or token missing');
      return;
    }

    if (isTokenExpired()) {
      setError('Your session has expired. Please log in again.');
      return;
    }

    setError('');
    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('projectId', projectId);

    if (githubLink) {
      formData.append('githubLink', githubLink);
    }

    if (zipFile) {
      formData.append('zipFile', zipFile);
    }

    try {
      const response = await fetch('http://localhost:5000/api/submit-project', {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`, // Send JWT
        },
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText || 'Something went wrong');
      }

      const data = await response.json();
      console.log('Submitted:', data);

      setSuccessMessage('✅ Project submitted successfully!');
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      console.error('Submission failed:', err);
      setError('❌ Submission failed: ' + err.message);
    }
  };

  return (
    <div className="submission-container">
      <h2>📦 Submit Your Project</h2>
      <p><strong>Project:</strong> {projectId}</p>

      {error && <p className="error">{error}</p>}
      {successMessage && <p className="success">{successMessage}</p>}

      <div className="submission-form">
        <label>GitHub Link:</label>
        <input
          type="url"
          value={githubLink}
          onChange={e => setGithubLink(e.target.value)}
          placeholder="https://github.com/yourrepo"
        />

        <label>Upload ZIP File:</label>
        <input
          type="file"
          accept=".zip"
          onChange={e => setZipFile(e.target.files[0])}
        />

        <button className="submit-btn" onClick={handleSubmit}>
          Submit Project
        </button>
      </div>
    </div>
  );
}

export default SubmissionPage;
