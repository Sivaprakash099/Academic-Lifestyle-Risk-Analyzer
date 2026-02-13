const express = require('express');
const router = express.Router();
const { analyzeRisk, getLatestRisk } = require('../controllers/riskController');
const { protect } = require('../middleware/authMiddleware');

router.post('/analyze', protect, analyzeRisk);
router.get('/latest', protect, getLatestRisk);

module.exports = router;
