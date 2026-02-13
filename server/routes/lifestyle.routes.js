const express = require('express');
const router = express.Router();
const { addLifestyleData, getLifestyleHistory, deleteLifestyleData } = require('../controllers/lifestyleController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, addLifestyleData)
    .get(protect, getLifestyleHistory);

router.route('/:id')
    .delete(protect, deleteLifestyleData);

module.exports = router;
