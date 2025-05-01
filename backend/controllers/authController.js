const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Signup Controller
exports.signup = async (req, res) => {
  try {
    const { name, email, password, occupation } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ name, email, password: hashedPassword, occupation });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Signup Error:', error);
    res.status(500).json({ message: 'Server error during signup' });
  }
};

// Login Controller
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    //   expiresIn: '7d',
    // });
res.json({msg:"ok"})
   // res.json({ token });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// Get Logged-In User Info
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (error) {
    console.error('Get User Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Assign Project to User
exports.assignProject = async (req, res) => {
  try {
    const { projectName } = req.body;
    const user = await User.findById(req.user.userId);

    if (!user) return res.status(404).json({ message: 'User not found' });

    user.assignedProject = {
      name: projectName,
      assignedAt: new Date(),
    };

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
    const user = await User.findById(req.user.userId);
    if (!user || !user.assignedProject)
      return res.status(404).json({ message: 'No project assigned' });

    res.status(200).json(user.assignedProject);
  } catch (error) {
    console.error('Get Assigned Project Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
