const mongoose = require('mongoose');

const lifestyleSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    studyHours: {
        type: Number,
        required: true,
    },
    sleepHours: {
        type: Number,
        required: true,
    },
    stressLevel: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        required: true,
    },
    attendance: {
        type: Number,
        required: true,
        default: 0
    },
    screenTime: {
        type: Number,
        required: true,
    },
    activityLevel: {
        type: String, // e.g., "None", "Low", "Moderate", "High"
        enum: ['None', 'Low', 'Moderate', 'High'],
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('Lifestyle', lifestyleSchema);
