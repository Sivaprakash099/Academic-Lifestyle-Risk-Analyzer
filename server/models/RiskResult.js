const mongoose = require('mongoose');

const riskResultSchema = new mongoose.Schema({
    user: {
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
        type: [String], // Array of suggestion strings
        default: []
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('RiskResult', riskResultSchema);
