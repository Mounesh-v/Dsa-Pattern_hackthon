const express = require("express");
const {
  createAttempt,
  createSessionAttempt,
  getAttemptHistory,
  getUserStats,
} = require("../controllers/attemptController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.route("/").post(protect, createAttempt).get(protect, getAttemptHistory);

router.post("/session", protect, createSessionAttempt);
router.get("/stats", protect, getUserStats);

module.exports = router;
