const mongoose = require('mongoose');

const dashboardSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
        unique: true
    },
    stats: {
        studyHours: { type: Number, default: 0 },
        sleepHours: { type: Number, default: 0 },
        stressLevel: { type: String, default: 'Not Assessed', enum: ['Low', 'Medium', 'High', 'Not Assessed'] },
        attendance: { type: Number, default: 0 }
    },
    cgpa: {
        currentCGPA: { type: Number, default: 0 },
        targetCGPA: { type: Number, default: 0 },
        totalSemesters: { type: Number, default: 8 },
        completedSemesters: { type: Number, default: 0 },
        lastUpdated: { type: Date, default: Date.now }
    },
    goals: {
        targetStudyHours: { type: Number, default: 0 },
        targetSleepHours: { type: Number, default: 0 },
        targetAttendance: { type: Number, default: 0 }
    },
    currentRisk: {
        type: Number,
        default: 0
    },
    history: [{
        date: { type: Date, default: Date.now },
        riskScore: { type: Number, required: true },
        breakdown: Object
    }],
    lastUpdated: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Dashboard', dashboardSchema);
