const mongoose = require('mongoose');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const User = require('./models/User');

const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

dotenv.config({ path: './.env' });

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to DB");

        const email = `test_reports_${Date.now()}@example.com`;
        const password = 'password123';

        // 1. Create User
        console.log(`Creating user ${email}...`);
        const user = await User.create({
            name: 'Reports Tester',
            email,
            password
        });

        // 2. Login (Generate Token)
        // Using the same logic as auth controller
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '30d'
        });
        console.log("Token generated.");

        // 3. Fetch Reports (Should be empty but success 200)
        console.log("Fetching /api/reports...");
        const response = await fetch('http://localhost:5000/api/reports', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        console.log("Response Status:", response.status);
        const data = await response.json();
        console.log("Response Body:", JSON.stringify(data, null, 2));

        if (response.status === 200) {
            console.log("SUCCESS: Reports endpoint works.");
        } else {
            console.log("FAILURE: Reports endpoint returned error.");
        }

    } catch (error) {
        console.error("Error:", error);
    } finally {
        await mongoose.connection.close();
    }
};

run();
