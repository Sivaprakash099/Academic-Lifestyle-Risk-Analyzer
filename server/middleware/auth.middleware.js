const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log("Auth Middleware: Token Verified. User ID:", decoded.id);

            // Get user from the token
            req.user = await User.findById(decoded.id);

            if (!req.user) {
                console.log("Auth Middleware: User not found in DB");
                return res.status(401).json({ message: 'Not authorized, user not found' });
            }

            console.log("Auth Middleware: User attached to req");

            next();
        } catch (error) {
            console.error(error);
            // Return 401 specifically for auth failures
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(401).json({ message: 'Not authorized as an admin' });
    }
};

module.exports = { protect, admin };
