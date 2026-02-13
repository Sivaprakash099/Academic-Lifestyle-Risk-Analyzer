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

        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
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

// @desc    Get user data
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
    res.status(200).json(req.user);
};

module.exports = {
    registerUser,
    loginUser,
    getMe,
};
