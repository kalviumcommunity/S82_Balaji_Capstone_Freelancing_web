const bcrypt = require('bcryptjs');
const User = require('../models/user');
const Project = require('../models/project');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

// Signup Controller
exports.signup = async (req, res) => {
  const { name, email, password, role, phone } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      role,
    });

    await newUser.save();

    const userWithoutPassword = await User.findById(newUser._id).select('-password');

    const token = jwt.sign({ id: newUser._id }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ user: userWithoutPassword, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Login Controller
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).populate('assignedProject');
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });

    // Remove password before sending
    const userObj = user.toObject();
    delete userObj.password;

    res.status(200).json({ user: userObj, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get User
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (error) {
    console.error('Get User Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Assign Project
// Assign Project - now using PUT
exports.assignProject = async (req, res) => {
  try {
    const { userId, projectName } = req.body;

    const project = await Project.findOne({ name: projectName });
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const assignedAt = new Date();
    const deadlineAt = new Date(assignedAt.getTime() + project.deadlineDays * 24 * 60 * 60 * 1000);

    user.assignedProject = project._id;
    user.projectAssignedAt = assignedAt;
    user.projectDeadline = deadlineAt;

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
    const user = await User.findById(req.params.userId).populate('assignedProject');
    if (!user || !user.assignedProject) {
      return res.status(404).json({ message: 'No project assigned' });
    }

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

// Get All Projects (Paginated)
exports.getAllProjects = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const projects = await Project.find()
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const totalProjects = await Project.countDocuments();

    res.json({
      projects,
      totalProjects,
      totalPages: Math.ceil(totalProjects / limit),
      currentPage: Number(page)
    });
  } catch (error) {
    console.error('Get Projects Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get Project Deadline
exports.getProjectDeadline = async (req, res) => {
  try {
    const projectName = decodeURIComponent(req.params.projectName);

    const project = await Project.findOne({ name: projectName });
    if (!project) return res.status(404).json({ message: 'Project not found' });

    res.status(200).json({ deadlineDays: project.deadlineDays });
  } catch (error) {
    console.error('Get Deadline Error:', error);
    res.status(500).json({ message: 'Server error while fetching deadline' });
  }
};

// Project Submission
// Submit Project - now using PUT
exports.submitProject = async (req, res) => {
  try {
    const githubLink = req.body.githubLink;
    const zipUrl = req.file ? req.file.path : null;

    if (!req.userId) return res.status(401).json({ message: 'Unauthorized' });
    if (!githubLink && !zipUrl) {
      return res.status(400).json({ message: 'Please provide either a GitHub link or a ZIP file' });
    }

    const user = await User.findById(req.userId); // from auth middleware
    if (!user || !user.assignedProject) {
      return res.status(404).json({ message: 'User or assigned project not found' });
    }

    user.submission = {
      githubLink: githubLink || null,
      zipUrl: zipUrl || null,
      submittedAt: new Date(),
    };

    await user.save();
    res.status(200).json({ message: 'Project submitted successfully' });
  } catch (error) {
    console.error('Project Submission Error:', error);
    res.status(500).json({ message: 'Server error during project submission' });
  }
};


// controllers/userController.js

exports.updateProfilePic = async (req, res) => {
  try {
    const userId = req.params.userId;
    const profilePic = req.file?.filename;

    if (!profilePic) {
      return res.status(400).json({ message: 'No profile picture uploaded.' });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { profilePic },
      { new: true }
    );

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ message: 'Profile picture updated', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong' });
  }
};


exports.postProject = async (req, res) => {
  try {
    console.log('Incoming project data:', req.body);
      const { title, description, budget, deadline } = req.body;

    if (!title || !description || !budget || !deadline) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const newProject = new Project({
      title,
      description,
      budget,
      deadline,
      createdAt: new Date(),
    });

    await newProject.save();

    return res.status(201).json({ message: 'Project posted successfully!' });
  } catch (error) {
    console.error('Detailed error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.freelance = async(req,res)=>{
  try{
    const freelancer=await User.find({role:'freelancer'}).select("-password");
    res.status(200).json(freelancer)
  }
  catch(err){
    res.status(500).json({error:err.message});
  }
}
// In your controller
exports.updatePassword = async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;
  const userId = req.userId;  // <-- get userId from JWT auth middleware

  if (!currentPassword || !newPassword || !confirmPassword) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ message: 'New passwords do not match' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Update Password Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

