const RiskResult = require('../models/RiskResult');
const Lifestyle = require('../models/Lifestyle');
const Dashboard = require('../models/Dashboard');

// @desc    Calculate and get risk analysis
// @route   POST /api/risk/analyze
// @access  Private


// @desc    Calculate and get risk analysis + Auto-update Dashboard
// @route   POST /api/risk/analyze
// @access  Private
const analyzeRisk = async (req, res) => {
    // 1. Accept Lifestyle Data Directly
    const { studyHours, sleepHours, stressLevel, attendance } = req.body;

    try {
        if (studyHours === undefined || sleepHours === undefined || !stressLevel || attendance === undefined) {
            return res.status(400).json({ message: 'Please provide all lifestyle data fields' });
        }

        // 2. Create Lifestyle Document (for record keeping)
        const lifestyle = await Lifestyle.create({
            user: req.user._id,
            studyHours,
            sleepHours,
            stressLevel,
            attendance: attendance, // assuming simple number for now
            screenTime: 0, // Default or add to input if needed
            activityLevel: 'Moderate' // Default or add to input
        });

        // 3. Rule-Based Logic (Same as before but using variables)
        let riskScore = 0;
        let suggestions = [];

        // Study Hours Logic
        if (studyHours < 3) {
            riskScore += 20;
            suggestions.push('Increase study time to at least 3-4 hours daily.');
        } else {
            suggestions.push('Great job maintaining good study hours!');
        }

        // Sleep Hours Logic
        if (sleepHours < 6) {
            riskScore += 20;
            suggestions.push('Prioritize sleep. Aim for 7-8 hours.');
        } else if (sleepHours > 9) {
            suggestions.push('Try to wake up earlier to be more productive.');
        } else {
            suggestions.push('Your sleep schedule looks healthy.');
        }

        // Stress Level Logic
        if (stressLevel === 'High') {
            riskScore += 25;
            suggestions.push('Practice mindfulness to manage high stress.');
        } else if (stressLevel === 'Medium') {
            suggestions.push('Monitor your stress levels.');
        }

        // Attendance Logic
        if (attendance < 75) {
            riskScore += 25;
            suggestions.push('Improve attendance to avoid academic penalties.');
        }

        // Cap Risk Score
        riskScore = Math.min(riskScore, 100);

        // Determine Risk Level
        let riskLevel = 'Low Risk';
        if (riskScore > 60) {
            riskLevel = 'High Risk';
            suggestions.unshift('Urgent: Lifestyle habits indicate high risk.');
        } else if (riskScore > 30) {
            riskLevel = 'Medium Risk';
            suggestions.unshift('Warning: Some habits need improvement.');
        } else {
            suggestions.unshift('Excellent: Low-risk, healthy academic lifestyle.');
        }

        // 4. Save Risk Result
        const riskResult = await RiskResult.create({
            user: req.user._id,
            lifestyleDisplay: lifestyle._id,
            riskScore,
            riskLevel,
            suggestions
        });

        // 5. ATOMIC DASHBOARD UPDATE
        // This is the core requirement: Dashboard updates immediately
        const updatedDashboard = await Dashboard.findOneAndUpdate(
            { user: req.user._id },
            {
                $set: {
                    "stats.studyHours": studyHours,
                    "stats.sleepHours": sleepHours,
                    "stats.stressLevel": stressLevel,
                    "stats.attendance": attendance,
                    currentRisk: riskScore,
                    lastUpdated: Date.now()
                },
                $push: {
                    history: {
                        $each: [{
                            date: Date.now(),
                            riskScore: riskScore,
                            breakdown: { studyHours, sleepHours }
                        }],
                        $position: 0 // Add to TOP of array
                    }
                }
            },
            { new: true, upsert: true } // Create if doesn't exist (safety)
        );

        res.json(riskResult);

    } catch (error) {
        console.error("Analysis Error:", error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get latest risk result
// @route   GET /api/risk/latest
// @access  Private
const getLatestRisk = async (req, res) => {
    try {
        const latestRisk = await RiskResult.findOne({ user: req.user._id }).sort({ createdAt: -1 }).populate('lifestyleDisplay');
        res.json(latestRisk);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    analyzeRisk,
    getLatestRisk
};
