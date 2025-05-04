const express = require('express');
const router = express.Router();
const {
  signup,
  login,
  getUser,
  assignProject,
  getAssignedProject,
} = require('../controllers/authController');

router.post('/signup', signup);
router.post('/login', login);
router.get('/user/:userId', getUser);
router.post('/assign-project', assignProject);
router.get('/assigned-project/:userId', getAssignedProject);

module.exports = router;
