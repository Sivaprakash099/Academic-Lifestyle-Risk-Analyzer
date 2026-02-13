const express = require('express');
const router = express.Router();
const { getDashboard, updateCGPA } = require('../controllers/dashboard.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/', protect, getDashboard);
router.put('/cgpa', protect, updateCGPA);

module.exports = router;
