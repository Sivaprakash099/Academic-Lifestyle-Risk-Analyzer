const RiskAnalysis = require('../models/RiskAnalysis');
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
    console.log("Analyze Risk: Received Body -", req.body);
    
    let { studyHours, sleepHours, stressLevel, attendance } = req.body;
    
    // Explicitly parse to Number to avoid 0/string issues
    studyHours = Number(studyHours);
    sleepHours = Number(sleepHours);
    attendance = Number(attendance);

    try {
        if (isNaN(studyHours) || isNaN(sleepHours) || !stressLevel || isNaN(attendance)) {
            console.warn("Analyze Risk: Validation Failed", { studyHours, sleepHours, stressLevel, attendance });
            return res.status(400).json({ message: 'Please provide all lifestyle data fields as valid numbers' });
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

        // 3. Precise Scoring Logic (Step 1 & 2)
        let studyScore = 0;
        if (studyHours > 6) studyScore = 0;
        else if (studyHours >= 4) studyScore = 3;
        else if (studyHours >= 2) studyScore = 6;
        else studyScore = 9;

        let sleepScore = 0;
        if (sleepHours >= 7 && sleepHours <= 8) sleepScore = 0;
        else if (sleepHours >= 5) sleepScore = 4;
        else sleepScore = 8;

        let stressScore = 0;
        if (stressLevel === 'Low') stressScore = 2;
        else if (stressLevel === 'Medium') stressScore = 5;
        else stressScore = 8;

        let attendanceScore = 0;
        if (attendance > 90) attendanceScore = 0;
        else if (attendance >= 75) attendanceScore = 3;
        else if (attendance >= 60) attendanceScore = 6;
        else attendanceScore = 9;

        const totalRiskScoreValue = studyScore + sleepScore + stressScore + attendanceScore;

        // Step 3: Normalize Risk Score (0-9 Scale)
        // Normalized = (Total / 34) * 9, rounded to nearest whole number
        const normalizedScore = Math.round((totalRiskScoreValue / 34) * 9);

        // Step 4: Risk Level Classification
        let riskLevel = 'Low Risk';
        if (normalizedScore >= 7) riskLevel = 'High Risk';
        else if (normalizedScore >= 4) riskLevel = 'Medium Risk';
        else riskLevel = 'Low Risk';

        const totalRiskScore = normalizedScore; // Use normalized score for storage and display

        // Suggestions based on user requirements
        let suggestions = [];
        if (studyHours < 4) suggestions.push('Increase study time to at least 4–6 hours daily.');
        if (sleepHours < 6) suggestions.push('Improve sleep schedule and aim for 7–8 hours of sleep.');
        if (stressLevel === 'High') suggestions.push('Practice stress management such as exercise, meditation, or breaks.');
        if (attendance < 75) suggestions.push('Improve class attendance to maintain academic performance.');
        
        if (riskLevel === 'Low Risk' && suggestions.length === 0) {
            suggestions.push('Great job! Your academic lifestyle is healthy. Maintain your current study habits, sleep schedule, and attendance.');
        } else if (suggestions.length === 0) {
            suggestions.push('Keep up the consistent effort and look for minor improvements.');
        }

        // 4. Save Risk Analysis with direct snapshots
        const riskResult = await RiskAnalysis.create({
            userId: req.user._id,
            lifestyleDisplay: lifestyle._id,
            riskScore: totalRiskScore,
            riskLevel: riskLevel,
            suggestions,
            studyHours,
            sleepHours,
            stressLevel,
            attendance
        });

        // 5. ATOMIC DASHBOARD UPDATE
        const updatedDashboard = await Dashboard.findOneAndUpdate(
            { user: req.user._id },
            {
                $set: {
                    "stats.studyHours": studyHours,
                    "stats.sleepHours": sleepHours,
                    "stats.stressLevel": stressLevel,
                    "stats.attendance": attendance,
                    currentRisk: totalRiskScore,
                    lastUpdated: Date.now()
                },
                $push: {
                    history: {
                        $each: [{
                            date: Date.now(),
                            riskScore: totalRiskScore,
                            riskLevel: riskLevel, // Added riskLevel to history
                            breakdown: { studyHours, sleepHours, stressLevel, attendance } // More detailed breakdown
                        }],
                        $position: 0
                    }
                }
            },
            { new: true, upsert: true }
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
        const latestRisk = await RiskAnalysis.findOne({ userId: req.user._id }).sort({ createdAt: -1 }).populate('lifestyleDisplay');
        res.json(latestRisk);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    analyzeRisk,
    getLatestRisk
};
