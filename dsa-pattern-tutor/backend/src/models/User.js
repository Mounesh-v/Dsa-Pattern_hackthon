const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [80, 'Name cannot exceed 80 characters'],
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email',
    ],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  patternStats: {
    slidingWindow: { attempts: { type: Number, default: 0 }, correct: { type: Number, default: 0 }, avgTime: { type: Number, default: 0 } },
    twoPointers: { attempts: { type: Number, default: 0 }, correct: { type: Number, default: 0 }, avgTime: { type: Number, default: 0 } },
    binarySearch: { attempts: { type: Number, default: 0 }, correct: { type: Number, default: 0 }, avgTime: { type: Number, default: 0 } },
    dynamicProgramming: { attempts: { type: Number, default: 0 }, correct: { type: Number, default: 0 }, avgTime: { type: Number, default: 0 } },
    greedy: { attempts: { type: Number, default: 0 }, correct: { type: Number, default: 0 }, avgTime: { type: Number, default: 0 } },
    backtracking: { attempts: { type: Number, default: 0 }, correct: { type: Number, default: 0 }, avgTime: { type: Number, default: 0 } },
    graphTraversal: { attempts: { type: Number, default: 0 }, correct: { type: Number, default: 0 }, avgTime: { type: Number, default: 0 } },
    dfs: { attempts: { type: Number, default: 0 }, correct: { type: Number, default: 0 }, avgTime: { type: Number, default: 0 } },
    bfs: { attempts: { type: Number, default: 0 }, correct: { type: Number, default: 0 }, avgTime: { type: Number, default: 0 } },
    heap: { attempts: { type: Number, default: 0 }, correct: { type: Number, default: 0 }, avgTime: { type: Number, default: 0 } },
    unionFind: { attempts: { type: Number, default: 0 }, correct: { type: Number, default: 0 }, avgTime: { type: Number, default: 0 } },
    prefixSum: { attempts: { type: Number, default: 0 }, correct: { type: Number, default: 0 }, avgTime: { type: Number, default: 0 } },
    recursion: { attempts: { type: Number, default: 0 }, correct: { type: Number, default: 0 }, avgTime: { type: Number, default: 0 } },
  },
  confusionMatrix: {
    type: Map,
    of: Number,
    default: {},
  },
  speedRecords: {
    bestStreak: { type: Number, default: 0 },
    avgAccuracy: { type: Number, default: 0 },
    totalAttempts: { type: Number, default: 0 },
  },
  achievements: [{
    type: {
      type: String,
      enum: ['first_solve', 'streak_5', 'streak_10', 'streak_20', 'perfect_score', 'speed_demon', 'pattern_master'],
    },
    earnedAt: { type: Date, default: Date.now },
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving
userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method to get JWT token
userSchema.methods.getSignedJwtToken = function () {
  const jwt = require('jsonwebtoken');
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret || jwtSecret.length < 32) {
    throw new Error('JWT_SECRET must be configured and at least 32 characters long.');
  }

  return jwt.sign({ id: this._id, role: this.role }, jwtSecret, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

// Update timestamp on save
userSchema.pre('save', function () {
  this.updatedAt = Date.now();
});

module.exports = mongoose.model('User', userSchema);
