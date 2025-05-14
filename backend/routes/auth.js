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
  submitProject
} = require('../controllers/authController');
const upload = require('../middleware/upload'); // the multer config file
const auth = require('../middleware/auth');
router.post(
  '/submit-project',
  auth,
  upload.single('zipFile'), // this should match the name used in the frontend form-data
  submitProject
);


router.post('/signup', signup);
router.post('/login', login);
router.get('/user/:userId', getUser);
router.put('/assign-project', assignProject);
router.get('/assigned-project/:userId', getAssignedProject);
router.get('/projects', getAllProjects);
router.get('/deadline/:projectName', getProjectDeadline);

module.exports = router;
