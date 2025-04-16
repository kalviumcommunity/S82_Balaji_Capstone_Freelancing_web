const Project = require('../models/project'); // Assuming you have a Project model
const User = require('../models/user'); // Assuming you have a User model

// Function to get the assigned project for the user
const getAssignedProject = async (req, res) => {
  try {
    const userId = req.user.id; // Get userId from JWT

    // Find the user and populate the assigned project details
    const user = await User.findById(userId).populate('assignedProject'); // Ensure 'assignedProject' is populated
    if (!user || !user.assignedProject) {
      return res.status(404).json({ message: 'No assigned project found' });
    }

    // Return the assigned project details
    res.json(user.assignedProject);
  } catch (error) {
    console.error('Error retrieving assigned project:', error);
    res.status(500).json({ message: 'Server error during project retrieval' });
  }
};
