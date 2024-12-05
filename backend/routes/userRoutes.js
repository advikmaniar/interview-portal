const express = require('express');
const userController = require('../controllers/userController');
const authenticate = require('../middleware/authMiddleware');
const User = require('../models/User');
const Interviews = require('../models/Interviews')
const router = express.Router();

router.get('/dashboard', authenticate, userController.getUserData);

router.post('/interviews/schedule', userController.scheduleInterview);

router.get('/interviews', authenticate, userController.interviewsScheduled);

// Route to get all users (both interviewers and candidates)
router.get('/', async (req, res) => {
    try {
      const users = await User.find();
      console.log(users);
      res.json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });

module.exports = router;
