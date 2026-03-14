const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const dns = require('dns');

// Fix for querySrv ECONNREFUSED error
dns.setServers(['8.8.8.8', '8.8.4.4']);

// Load environment variables
dotenv.config();

const app = express();

// ==================
// Middleware
// ==================
// 1. CORS: Allow requests from frontend
app.use(cors({
  origin: [
    /^http:\/\/localhost:\d+$/, 
    'https://academic-risk-analyzer-17bfa.web.app', 
    'https://academic-risk-analyzer-17bfa.firebaseapp.com',
    'https://academic-lifestyle-risk-analyzer.vercel.app'
  ], // Allow localhost, Firebase, and Vercel domains
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 2. Body Parser: Parse JSON bodies (as sent by API clients)
app.use(express.json());

// 3. URL Encoded Parser: Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }));

// 4. Debug Logger: Log every request
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// ==================
// Routes
// ==================
// Import routes
const authRoutes = require('./routes/auth.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const lifestyleRoutes = require('./routes/lifestyle.routes');
const riskRoutes = require('./routes/risk.routes');
const reportsRoutes = require('./routes/reports.routes');

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/users', authRoutes); // Alias for /api/users/me requirement
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/lifestyle', lifestyleRoutes);
app.use('/api/risk', riskRoutes);
app.use('/api/risk-analysis', riskRoutes); // Combined Alias
app.use('/api/reports', reportsRoutes);

// Test Route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// ==================
// Error Handler
// ==================
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'production' ? null : err.message
  });
});

// ==================
// Server Start
// ==================
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${mongoose.connection.host}`);

    // Start Server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

startServer();
