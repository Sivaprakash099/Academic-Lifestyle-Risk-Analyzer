const mongoose = require('mongoose');

const riskAnalysisSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    lifestyleDisplay: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lifestyle'
    },
    riskScore: {
        type: Number,
        required: true,
    },
    riskLevel: {
        type: String,
        enum: ['Low Risk', 'Medium Risk', 'High Risk'],
        required: true,
    },
    suggestions: {
        type: [String],
        default: []
    },
    // Snapshots for immutable history
    studyHours: { type: Number },
    sleepHours: { type: Number },
    stressLevel: { type: String },
    attendance: { type: Number },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('RiskAnalysis', riskAnalysisSchema);
