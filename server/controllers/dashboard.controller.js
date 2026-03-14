const Dashboard = require('../models/Dashboard');
const User = require('../models/User');

// @desc    Get current user's dashboard data
// @route   GET /api/dashboard
// @access  Private
const getDashboard = async (req, res) => {
    try {
        console.log("Dashboard Controller: Fetching for user", req.user.id);
        // Find dashboard for current user
        let dashboard = await Dashboard.findOne({ user: req.user.id });

        // Auto-create if not exists (self-healing for old users)
        if (!dashboard) {
            console.log(`Dashboard not found for user ${req.user.id}, creating new one...`);
            dashboard = await Dashboard.create({
                user: req.user.id,
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
                    completedSemesters: 0
                },
                goals: {
                    targetStudyHours: 0,
                    targetSleepHours: 0,
                    targetAttendance: 0
                },
                currentRisk: 0,
                history: []
            });
        }

        // Fetch user name to display in welcome message
        const user = await User.findById(req.user.id).select('name');

        res.status(200).json({
            user: {
                name: user ? user.name : 'Student'
            },
            stats: dashboard.stats,
            cgpa: dashboard.cgpa,
            goals: dashboard.goals || {
                targetStudyHours: 0,
                targetSleepHours: 0,
                targetAttendance: 0
            },
            currentRisk: dashboard.currentRisk,
            history: dashboard.history
        });

    } catch (error) {
        console.error("Dashboard Fetch Error:", error);
        res.status(500).json({ message: 'Server Error fetching dashboard' });
    }
};

// @desc    Update CGPA details
// @route   PUT /api/dashboard/cgpa
// @access  Private
const updateCGPA = async (req, res) => {
    try {
        const { currentCGPA, targetCGPA, totalSemesters, completedSemesters } = req.body;

        const updatedDashboard = await Dashboard.findOneAndUpdate(
            { user: req.user.id },
            {
                $set: {
                    cgpa: {
                        currentCGPA,
                        targetCGPA,
                        totalSemesters,
                        completedSemesters,
                        lastUpdated: Date.now()
                    }
                }
            },
            { new: true }
        );

        if (!updatedDashboard) {
            return res.status(404).json({ message: 'Dashboard not found' });
        }

        res.json(updatedDashboard.cgpa);
    } catch (error) {
        console.error("CGPA Update Error:", error);
        res.status(500).json({ message: 'Server Error updating CGPA' });
    }
};

// @desc    Update Academic Goals
// @route   PUT /api/dashboard/goals
// @access  Private
const updateGoals = async (req, res) => {
    try {
        const { targetStudyHours, targetSleepHours, targetAttendance } = req.body;

        const updatedDashboard = await Dashboard.findOneAndUpdate(
            { user: req.user.id },
            {
                $set: {
                    goals: {
                        targetStudyHours,
                        targetSleepHours,
                        targetAttendance
                    }
                }
            },
            { new: true }
        );

        if (!updatedDashboard) {
            return res.status(404).json({ message: 'Dashboard not found' });
        }

        res.json(updatedDashboard.goals);
    } catch (error) {
        console.error("Goals Update Error:", error);
        res.status(500).json({ message: 'Server Error updating Goals' });
    }
};

module.exports = {
    getDashboard,
    updateCGPA,
    updateGoals
};
