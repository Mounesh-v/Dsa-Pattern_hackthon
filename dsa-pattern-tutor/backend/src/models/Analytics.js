const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  patternAccuracy: {
    type: Map,
    of: {
      attempts: { type: Number, default: 0 },
      correct: { type: Number, default: 0 },
      accuracy: { type: Number, default: 0 },
      avgTime: { type: Number, default: 0 },
    },
    default: {},
  },
  confusionMatrix: {
    type: Map,
    of: Number,
    default: {},
  },
  recommendations: [{
    pattern: String,
    reason: String,
    priority: { type: Number, default: 0 },
  }],
  weakPatterns: [{
    pattern: String,
    accuracy: { type: Number, default: 0 },
    attempts: { type: Number, default: 0 },
  }],
  strongPatterns: [{
    pattern: String,
    accuracy: { type: Number, default: 0 },
    attempts: { type: Number, default: 0 },
  }],
  overallStats: {
    totalAttempts: { type: Number, default: 0 },
    totalCorrect: { type: Number, default: 0 },
    overallAccuracy: { type: Number, default: 0 },
    avgTime: { type: Number, default: 0 },
    bestStreak: { type: Number, default: 0 },
    currentStreak: { type: Number, default: 0 },
  },
  progressHistory: [{
    date: { type: Date, default: Date.now },
    accuracy: { type: Number, default: 0 },
    attempts: { type: Number, default: 0 },
    avgTime: { type: Number, default: 0 },
  }],
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

// Update timestamp on save
analyticsSchema.pre('save', function () {
  this.lastUpdated = Date.now();
});

module.exports = mongoose.model('Analytics', analyticsSchema);
