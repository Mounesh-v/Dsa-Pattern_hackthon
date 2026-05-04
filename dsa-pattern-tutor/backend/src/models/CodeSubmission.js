const mongoose = require("mongoose");

const codeSubmissionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  problemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Problem",
    required: true,
  },
  language: {
    type: String,
    default: "javascript",
  },
  code: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    min: 0,
    max: 100,
    required: true,
  },
  analysis: {
    summary: String,
    approachFeedback: String,
    complexity: String,
    improvements: [String],
    keyPoints: [String],
    expectedOutput: String,
    codeOutput: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

codeSubmissionSchema.index({ userId: 1, problemId: 1 }, { unique: true });
codeSubmissionSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model("CodeSubmission", codeSubmissionSchema);
