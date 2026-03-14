const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env from server directory
dotenv.config({ path: path.join(__dirname, '.env') });

const RiskResult = require('./models/RiskResult');
const Lifestyle = require('./models/Lifestyle');

async function debug() {
    try {
        console.log('Connecting to:', process.env.MONGODB_URI.replace(/:([^:@]+)@/, ':****@'));
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected.');

        const results = await RiskResult.find().sort({ createdAt: -1 }).limit(5);
        console.log(`Found ${results.length} RiskResults.`);

        for (const r of results) {
            console.log(`--- RiskResult: ${r._id} ---`);
            console.log(`User: ${r.user}`);
            console.log(`Lifestyle ID: ${r.lifestyleDisplay}`);
            console.log(`Score: ${r.riskScore}`);
            
            if (r.lifestyleDisplay) {
                const ls = await Lifestyle.findById(r.lifestyleDisplay);
                if (ls) {
                    console.log(`Lifestyle Document Found: Study=${ls.studyHours}, Sleep=${ls.sleepHours}, Attend=${ls.attendance}`);
                } else {
                    console.log('Lifestyle Document NOT FOUND in DB!');
                }
            } else {
                console.log('lifestyleDisplay field is MISSING/NULL');
            }
        }

        process.exit(0);
    } catch (err) {
        console.error('Debug Error:', err);
        process.exit(1);
    }
}

debug();
