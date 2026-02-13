const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    console.log(`Register attempt for email: ${email}`);

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            console.log('User already exists');
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            name,
            email,
            password,
            role: role || 'student',
        });

        if (user) {
            console.log(`[REGISTER DEBUG] User registered successfully: ${user._id}`);
            console.log(`[REGISTER DEBUG] Stored Password Hash: ${user.password ? user.password.substring(0, 10) + '...' : 'MISSING'}`);
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            console.log('[REGISTER DEBUG] Invalid user data');
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    console.log(`[LOGIN DEBUG] Attempt for email: ${email}`);

    try {
        const user = await User.findOne({ email });

        if (!user) {
            console.log('[LOGIN DEBUG] User not found in database');
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        console.log(`[LOGIN DEBUG] User found: ${user.email}`);
        console.log(`[LOGIN DEBUG] Stored Password Hash: ${user.password ? user.password.substring(0, 10) + '...' : 'MISSING'}`);

        const isMatch = await user.matchPassword(password);
        console.log(`[LOGIN DEBUG] Password Match Result: ${isMatch}`);

        if (!isMatch) {
            console.log('[LOGIN DEBUG] Password incorrect');
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        console.log('[LOGIN DEBUG] Login successful, generating token');
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } catch (error) {
        console.error('[LOGIN DEBUG] Login error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (user) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    registerUser,
    loginUser,
    getUserProfile
};
