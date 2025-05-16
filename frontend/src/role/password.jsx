import React, { useState, useEffect } from 'react';
import './pass.css';

function UpdatePassword() {
  const [userId, setUserId] = useState(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [statusMessage, setStatusMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser && storedUser._id) {
      setUserId(storedUser._id);
    } else {
      setErrorMessage("User not found or not logged in.");
    }
  }, []);

  useEffect(() => {
    setStatusMessage(null);
    // Do not clear errorMessage while typing
  }, [currentPassword, newPassword, confirmPassword]);

  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      setErrorMessage('User not identified.');
      return;
    }

    const current = currentPassword.trim();
    const newPass = newPassword.trim();
    const confirm = confirmPassword.trim();

    if (!current || !newPass || !confirm) {
      setErrorMessage('All fields are required.');
      return;
    }

    if (newPass !== confirm) {
      setErrorMessage('New password and confirmation do not match.');
      return;
    }

    if (!strongPasswordRegex.test(newPass)) {
      setErrorMessage(
        'Password must be at least 8 characters, include uppercase and lowercase letters, a number, and a special character.'
      );
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    setStatusMessage(null);

    try {
      const res = await fetch(`http://localhost:5000/api/update-password/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ currentPassword: current, newPassword: newPass ,confirmPassword:confirm}),
      });

      if (!res.ok) {
        const data = await res.json();
        const safeMessage =
          data.message && !data.message.toLowerCase().includes('stack')
            ? data.message
            : 'Failed to update password.';
        throw new Error(safeMessage);
      }

      setStatusMessage('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="update-password-container">
      <h2>Update Password</h2>
      <form onSubmit={handleSubmit} className="update-password-form">
        <label>
          Current Password:
          <input
            type={showPasswords ? 'text' : 'password'}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </label>

        <label>
          New Password:
          <input
            type={showPasswords ? 'text' : 'password'}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            autoComplete="new-password"
          />
        </label>

        <label>
          Confirm New Password:
          <input
            type={showPasswords ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            autoComplete="new-password"
          />
        </label>

        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
          <input
            type="checkbox"
            checked={showPasswords}
            onChange={() => setShowPasswords(!showPasswords)}
          />
          Show Passwords
        </label>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Updating...' : 'Update Password'}
        </button>
      </form>

      {statusMessage && <p className="success-message">{statusMessage}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
}

export default UpdatePassword;
