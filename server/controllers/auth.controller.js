const User = require('../models/User');
const Dashboard = require('../models/Dashboard'); // Ensure this model exists
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // 1. Validation
        if (!name || !email || !password) {
            res.status(400);
            throw new Error('Please add all fields');
        }

        // 2. Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            res.status(400);
            throw new Error('User already exists');
        }

        // 3. Create user
        const user = await User.create({
            name,
            email,
            password,
        });

        if (user) {
            // 4. Create initial dashboard for the user
            await Dashboard.create({
                user: user._id,
                stats: {
                    studyHours: 0,
                    sleepHours: 0,
                    stressLevel: 'Not Assessed',
                    attendance: 0
                },
                cgpa: {
                    currentCGPA: 0,
                    targetCGPA: 0
                }
            });

            // 5. Respond with user data and token
            res.status(201).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                course: user.course || '',
                year: user.year || '',
                token: generateToken(user._id),
            });
        } else {
            res.status(400);
            throw new Error('Invalid user data');
        }
    } catch (error) {
        // Handle Mongoose duplicate key error explicitly if needed, though check above handles it
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        res.status(res.statusCode === 200 ? 500 : res.statusCode).json({
            message: error.message,
            stack: process.env.NODE_ENV === 'production' ? null : error.stack,
        });
    }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400);
            throw new Error('Please add email and password');
        }

        // Check for user email
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            res.status(404);
            throw new Error('Account not found. Please create a new account.');
        }

        if (await bcrypt.compare(password, user.password)) {
            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                course: user.course || '',
                year: user.year || '',
                token: generateToken(user._id),
            });
        } else {
            res.status(401);
            throw new Error('Invalid credentials');
        }
    } catch (error) {
        res.status(res.statusCode === 200 ? 500 : res.statusCode).json({
            message: error.message,
            stack: process.env.NODE_ENV === 'production' ? null : error.stack,
        });
    }
};

// @desc    Google login
// @route   POST /api/auth/google
// @access  Public
const googleLogin = async (req, res) => {
    try {
        const { name, email, photo } = req.body;

        if (!email) {
            res.status(400);
            throw new Error('Email is required');
        }

        // 1. Check if user exists
        let user = await User.findOne({ email });

        if (!user) {
            // 2. Create user if doesn't exist
            // For Google users, we set a dummy password since they use OAuth
            const dummyPassword = Math.random().toString(36).slice(-12);
            user = await User.create({
                name: name || email.split('@')[0],
                email,
                password: dummyPassword,
            });

            // 3. Create initial dashboard for the new Google user
            await Dashboard.create({
                user: user._id,
                stats: {
                    studyHours: 0,
                    sleepHours: 0,
                    stressLevel: 'Not Assessed',
                    attendance: 0
                },
                cgpa: {
                    currentCGPA: 0,
                    targetCGPA: 0
                }
            });
        }

        // 4. Respond with user data and token
        res.status(200).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            course: user.course || '',
            year: user.year || '',
            token: generateToken(user._id),
        });

    } catch (error) {
        res.status(res.statusCode === 200 ? 500 : res.statusCode).json({
            message: error.message,
        });
    }
};

// @desc    Get user data
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
    res.status(200).json(req.user);
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.name = req.body.name || user.name;
            user.course = req.body.course !== undefined ? req.body.course : user.course;
            user.year = req.body.year !== undefined ? req.body.year : user.year;

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                course: updatedUser.course,
                year: updatedUser.year,
                token: generateToken(updatedUser._id),
            });
        } else {
            res.status(404);
            throw new Error('User not found');
        }
    } catch (error) {
        res.status(res.statusCode === 200 ? 500 : res.statusCode).json({
            message: error.message,
        });
    }
};

const Lifestyle = require('../models/Lifestyle');
const Profile = require('../models/Profile');
const RiskAnalysis = require('../models/RiskAnalysis');

// @desc    Update user password
// @route   PUT /api/auth/password
// @access  Private
const updatePassword = async (req, res) => {
    try {
        const { password } = req.body;

        if (!password || password.length < 6) {
            res.status(400);
            throw new Error('Password must be at least 6 characters long');
        }

        const user = await User.findById(req.user._id);

        if (user) {
            user.password = password;
            await user.save();
            res.status(200).json({ message: 'Password updated successfully' });
        } else {
            res.status(404);
            throw new Error('User not found');
        }
    } catch (error) {
        res.status(res.statusCode === 200 ? 500 : res.statusCode).json({
            message: error.message,
        });
    }
};

// @desc    Delete user account and all associated data
// @route   DELETE /api/auth/delete
// @access  Private
const deleteAccount = async (req, res) => {
    try {
        const userId = req.user._id;

        // 1. Delete all associated data
        await Dashboard.deleteMany({ user: userId });
        await RiskAnalysis.deleteMany({ user: userId });
        await Lifestyle.deleteMany({ user: userId });
        await Profile.deleteOne({ user: userId });
        
        // 2. Delete the user
        const user = await User.findByIdAndDelete(userId);

        if (!user) {
            res.status(404);
            throw new Error('User not found');
        }

        res.status(200).json({ message: 'Account and all associated data deleted successfully' });
    } catch (error) {
        res.status(res.statusCode === 200 ? 500 : res.statusCode).json({
            message: error.message,
        });
    }
};

module.exports = {
    registerUser,
    loginUser,
    googleLogin,
    getMe,
    updateProfile,
    updatePassword,
    deleteAccount,
};
