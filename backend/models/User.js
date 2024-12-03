const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, index: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  DOB: { type: Date, required: true }, 
});

module.exports = mongoose.model('User', userSchema);

