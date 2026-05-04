const express = require("express");
const {
  getCodeHistory,
  getTutorScore,
  submitCode,
} = require("../controllers/codeController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.post("/submit", protect, submitCode);
router.get("/tutor-score", protect, getTutorScore);
router.get("/history", protect, getCodeHistory);

module.exports = router;
