const RiskAnalysis = require('../models/RiskAnalysis');
const Dashboard = require('../models/Dashboard');
const Lifestyle = require('../models/Lifestyle');

// @desc    Get comprehensive reports data
// @route   GET /api/reports
// @access  Private
const getReports = async (req, res) => {
    try {
        const userId = req.user.id;

        // 1. Fetch Risk History (latest first)
        const riskHistory = await RiskAnalysis.find({ userId: userId })
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
        const mappedHistory = riskHistory.map(item => {
            const ls = item.lifestyleDisplay || {};
            
            // Ensure riskLevel exists
            const riskLevel = item.riskLevel || 'Low Risk';

            return {
                id: item._id,
                createdAt: item.createdAt,
                date: item.createdAt, // For compatibility
                riskScore: item.riskScore !== undefined ? item.riskScore : 0,
                riskLevel: riskLevel,
                // Direct Snapshot Fields (V2) or Fallback to lifestyleDisplay (V1)
                studyHours: item.studyHours !== undefined ? item.studyHours : (ls.studyHours !== undefined ? ls.studyHours : 0),
                sleepHours: item.sleepHours !== undefined ? item.sleepHours : (ls.sleepHours !== undefined ? ls.sleepHours : 0),
                stressLevel: item.stressLevel || ls.stressLevel || 'Low',
                attendance: item.attendance !== undefined ? item.attendance : (ls.attendance !== undefined ? ls.attendance : 0)
            };
        });

        const reportData = {
            analysis: mappedHistory,
            riskHistory: mappedHistory,
            averages,
            cgpa: dashboard ? dashboard.cgpa : {
                currentCGPA: 0,
                targetCGPA: 0,
                required: 0
            }
        };

        res.status(200).json(reportData);

    } catch (error) {
        console.error("Reports Error:", error);
        res.status(500).json({ message: "Server Error fetching reports" });
    }
};

const clearHistory = async (req, res) => {
    try {
        const userId = req.user.id;

        // 1. Delete all Lifestyle documents for this user
        await Lifestyle.deleteMany({ user: userId });

        // 2. Delete all RiskAnalysis documents for this user
        await RiskAnalysis.deleteMany({ userId: userId });

        // 3. Reset Dashboard history, stats, and CGPA
        await Dashboard.findOneAndUpdate(
            { user: userId },
            {
                $set: {
                    currentRisk: 0,
                    history: [],
                    stats: {
                        studyHours: 0,
                        sleepHours: 0,
                        stressLevel: 'Not Assessed',
                        attendance: 0
                    },
                    cgpa: {
                        currentCGPA: 0,
                        targetCGPA: 0,
                        totalSemesters: 8,
                        completedSemesters: 0,
                        lastUpdated: Date.now()
                    }
                }
            }
        );

        res.status(200).json({
            success: true,
            message: "All history deleted successfully"
        });
    } catch (error) {
        console.error("Clear History Error:", error);
        res.status(500).json({ success: false, message: "Server Error clearing history" });
    }
};

module.exports = { getReports, clearHistory };
