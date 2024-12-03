const User = require('../models/User');
const jwt = require('jsonwebtoken');

const getUserData = async (req, res) => {
    try {

        console.log('User:', req.user);
        // const user = await User.findOne({ email: req.user.email }).select('-password');
        const userId = req.user.id;
        const user = await User.findById(userId).select('-password');
    
        if (!user) {
          console.error('No user found with email:', req.user.email);
          return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
          name: user.name,
          email: user.email,
          role: user.role,
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
        return res.status(500).json({ message: 'Error fetching user data', error: error.message });
      }
};

module.exports = { getUserData };
