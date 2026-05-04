const express = require("express");
const {
  getRandomProblem,
  getAdaptiveProblem,
  getSessionProblems,
  createProblem,
  updateProblem,
  deleteProblem,
  getAllProblems,
  getProblemById,
  getLeetCodeProblem,
  getLeetCodeProblems,
} = require("../controllers/problemController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

// Public routes
router.get("/random", getRandomProblem);
router.get("/leetcode-list", getLeetCodeProblems);
router.get("/leetcode", getLeetCodeProblem);
router.get("/adaptive", protect, getAdaptiveProblem);
router.get("/session", protect, getSessionProblems);

// Admin routes
router
  .route("/")
  .get(protect, authorize("admin"), getAllProblems)
  .post(protect, authorize("admin"), createProblem);

router
  .route("/:id")
  .get(getProblemById)
  .put(protect, authorize("admin"), updateProblem)
  .delete(protect, authorize("admin"), deleteProblem);

module.exports = router;
