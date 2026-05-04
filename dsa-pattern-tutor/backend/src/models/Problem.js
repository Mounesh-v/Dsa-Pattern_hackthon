const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a problem title'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please provide a problem description'],
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: [true, 'Please provide a difficulty level'],
  },
  correctPattern: {
    type: String,
    required: [true, 'Please provide the correct pattern'],
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
  wrongPatternExplanations: {
    type: Map,
    of: String,
    default: {},
  },
  tags: {
    type: [String],
    default: [],
  },
  companyFrequency: {
    type: Number,
    default: 0,
  },
  exampleSolution: {
    type: String,
    default: '',
  },
  timeLimit: {
    type: Number,
    default: 60, // seconds
  },
  examples: [{
    input: String,
    output: String,
    explanation: String,
  }],
  constraints: [{
    type: String,
  }],
  isActive: {
    type: Boolean,
    default: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update timestamp on save
problemSchema.pre('save', function () {
  this.updatedAt = Date.now();
});

// Index for faster queries
problemSchema.index({ difficulty: 1, correctPattern: 1 });
problemSchema.index({ companyFrequency: -1 });

module.exports = mongoose.model('Problem', problemSchema);
