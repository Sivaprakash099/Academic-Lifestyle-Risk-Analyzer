const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config({ path: __dirname + '/.env' });

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Import Routes
const authRoutes = require('./routes/auth.routes');
const lifestyleRoutes = require('./routes/lifestyle.routes');
const profileRoutes = require('./routes/profile.routes');
const riskRoutes = require('./routes/risk.routes');

app.use('/api/auth', authRoutes);
app.use('/api/lifestyle', lifestyleRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/risk', riskRoutes);

const PORT = 5002;

// Connect to MongoDB first, then start server
// Connect to MongoDB first, then start server
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error('MongoDB Connection Error:', err);
    process.exit(1);
  }
};

startServer();
