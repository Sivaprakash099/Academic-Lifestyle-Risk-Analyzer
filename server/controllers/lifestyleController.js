const Lifestyle = require('../models/Lifestyle');
const RiskResult = require('../models/RiskResult');

// @desc    Add new lifestyle data
// @route   POST /api/lifestyle
// @access  Private
const addLifestyleData = async (req, res) => {
    const { studyHours, sleepHours, stressLevel, screenTime, activityLevel } = req.body;

    try {
        const lifestyle = new Lifestyle({
            user: req.user._id,
            studyHours,
            sleepHours,
            stressLevel,
            screenTime,
            activityLevel
        });

        const createdLifestyle = await lifestyle.save();
        res.status(201).json(createdLifestyle);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user lifestyle history
// @route   GET /api/lifestyle
// @access  Private
const getLifestyleHistory = async (req, res) => {
    try {
        const history = await Lifestyle.find({ user: req.user._id }).sort({ date: -1 });
        res.json(history);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete lifestyle entry
// @route   DELETE /api/lifestyle/:id
// @access  Private
const deleteLifestyleData = async (req, res) => {
    try {
        const lifestyle = await Lifestyle.findById(req.params.id);

        if (lifestyle) {
            if (lifestyle.user.toString() !== req.user._id.toString()) {
                return res.status(401).json({ message: 'Not authorized' });
            }
            await lifestyle.deleteOne();
            res.json({ message: 'Lifestyle entry removed' });
        } else {
            res.status(404).json({ message: 'Entry not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    addLifestyleData,
    getLifestyleHistory,
    deleteLifestyleData
};
