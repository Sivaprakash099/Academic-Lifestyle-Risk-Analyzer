const mongoose = require('mongoose');
const dotenv = require('dotenv');
const dns = require('dns');

// Force Google DNS
dns.setServers(['8.8.8.8', '8.8.4.4']);

dotenv.config({ path: __dirname + '/.env' }); // relative to server/check_db.js

const checkDB = async () => {
    try {
        console.log('Connecting to MongoDB URI:', process.env.MONGODB_URI);
        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000 // Timeout after 5s
        });
        console.log('Connected to MongoDB Successfully');
        await mongoose.disconnect();
        console.log('Disconnected');
    } catch (error) {
        console.error('❌ Connection Failed!');
        console.error('Error Name:', error.name);
        console.error('Error Message:', error.message);
        console.error('Error Code:', error.code);
    }
};

checkDB();
