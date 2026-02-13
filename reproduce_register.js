const axios = require('axios');

const register = async () => {
    const url = 'http://localhost:5002/api/auth/register';
    const userData = {
        name: 'Test Debugger',
        email: 'harjith.al23@bitsathy.ac.in', // Using the email from the screenshot to see if it exists
        password: 'password123',
        role: 'student'
    };

    console.log(`Attempting to register: ${userData.email}`);

    try {
        const response = await axios.post(url, userData);
        console.log('Registration SUCCESS:', response.data);
    } catch (error) {
        if (error.response) {
            console.log('Registration FAILED (Response):');
            console.log('Status:', error.response.status);
            console.log('Data:', error.response.data);
        } else if (error.request) {
            console.log('Registration FAILED (No Response):', error.message);
        } else {
            console.log('Registration FAILED (Setup Error):', error.message);
        }
    }
};

register();
