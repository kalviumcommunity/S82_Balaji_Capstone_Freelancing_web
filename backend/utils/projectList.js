const Project = require('../models/project'); // Assuming you have a Project model

// Assign Project
exports.assignProject = async (req, res) => {
  try {
    const { userId, projectName } = req.body;
    
    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find the project by its name
    const project = await Project.findOne({ name: projectName });
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Assign the project to the user
    user.assignedProject = project._id;  // Save the project ID
    await user.save();

    res.status(200).json({ message: 'Project assigned successfully' });
  } catch (error) {
    console.error('Assign Project Error:', error);
    res.status(500).json({ message: 'Server error during project assignment' });
  }
};
