const express = require('express');
const router = express.Router();
const { getDashboard, updateCGPA, updateGoals } = require('../controllers/dashboard.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/', protect, getDashboard);
router.put('/cgpa', protect, updateCGPA);
router.put('/goals', protect, updateGoals);

module.exports = router;
