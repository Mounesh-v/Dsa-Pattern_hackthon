const express = require('express');
const {
  getDashboard,
  getConfusionMatrix,
  getWeakPatterns,
  getProgress,
} = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/dashboard', protect, getDashboard);
router.get('/confusion-matrix', protect, getConfusionMatrix);
router.get('/weak-patterns', protect, getWeakPatterns);
router.get('/progress', protect, getProgress);

module.exports = router;
