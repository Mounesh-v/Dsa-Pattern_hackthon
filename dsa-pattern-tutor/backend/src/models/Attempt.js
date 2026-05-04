const mongoose = require('mongoose');

const attemptSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  problemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem',
    required: true,
  },
  selectedPattern: {
    type: String,
    required: true,
    enum: [
      'slidingWindow',
      'twoPointers',
      'binarySearch',
      'dynamicProgramming',
      'greedy',
      'backtracking',
      'graphTraversal',
      'dfs',
      'bfs',
      'heap',
      'unionFind',
      'prefixSum',
      'recursion',
    ],
  },
  isCorrect: {
    type: Boolean,
    required: true,
  },
  timeTaken: {
    type: Number,
    required: true, // seconds
  },
  mode: {
    type: String,
    enum: ['practice', 'blind', 'speed', 'adaptive'],
    default: 'blind',
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

// Index for faster queries
attemptSchema.index({ userId: 1, date: -1 });
attemptSchema.index({ problemId: 1 });
attemptSchema.index({ userId: 1, isCorrect: 1 });

module.exports = mongoose.model('Attempt', attemptSchema);
