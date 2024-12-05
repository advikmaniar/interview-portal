const User = require('../models/User');
const Interviews = require('../models/Interviews')
const jwt = require('jsonwebtoken');

const getUserData = async (req, res) => {
    try {

        console.log('User:', req.user);
        const userId = req.user.id;
        const user = await User.findById(userId).select('-password');
    
        if (!user) {
          console.error('No user found with email:', req.user.email);
          return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
          email: user.email,
          DOB: user.DOB,
          role: user.role,
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
        return res.status(500).json({ message: 'Error fetching user data', error: error.message });
      }
};

const scheduleInterview = async (req, res) => {
  const { date, candidateId, interviewerId, company, role, description } = req.body;
  try {
      const candidate = await User.findById(candidateId);
      const interviewer = await User.findById(interviewerId);

      if (!candidate || !interviewer) {
          return res.status(404).json({ message: 'Candidate or Interviewer not found' });
      }

      if (candidate.role !== 'Candidate' || interviewer.role !== 'Interviewer') {
          return res.status(400).json({ message: 'Invalid role types for Candidate or Interviewer' });
      }

      const newInterview = new Interviews({
          date,
          candidateId,
          interviewerId,
          company,
          role,
          description,
      });

      await newInterview.save();
      res.status(201).json({ message: 'Interview scheduled successfully!', interview: newInterview });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error scheduling interview', error });
  }
}

const interviewsScheduled = async (req, res) => {
  try {
    const interviews = await Interviews.find({ interviewerId: req.user.id });
    console.log("Interviews: ",interviews);
    res.json(interviews);
  } catch (error) {
    console.error('Error fetching interviews:', error);
    res.status(500).json({ error: 'Error fetching interviews' });
  }
}

module.exports = { getUserData, scheduleInterview, interviewsScheduled };
