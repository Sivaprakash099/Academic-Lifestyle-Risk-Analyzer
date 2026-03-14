const mongoose = require('mongoose');
const dotenv = require('dotenv');
const RiskResult = require('./models/RiskResult');
const Lifestyle = require('./models/Lifestyle');
const Dashboard = require('./models/Dashboard');

dotenv.config();

async function checkData() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB');

        const results = await RiskResult.find().populate('lifestyleDisplay').limit(5);
        
        console.log('Sample Risk Results:');
        results.forEach(r => {
            console.log({
                id: r._id,
                score: r.riskScore,
                level: r.riskLevel,
                lifestyle: r.lifestyleDisplay ? {
                    id: r.lifestyleDisplay._id,
                    study: r.lifestyleDisplay.studyHours,
                    sleep: r.lifestyleDisplay.sleepHours,
                    stress: r.lifestyleDisplay.stressLevel,
                    attendance: r.lifestyleDisplay.attendance
                } : 'NULL'
            });
        });

        const dashboard = await Dashboard.findOne();
        if (dashboard) {
            console.log('Dashboard History Sample:', dashboard.history.slice(0, 2));
        }

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkData();
