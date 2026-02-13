const Profile = require('../models/Profile');
const User = require('../models/User');

// @desc    Get current user profile
// @route   GET /api/profile
// @access  Private
const getProfile = async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user._id }).populate('user', 'name email role');
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }
        res.json(profile);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create or update user profile
// @route   POST /api/profile
// @access  Private
const updateProfile = async (req, res) => {
    const { department, semester } = req.body;

    const profileFields = {
        user: req.user._id,
        department,
        semester
    };

    try {
        let profile = await Profile.findOne({ user: req.user._id });

        if (profile) {
            // Update
            profile = await Profile.findOneAndUpdate(
                { user: req.user._id },
                { $set: profileFields },
                { new: true }
            );
            return res.json(profile);
        }

        // Create
        profile = new Profile(profileFields);
        await profile.save();
        res.json(profile);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getProfile,
    updateProfile
};
