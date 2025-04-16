import React, { useState, useEffect } from 'react';
import './submission.css';

function SubmissionPage() {
  const [assignedProject, setAssignedProject] = useState(null);
  const [timeLeft, setTimeLeft] = useState('');
  const [githubLink, setGithubLink] = useState('');
  const [zipFile, setZipFile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchProject = async () => {
      if (!token) {
        console.error('❌ No token found in localStorage');
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch('http://localhost:5000/api/assigned-project', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`❌ Status ${res.status}: ${errorText}`);
        }

        const data = await res.json();

        if (!data || !data.assignedProject) {
          throw new Error('No assigned project in response');
        }

        setAssignedProject(data.assignedProject);
        startTimer(data.assignedProject.deadline);
        setIsLoading(false);
      } catch (err) {
        console.error('🚨 Failed to load assigned project:', err.message);
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [token]);

  const startTimer = (deadlineDate) => {
    const endTime = new Date(deadlineDate).getTime();

    const timer = setInterval(() => {
      const now = Date.now();
      const distance = endTime - now;

      if (distance <= 0) {
        clearInterval(timer);
        setTimeLeft('⛔ Time’s up!');
      } else {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((distance / (1000 * 60)) % 60);
        const seconds = Math.floor((distance / 1000) % 60);
        setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);
  };

  const handleSubmit = async () => {
    if (!githubLink && !zipFile) {
      alert('Please provide either a GitHub link or upload a ZIP file');
      return;
    }

    const formData = new FormData();
    if (githubLink) formData.append('githubLink', githubLink);
    if (zipFile) formData.append('zipFile', zipFile);

    try {
      const res = await fetch('http://localhost:5000/api/submit-project', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Submission failed');

      alert('✅ Project submitted successfully!');
    } catch (err) {
      console.error('❌ Submission failed:', err.message);
      alert('❌ Submission failed');
    }
  };

  return (
    <div className="submission-container">
      {isLoading ? (
        <div className="loading-spinner">
          <p>Loading project details...</p>
          <div className="spinner"></div>
        </div>
      ) : assignedProject ? (
        <>
          <h2>🧪 Submitting: {assignedProject.name}</h2>
          <p><strong>Deadline:</strong> {new Date(assignedProject.deadline).toLocaleString()}</p>
          <p className="timer">⏱ Time Left: {timeLeft}</p>

          <div className="upload-section">
            <label>📁 Upload ZIP file:</label>
            <input type="file" accept=".zip" onChange={(e) => setZipFile(e.target.files[0])} />

            <label>🔗 GitHub Repository URL:</label>
            <input
              type="text"
              placeholder="https://github.com/username/repo"
              value={githubLink}
              onChange={(e) => setGithubLink(e.target.value)}
            />

            <button className="submit-btn" onClick={handleSubmit}>
              🚀 Submit Project
            </button>
          </div>
        </>
      ) : (
        <p>⚠️ No assigned project found. Please contact the admin.</p>
      )}
    </div>
  );
}

export default SubmissionPage;
