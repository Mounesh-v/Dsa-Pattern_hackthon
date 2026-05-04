const User = require('../models/User');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        patternStats: user.patternStats,
        speedRecords: user.speedRecords,
        achievements: user.achievements,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, email } = req.body;

    const user = await User.findById(req.user.id);

    if (name) user.name = name;
    if (email) user.email = email;

    await user.save();

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get leaderboard
// @route   GET /api/users/leaderboard
// @access  Public
exports.getLeaderboard = async (req, res, next) => {
  try {
    const { limit = 10, mode = 'accuracy' } = req.query;

    let sortField;
    if (mode === 'accuracy') {
      sortField = 'speedRecords.avgAccuracy';
    } else if (mode === 'streak') {
      sortField = 'speedRecords.bestStreak';
    } else if (mode === 'attempts') {
      sortField = 'speedRecords.totalAttempts';
    }

    const users = await User.find({ role: 'user' })
      .select('name speedRecords')
      .sort({ [sortField]: -1 })
      .limit(parseInt(limit));

    const leaderboard = users.map((user, index) => ({
      rank: index + 1,
      name: user.name,
      avgAccuracy: user.speedRecords.avgAccuracy,
      bestStreak: user.speedRecords.bestStreak,
      totalAttempts: user.speedRecords.totalAttempts,
    }));

    res.status(200).json({
      success: true,
      leaderboard,
      mode,
    });
  } catch (error) {
    next(error);
  }
};
