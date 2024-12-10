const express = require('express');
const interviewController = require('../controllers/interviewController');
const router = express.Router();
const authenticate = require('../middleware/authMiddleware');

router.post('/create-room', interviewController.createVideoRoom);
router.post('/room-token', authenticate, interviewController.generateRoomToken);
router.post('/interviews/schedule', interviewController.scheduleInterview);
router.get('/interviews', authenticate, interviewController.interviewsScheduled);
router.get('/:id', interviewController.getInterviewById);
router.put('/:id', interviewController.updateInterview);

module.exports = router;
