const axios = require('axios');

const API_URL = 'http://localhost:5000/api/auth';

const testAuth = async () => {
    try {
        // 1. Test Registration
        console.log('Testing Registration...');
        const uniqueEmail = `testuser_${Date.now()}@example.com`;
        const registerRes = await axios.post(`${API_URL}/register`, {
            name: 'Test User',
            email: uniqueEmail,
            password: 'password123',
            role: 'student'
        });
        console.log('✅ Registration Successful:', registerRes.data);

        // 2. Test Login
        console.log('\nTesting Login...');
        const loginRes = await axios.post(`${API_URL}/login`, {
            email: uniqueEmail,
            password: 'password123'
        });
        console.log('✅ Login Successful:', loginRes.data);

        // 3. Test Profile
        console.log('\nTesting Profile Access...');
        const token = loginRes.data.token;
        const profileRes = await axios.get(`${API_URL}/me`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        console.log('✅ Profile Access Successful:', profileRes.data);

    } catch (error) {
        console.error('❌ Test Failed:', error.response ? error.response.data : error.message);
    }
};

testAuth();
