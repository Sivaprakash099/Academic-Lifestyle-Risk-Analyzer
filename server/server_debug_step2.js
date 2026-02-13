const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Config dotenv manually for test
dotenv.config({ path: __dirname + '/.env' });

const app = express();
const PORT = 5004;

const startServer = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected');

        app.listen(PORT, () => {
            console.log(`Step 2 Server running on port ${PORT}`);
        });
    } catch (err) {
        console.error('MongoDB Connection Error:', err);
    }
};

startServer();
