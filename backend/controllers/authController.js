const bcrypt = require('bcryptjs');
const User = require('../models/user');
// const Project = require('../models/project');


exports.signup = async (req, res) => {
  try {
    const { name, email, password, occupation } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser)
      return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ name, email, password: hashedPassword, occupation });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Signup Error:', error);
    res.status(500).json({ message: 'Server error during signup' });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    res.status(200).json({ message: 'Login successful', userId: user._id });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

exports.getUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (error) {
    console.error('Get User Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.assignProject = async (req, res) => {
  try {
    const { userId, projectName } = req.body;
    const project = await Project.findOne({ name: projectName });
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    
    user.assignedProject = project._id;   //  Assign only the ObjectId

    const assignedAt = new Date();      // Save deadline date separately if needed
    const deadlineAt = new Date(assignedAt.getTime() + project.deadlineDays * 24 * 60 * 60 * 1000);
    user.projectDeadline = deadlineAt;
    user.projectAssignedAt = assignedAt;

    await user.save();

    res.status(200).json({ message: 'Project assigned successfully' });
  } catch (error) {
    console.error('Assign Project Error:', error);
    res.status(500).json({ message: 'Server error during project assignment' });
  }
};


// Get Assigned Project
exports.getAssignedProject = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).populate('assignedProject');
    if (!user || !user.assignedProject)
      return res.status(404).json({ message: 'No project assigned' });

    res.status(200).json({
      assignedProject: user.assignedProject,
      assignedAt: user.projectAssignedAt,
      deadlineAt: user.projectDeadline
    });
  } catch (error) {
    console.error('Get Assigned Project Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


