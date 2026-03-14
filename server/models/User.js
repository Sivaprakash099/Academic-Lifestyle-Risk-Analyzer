const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email',
        ],
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
        select: false, // Don't return password by default
    },
    role: {
        type: String,
        enum: ['student', 'admin', 'faculty'],
        default: 'student',
    },
    course: {
        type: String,
        default: '',
    },
    year: {
        type: String,
        default: '',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Encrypt password using bcrypt
userSchema.pre('save', async function () { // keeping next for mongoose middleware signature, but using try/catch wrapper logic if needed or standard async
    // Mongoose 5.x+ supports async/await and promises in hooks. 
    // However, if we define 'next', we must call it. 
    // If we return a promise (async function), we generally don't need 'next' unless specifically calling it.
    // BUT Mongoose documentation says:
    // "If you use an async function, you do not need to accept the next parameter"

    // Changing to pure async function without 'next' param to avoid "next is not a function" if called incorrectly
    if (!this.isModified('password')) {
        return; // simply return
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
