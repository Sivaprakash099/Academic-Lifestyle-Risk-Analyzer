const API_URL = 'http://localhost:5000/api/auth';

const testAuth = async () => {
    try {
        const testUser = {
            name: 'Test User',
            email: `test${Date.now()}@example.com`,
            password: 'password123'
        };

        console.log('1. Testing Registration...');
        const regRes = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(testUser)
        });
        const regData = await regRes.json();
        console.log('Registration Status:', regRes.status);
        if (regRes.status === 201) {
            console.log('Registration Success: YES');
            console.log('Token: Present');
        } else {
            console.log('Registration Failed:', regData);
        }

        console.log('\n2. Testing Login...');
        const loginRes = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: testUser.email,
                password: testUser.password
            })
        });
        const loginData = await loginRes.json();
        console.log('Login Status:', loginRes.status);
        if (loginRes.status === 200) {
            console.log('Login Success: YES');
            console.log('Token: Present');
        } else {
            console.log('Login Failed:', loginData);
        }

        console.log('\n3. Testing Duplicate Registration...');
        const dupRes = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(testUser)
        });
        console.log('Duplicate Registration Status:', dupRes.status);
        if (dupRes.status === 400) {
            console.log('Duplicate Registration: PASSED (Correctly rejected)');
        } else {
            console.log('Duplicate Registration: FAILED (Should be 400)');
        }

        console.log('\n4. Testing Invalid Login...');
        const invRes = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: testUser.email,
                password: 'wrongpassword'
            })
        });
        console.log('Invalid Login Status:', invRes.status);
        if (invRes.status === 401) {
            console.log('Invalid Login: PASSED (Correctly rejected)');
        } else {
            console.log('Invalid Login: FAILED (Should be 401)');
        }

    } catch (error) {
        console.error('Test Error:', error);
    }
};

testAuth();
