const mongoose = require("mongoose");

const sessionHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  totalQuestions: {
    type: Number,
    required: true,
  },
  correctAnswers: {
    type: Number,
    required: true,
  },
  incorrectAnswers: {
    type: Number,
    required: true,
  },
  sessionAccuracy: {
    type: Number,
    required: true,
  },
  weakQuestions: {
    type: Number,
    default: 0,
  },
  weakCorrect: {
    type: Number,
    default: 0,
  },
  weakAccuracy: {
    type: Number,
    default: 0,
  },
  randomCorrect: {
    type: Number,
    default: 0,
  },
  totalTime: {
    type: Number,
    default: 0,
  },
  averageTime: {
    type: Number,
    default: 0,
  },
  topConfusions: [
    {
      selectedPattern: String,
      correctPattern: String,
      count: Number,
    },
  ],
  improvementNotes: [
    {
      pattern: String,
      sessionAccuracy: Number,
      previousAccuracy: Number,
      improved: Boolean,
    },
  ],
  attempts: [
    {
      problemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Problem",
      },
      selectedPattern: String,
      correctPattern: String,
      isCorrect: Boolean,
      timeTaken: Number,
      source: String,
    },
  ],
  completedAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
});

sessionHistorySchema.index({ userId: 1, completedAt: -1 });

module.exports = mongoose.model("SessionHistory", sessionHistorySchema);
