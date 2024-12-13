const User = require('../models/User');
const Candidate = require('../models/Candidate');

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

const getCandidateData = async (req, res) => {
  try {
    const { candidateId } = req.params;
    console.log("CandidateId: "+candidateId)
    const candidate = await Candidate.findOne({ userId: candidateId });
    console.log("Candidate: "+candidate)
      if (!candidate) return res.status(404).json({ message: 'Candidate not found' });
      res.json(candidate);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' }); 
  }
  // try {
  //   const candidate = await Candidate.findById(req.params.id).populate('user');

  //   if (!candidate) {
  //     throw new Error('Candidate not found');
  //   }

  //   console.log('Candidate details:', candidate);
  //   return candidate;

  // } catch (error) {
  //   console.error('Error fetching candidate details:', error.message);
  //   throw error;
  // }
}




module.exports = { getUserData, getCandidateData };
