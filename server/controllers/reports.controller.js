const RiskResult = require('../models/RiskResult');
const Dashboard = require('../models/Dashboard');
const Lifestyle = require('../models/Lifestyle');

// @desc    Get comprehensive reports data
// @route   GET /api/reports
// @access  Private
const getReports = async (req, res) => {
    try {
        const userId = req.user.id;

        // 1. Fetch Risk History (latest first)
        const riskHistory = await RiskResult.find({ user: userId })
            .sort({ createdAt: -1 })
            .populate('lifestyleDisplay');

        // 2. Fetch Dashboard for current stats/CGPA
        const dashboard = await Dashboard.findOne({ user: userId });

        // 3. Calculate Averages
        let totalStudy = 0;
        let totalSleep = 0;
        let totalAttendance = 0;
        let count = 0;

        // We can get averages from the populated lifestyleDisplay in riskHistory
        // OR fetch all Lifestyle documents separately. 
        // Using riskHistory is better as it ties to specific analyses.

        const validHistory = riskHistory.filter(item => item.lifestyleDisplay);

        if (validHistory.length > 0) {
            validHistory.forEach(item => {
                const ls = item.lifestyleDisplay;
                totalStudy += ls.studyHours || 0;
                totalSleep += ls.sleepHours || 0;
                totalAttendance += ls.attendance || 0;
            });
            count = validHistory.length;
        }

        const averages = {
            studyHours: count > 0 ? (totalStudy / count).toFixed(1) : 0,
            sleepHours: count > 0 ? (totalSleep / count).toFixed(1) : 0,
            attendance: count > 0 ? (totalAttendance / count).toFixed(1) : 0
        };

        // 4. Construct Response
        const reportData = {
            riskHistory: riskHistory.map(item => ({
                id: item._id,
                date: item.createdAt,
                riskScore: item.riskScore,
                riskLevel: item.riskLevel
            })),
            averages,
            cgpa: dashboard ? dashboard.cgpa : {
                currentCGPA: 0,
                targetCGPA: 0,
                required: 0 // You might want to calculate this specifically if not stored
            }
        };

        res.status(200).json(reportData);

    } catch (error) {
        console.error("Reports Error:", error);
        res.status(500).json({ message: "Server Error fetching reports" });
    }
};

module.exports = { getReports };
