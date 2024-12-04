const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('../generateSecretKey');

// Registration
exports.register = async (req, res) => {
  const { firstName, lastName, email, password, username, DOB, role  } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const { month, day, year } = DOB;
    const formattedDOB = new Date(`${month} ${day}, ${year}`);
    const capitalize = str => str ? str[0].toUpperCase() + str.slice(1).toLowerCase() : '';
    const newUser = new User({ firstName: capitalize(firstName), lastName, email, password: hashedPassword, username, DOB:formattedDOB, role });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
};

// Login
exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Send user information
    const token = jwt.sign(
      { id: user._id, },
      process.env.SECRET_KEY,
      { expiresIn: '1h' }
    );

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};
