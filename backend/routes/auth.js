const express = require('express');
const router = express.Router();
const {
  signup,
  login,
  getUser,
  assignProject,
  getAssignedProject,
  getAllProjects,
  getProjectDeadline,
  submitProject,
 updateProfilePic, 
 freelance,
 updatePassword,
  postProject
} = require('../controllers/authController');
const userController = require('../controllers/userController');
const upload = require('../middleware/upload'); // the multer config file
const auth = require('../middleware/auth');
router.post(
  '/submit-project',
  auth,
  upload.single('zipFile'), // this should match the name used in the frontend form-data
  submitProject
);

router.post('/update-profile-pic/:userId', upload.single('profilePic'),updateProfilePic);


router.get('/freelancers', freelance);

router.post('/signup', signup);
router.post('/login', login);
router.get('/user/:userId', getUser);
router.put('/assign-project', assignProject);

router.post('/projects', postProject);
router.get('/assigned-project/:userId', getAssignedProject);
router.get('/projects', getAllProjects);
router.get('/deadline/:projectName', getProjectDeadline);
router.delete('/users/:id', userController.deleteUser);
router.put('/update-password/:userId',updatePassword);
module.exports = router;

router.get('/assigned-project/:userId', getAssignedProject);
router.get('/projects', getAllProjects);
router.get('/deadline/:projectName', getProjectDeadline);

module.exports = router;

