const bcrypt = require('bcryptjs');

async function testBcrypt() {
    try {
        console.log('Generating salt...');
        const salt = await bcrypt.genSalt(10);
        console.log('Salt:', salt);
        console.log('Hashing password...');
        const hash = await bcrypt.hash('password123', salt);
        console.log('Hash:', hash);
        console.log('Verifying...');
        const match = await bcrypt.compare('password123', hash);
        console.log('Match:', match);
    } catch (e) {
        console.error('Bcrypt Error:', e);
    }
}

testBcrypt();
