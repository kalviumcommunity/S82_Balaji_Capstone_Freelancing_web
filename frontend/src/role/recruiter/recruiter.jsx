import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./recruiter.css";

function RecruiterDashboard() {
  const [user, setUser] = useState({
    name: "",
    profilePic: "",
    _id: "",
  });

  const defaultProfilePic = "https://via.placeholder.com/150";

  const [projectData, setProjectData] = useState({
    title: "",
    description: "",
    budget: "",
    deadline: "",
  });

  const [postingStatus, setPostingStatus] = useState(null);
  const [postingError, setPostingError] = useState(null);

  const [freelancers, setFreelancers] = useState([]);
  const [loadingFreelancers, setLoadingFreelancers] = useState(true);

  const [menuOpen, setMenuOpen] = useState(false);

  const fileInputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Load user info from localStorage on mount
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser({
        name: storedUser.name || "Recruiter",
        profilePic: storedUser.profilePic || "",
        _id: storedUser._id || "",
      });
    }
  }, []);

  // Fetch freelancers list
  useEffect(() => {
    const fetchFreelancers = async () => {
      try {
        setLoadingFreelancers(true);
        const response = await axios.get("http://localhost:5000/api/freelancers");
        setFreelancers(response.data);
      } catch (error) {
        console.error("Error fetching freelancers:", error);
      } finally {
        setLoadingFreelancers(false);
      }
    };

    fetchFreelancers();
  }, []);

  // Close dropdown if clicked outside menu or burger icon
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        event.target.className !== "burger-menu"
      ) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  const handleProfilePicClick = () => {
    fileInputRef.current?.click();
  };

  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const newProfilePic = reader.result;

      // Optimistic UI update
      const updatedUser = { ...user, profilePic: newProfilePic };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      try {
        const res = await axios.put(
          `http://localhost:5000/api/users/${user._id}/profile-pic`,
          { profilePic: newProfilePic },
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        console.log(res.data.message);
      } catch (err) {
        console.error("Profile picture update failed:", err);
        alert("Profile picture saved locally but failed to update in database.");
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
      setPostingError("All fields are required.");
      setPostingStatus(null);
      return;
    }

    setPostingError(null);
    setPostingStatus(null);

    try {
      const response = await axios.post("http://localhost:5000/api/projects", projectData);

      setPostingStatus("Project posted successfully!");
      setProjectData({
        title: "",
        description: "",
        budget: "",
        deadline: "",
      });
    } catch (err) {
      setPostingError(err.response?.data?.message || err.message || "Failed to post project");
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action is irreversible."
    );
    if (!confirmed) return;

    if (!user._id) {
      alert("User ID missing. Please log in again.");
      return;
    }

    try {
      const res = await axios.delete(`http://localhost:5000/api/users/${user._id}`);

      alert("Account deleted successfully.");
      localStorage.removeItem("user");
      window.location.href = "/";
    } catch (error) {
      console.error("Delete error:", error);
      alert(error.response?.data?.message || error.message || "Failed to delete account");
    }
  };

  const handleUpdatePassword = () => {
    alert("Redirect to update password page .");
    window.location.href="/password";
  };

  return (
    <>
      <div className="dashboard-container">
        {/* Navbar */}
        <div className="navbar">
          <h2>Recruiter Dashboard</h2>
          <div
            className="burger-menu"
            onClick={() => setMenuOpen((prev) => !prev)}
            role="button"
            tabIndex={0}
            aria-label="Toggle menu"
          >
            &#9776;
          </div>
          {menuOpen && (
            <div className="dropdown-menu" ref={dropdownRef}>
              <button onClick={handleDeleteAccount}>Delete Account</button>
              <button onClick={handleUpdatePassword}>Update Password</button>
            </div>
          )}
        </div>

        {/* Profile Section */}
        <div className="profile-section">
          <img
            src={user.profilePic || defaultProfilePic}
            alt="Profile"
            className="profile-pic"
            onClick={handleProfilePicClick}
            style={{ cursor: "pointer" }}
          />
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleProfilePicChange}
            style={{ display: "none" }}
          />
          <h1>{user.name || "Recruiter"}</h1>
        </div>

        {/* Project Posting */}
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
                required
              />
            </label>
            <label>
              Project Description:
              <textarea
                name="description"
                value={projectData.description}
                onChange={handleInputChange}
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
      </div>

      {/* Freelancer List */}
      <div>
        <h3>Available Freelancers</h3>
        {loadingFreelancers ? (
          <p>Loading freelancers...</p>
        ) : (
          <div className="freelancer-container">
            {freelancers.map((freelance) => (
              <div key={freelance._id} className="freelancer-card">
                <h4>{freelance.name}</h4>
                <p>Email: {freelance.email}</p>
                <p>Role: {freelance.role}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default RecruiterDashboard;
