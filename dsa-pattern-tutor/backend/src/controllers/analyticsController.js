const Analytics = require('../models/Analytics');
const User = require('../models/User');
const Attempt = require('../models/Attempt');

// @desc    Get dashboard data
// @route   GET /api/analytics/dashboard
// @access  Private
exports.getDashboard = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);
    const analytics = await Analytics.findOne({ userId });

    // Get recent attempts
    const recentAttempts = await Attempt.find({ userId })
      .populate('problemId', 'title difficulty')
      .sort({ date: -1 })
      .limit(10);

    // Calculate pattern accuracy for charts
    const patternAccuracy = [];
    if (analytics) {
      for (const [pattern, data] of analytics.patternAccuracy.entries()) {
        patternAccuracy.push({
          pattern,
          accuracy: data.accuracy,
          attempts: data.attempts,
          avgTime: data.avgTime,
        });
      }
    }

    res.status(200).json({
      success: true,
      data: {
        user: {
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
        },
        overallStats: analytics?.overallStats || {
          totalAttempts: 0,
          totalCorrect: 0,
          overallAccuracy: 0,
          avgTime: 0,
          bestStreak: 0,
          currentStreak: 0,
        },
        patternAccuracy,
        weakPatterns: analytics?.weakPatterns || [],
        strongPatterns: analytics?.strongPatterns || [],
        recentAttempts,
        achievements: user.achievements || [],
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get confusion matrix
// @route   GET /api/analytics/confusion-matrix
// @access  Private
exports.getConfusionMatrix = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const analytics = await Analytics.findOne({ userId });

    if (!analytics) {
      return res.status(200).json({
        success: true,
        confusionMatrix: {},
        commonMistakes: [],
      });
    }

    // Convert confusion matrix to array
    const confusionMatrixArray = [];
    for (const [key, count] of analytics.confusionMatrix.entries()) {
      const [selected, correct] = key.split('->');
      confusionMatrixArray.push({
        selectedPattern: selected,
        correctPattern: correct,
        count,
      });
    }

    // Sort by count
    const commonMistakes = confusionMatrixArray.sort((a, b) => b.count - a.count).slice(0, 10);

    res.status(200).json({
      success: true,
      confusionMatrix: Object.fromEntries(analytics.confusionMatrix),
      commonMistakes,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get weak patterns
// @route   GET /api/analytics/weak-patterns
// @access  Private
exports.getWeakPatterns = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const analytics = await Analytics.findOne({ userId });

    if (!analytics) {
      return res.status(200).json({
        success: true,
        weakPatterns: [],
        recommendations: [],
      });
    }

    // Generate recommendations based on weak patterns
    const recommendations = analytics.weakPatterns.map((wp) => ({
      pattern: wp.pattern,
      reason: `Your accuracy is ${wp.accuracy.toFixed(1)}% with ${wp.attempts} attempts. Focus on improving this pattern.`,
      priority: 100 - wp.accuracy,
    }));

    res.status(200).json({
      success: true,
      weakPatterns: analytics.weakPatterns,
      recommendations,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get progress over time
// @route   GET /api/analytics/progress
// @access  Private
exports.getProgress = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const analytics = await Analytics.findOne({ userId });

    if (!analytics) {
      return res.status(200).json({
        success: true,
        progressHistory: [],
        summary: {
          totalDays: 0,
          avgAccuracy: 0,
          totalAttempts: 0,
        },
      });
    }

    // Calculate summary
    const totalDays = analytics.progressHistory.length;
    const avgAccuracy =
      totalDays > 0
        ? analytics.progressHistory.reduce((sum, h) => sum + h.accuracy, 0) / totalDays
        : 0;
    const totalAttempts = analytics.overallStats.totalAttempts;

    res.status(200).json({
      success: true,
      progressHistory: analytics.progressHistory,
      summary: {
        totalDays,
        avgAccuracy,
        totalAttempts,
      },
    });
  } catch (error) {
    next(error);
  }
};
