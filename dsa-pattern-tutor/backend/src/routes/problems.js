const express = require('express');
const {
  getRandomProblem,
  getAdaptiveProblem,
  createProblem,
  updateProblem,
  deleteProblem,
  getAllProblems,
  getProblemById,
} = require('../controllers/problemController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/random', getRandomProblem);
router.get('/adaptive', protect, getAdaptiveProblem);

// Admin routes
router.route('/')
  .get(protect, authorize('admin'), getAllProblems)
  .post(protect, authorize('admin'), createProblem);

router.route('/:id')
  .get(getProblemById)
  .put(protect, authorize('admin'), updateProblem)
  .delete(protect, authorize('admin'), deleteProblem);

module.exports = router;
