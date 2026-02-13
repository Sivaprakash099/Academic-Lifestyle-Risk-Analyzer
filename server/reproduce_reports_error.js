const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const run = async () => {
    try {
        console.log("Skipping DB connect...");

        // Dummy ID
        const dummyId = '507f1f77bcf86cd799439011';

        // 2. Generate Token
        // Use the secret from .env or fallback if missing (to see if that's the issue)
        const secret = process.env.JWT_SECRET || 'fallback_secret';
        console.log("Using Secret:", secret);

        const token = jwt.sign({ id: dummyId }, secret, {
            expiresIn: '30d'
        });
        console.log("Generated Token:", token);

        // 3. Simulate Request
        console.log("Fetching http://localhost:5000/api/reports ...");
        const response = await fetch('http://localhost:5000/api/reports', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        console.log("Response Status:", response.status);
        const text = await response.text();
        console.log("Response Body:", text);

    } catch (error) {
        console.error("Error:", error);
    }
};

run();
