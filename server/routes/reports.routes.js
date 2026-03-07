const express = require('express');
const router = express.Router();
const { getReports, clearHistory } = require('../controllers/reports.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/', protect, getReports);
router.delete('/clear', protect, clearHistory);

module.exports = router;
