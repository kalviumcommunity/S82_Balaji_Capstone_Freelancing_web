const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const {
  signup,
  login,
  getUser,
  assignProject,
  getAssignedProject
} = require('../controllers/authController');

router.post('/signup', signup);
router.post('/login', login);
router.get('/user', authMiddleware, getUser);
router.post('/assign-project', authMiddleware, assignProject);
router.get('/assigned-project', authMiddleware, getAssignedProject);

module.exports = router;
