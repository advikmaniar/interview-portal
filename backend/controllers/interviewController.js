
const Video = require('twilio').Video;
const twilio = require('twilio');
const client = require('../config/twilio');
const Interviews = require('../models/Interviews')
const { TWILIO_ACCOUNT_SID, TWILIO_API_KEY, TWILIO_API_SECRET } = process.env;
const { AccessToken } = require('twilio').jwt;
const VideoGrant = AccessToken.VideoGrant;

const scheduleInterview = async (req, res) => {
  const { date, candidateId, interviewerId, company, role, status, type, notes } = req.body;
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
      status,
      type,
      notes,
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
    const interviews = await Interviews.find({ interviewerId: req.user.id }).populate('candidateId', 'firstName lastName');
    console.log("Interviews: ", interviews);
    res.json(interviews);
  } catch (error) {
    console.error('Error fetching interviews:', error);
    res.status(500).json({ error: 'Error fetching interviews' });
  }
}

const getInterviewById = async (req, res) => {
  const { id } = req.params;

  try {
    const interview = await Interviews.findById(id).populate('candidateId');
    if (interview) {
      res.status(200).json(interview);
    } else {
      res.status(404).json({ message: 'Interview not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateInterview = async (req, res) => {
  const interviewId = req.params.id;
  const updates = req.body;
  try {
    const updatedInterview = await Interviews.findByIdAndUpdate(
      interviewId,
      updates,
      { new: true }
    );

    if (!updatedInterview) {
      return res.status(404).json({ message: 'Interview not found.' });
    }

    res.status(200).json(updatedInterview);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update interview details.', error });
  }
}


const createVideoRoom = async (req, res) => {
  const { roomName } = req.body;

  if (!roomName) {
    return res.status(400).json({ message: 'Room name is required' });
  }

  try {
    const room = await client.video.rooms.create({
      uniqueName: roomName,
      type: 'group', // Options: 'peer-to-peer', 'group', or 'group-small'
    });

    res.status(201).json({ roomSid: room.sid, roomName: room.uniqueName });
  } catch (error) {
    console.error('Error creating Twilio Video room:', error.message);
    res.status(500).json({ message: 'Failed to create video room', error: error.message });
  }
};

const getRoomDetails = async (req, res) => {
  const { roomSid } = req.params;

  try {
    const room = await client.video.rooms(roomSid).fetch();
    res.status(200).json(room);
  } catch (error) {
    console.error('Error fetching Twilio Video room details:', error.message);
    res.status(500).json({ message: 'Failed to fetch room details', error: error.message });
  }
};

const generateRoomToken = async (req, res) => {
  const { roomSid } = req.body;
  const identity = `${req.user.id}-${new Date().getTime()}`;

  console.log('Room SID:', roomSid);
  console.log('Identity:', identity);

  if (!roomSid || !identity) {
    return res.status(400).json({ message: 'Room SID and user identity are required' });
  }

  const videoGrant = new VideoGrant({
    room: roomSid, // Grant access to the specific room
  });

  try {
    const token = new AccessToken(
      TWILIO_ACCOUNT_SID,
      TWILIO_API_KEY,
      TWILIO_API_SECRET,
      {
        identity,
    }
    );
    token.addGrant(videoGrant);

    res.status(200).json({ token: token.toJwt() });
  } catch (error) {
    console.error('Error generating Twilio token:', error.message);
    res.status(500).json({ message: 'Failed to generate video token', error: error.message });
  }
};


module.exports = {
  scheduleInterview,
  interviewsScheduled,
  getInterviewById,
  updateInterview,
  createVideoRoom,
  getRoomDetails,
  generateRoomToken
};
