import React, { useState, useEffect } from 'react';
import './submission.css';

function SubmissionPage() {
  const [assignedProject, setAssignedProject] = useState(null);
  const [timeLeft, setTimeLeft] = useState('');
  const [githubLink, setGithubLink] = useState('');
  const [zipFile, setZipFile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/assigned-project');
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
  }, []);

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
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Submission failed');

      alert('Project submitted successfully');
    } catch (error) {
      console.error('Submission error:', error);
      alert('Error during submission: ' + error.message);
    }
  };

  if (isLoading) {
    return <p>Loading your assigned project...</p>;
  }

  return (
    <div className="submission-container">
      <h2>Submit Your {assignedProject.name} Project</h2>
      <p>Time left to submit: {timeLeft}</p>
      <div className="submission-options">
        <div>
          <label>GitHub Link (Optional)</label>
          <input
            type="url"
            value={githubLink}
            onChange={(e) => setGithubLink(e.target.value)}
            placeholder="Enter your GitHub repository link"
          />
        </div>

        <div>
          <label>Upload ZIP (Optional)</label>
          <input
            type="file"
            onChange={(e) => setZipFile(e.target.files[0])}
          />
        </div>
      </div>

      <button onClick={handleSubmit}>Submit Project</button>
    </div>
  );
}

export default SubmissionPage;
