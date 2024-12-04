const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['Candidate', 'Interviewer'], required: true },
  DOB: { type: Date, required: true }, 
});

module.exports = mongoose.model('User', userSchema);

