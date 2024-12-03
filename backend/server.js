const express = require('express');
const mongoose = require('mongoose');
const connectDB = require('./config/database');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
require('dotenv').config();

const app = express();

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

connectDB();
app.use('/api', authRoutes);
app.use('/profile', userRoutes);


// Start Server
const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })
  .catch((err) => console.error('Error connecting to MongoDB:', err));
