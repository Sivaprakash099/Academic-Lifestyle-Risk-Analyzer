const express = require('express');
const router = express.Router();
const { registerUser, loginUser, googleLogin, getMe, updateProfile, updatePassword, deleteAccount } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google', googleLogin);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/password', protect, updatePassword);
router.delete('/delete', protect, deleteAccount);
// Legacy compatibility if frontend uses /profile
router.get('/profile', protect, getMe);

module.exports = router;
