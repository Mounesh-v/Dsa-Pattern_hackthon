const express = require("express");
const {
  createAttempt,
  createSessionAttempt,
  getAttemptHistory,
  getSessionHistory,
  getUserStats,
} = require("../controllers/attemptController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.route("/").post(protect, createAttempt).get(protect, getAttemptHistory);

router.post("/session", protect, createSessionAttempt);
router.get("/session/history", protect, getSessionHistory);
router.get("/stats", protect, getUserStats);

module.exports = router;
