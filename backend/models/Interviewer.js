const mongoose = require('mongoose');

const interviewerSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  username: { type: String, required: true },
  interviewsCompleted:{ type: String, required: true },
  totalInterviews: { type: String, required: true },
});

module.exports = mongoose.model('Interviewer', userSchema);