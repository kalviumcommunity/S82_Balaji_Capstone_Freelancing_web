// const User = require('../models/user');

// // Function to get the assigned project for the user
// const getAssignedProject = async (req, res) => {
//   try {
//     const { userId } = req.params; // Directly use userId from the URL parameters

//     // Find the user and populate the assigned project details
//     const user = await User.findById(userId).populate('assignedProject');
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     if (!user.assignedProject) {
//       return res.status(404).json({ message: 'No assigned project found' });
//     }

//     // Return the assigned project details
//     res.json(user.assignedProject);
//   } catch (error) {
//     console.error('Error retrieving assigned project:', error);
//     res.status(500).json({ message: 'Server error during project retrieval' });
//   }
// };
