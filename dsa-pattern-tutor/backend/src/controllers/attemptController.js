const Attempt = require("../models/Attempt");
const Problem = require("../models/Problem");
const User = require("../models/User");
const Analytics = require("../models/Analytics");

// @desc    Create attempt
// @route   POST /api/attempts
// @access  Private
exports.createAttempt = async (req, res, next) => {
  try {
    const { problemId, selectedPattern, timeTaken, mode } = req.body;
    const userId = req.user.id;

    // Get problem to check correct pattern
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    const isCorrect = selectedPattern === problem.correctPattern;

    // Create attempt
    const attempt = await Attempt.create({
      userId,
      problemId,
      selectedPattern,
      isCorrect,
      timeTaken,
      mode: mode || "blind",
    });

    // Update user stats
    await updateUserStats(userId, problem.correctPattern, isCorrect, timeTaken);

    // Update analytics
    await updateAnalytics(
      userId,
      problem.correctPattern,
      selectedPattern,
      isCorrect,
      timeTaken,
    );

    // Get explanation
    const explanation = isCorrect
      ? `Correct! ${problem.correctPattern} is the right pattern for this problem.`
      : problem.wrongPatternExplanations.get(selectedPattern) ||
        `Incorrect. The correct pattern is ${problem.correctPattern}. ${selectedPattern} doesn't work here because...`;

    res.status(201).json({
      success: true,
      attempt: {
        id: attempt._id,
        isCorrect,
        correctPattern: problem.correctPattern,
        selectedPattern,
        explanation,
        timeTaken,
        exampleSolution: isCorrect ? problem.exampleSolution : null,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit a full session of practice attempts
// @route   POST /api/attempts/session
// @access  Private
exports.createSessionAttempt = async (req, res, next) => {
  try {
    const { attempts } = req.body;
    const userId = req.user.id;

    if (!Array.isArray(attempts) || attempts.length === 0) {
      return res.status(400).json({ message: "No session attempts provided" });
    }

    const analytics = await Analytics.findOne({ userId });
    const previousOverallAccuracy =
      analytics?.overallStats?.overallAccuracy || 0;
    const previousPatternAccuracy = new Map(analytics?.patternAccuracy || []);

    const sessionStats = {
      totalQuestions: 0,
      correctAnswers: 0,
      weakQuestions: 0,
      weakCorrect: 0,
      randomCorrect: 0,
      totalTime: 0,
      patternBreakdown: {},
      confusions: {},
    };

    const createdAttempts = [];

    for (const attemptItem of attempts) {
      const {
        problemId,
        selectedPattern,
        timeTaken = 0,
        source = "random",
      } = attemptItem;
      const problem = await Problem.findById(problemId);
      if (!problem) continue;

      const isCorrect = selectedPattern === problem.correctPattern;
      const attemptData = {
        userId,
        problemId,
        selectedPattern,
        isCorrect,
        timeTaken,
        mode: "practice",
      };

      createdAttempts.push(attemptData);
      sessionStats.totalQuestions += 1;
      sessionStats.totalTime += timeTaken;
      if (isCorrect) {
        sessionStats.correctAnswers += 1;
      }
      if (source === "weak") {
        sessionStats.weakQuestions += 1;
        if (isCorrect) {
          sessionStats.weakCorrect += 1;
        }
      } else if (isCorrect) {
        sessionStats.randomCorrect += 1;
      }

      const patternKey = problem.correctPattern;
      if (!sessionStats.patternBreakdown[patternKey]) {
        sessionStats.patternBreakdown[patternKey] = { attempts: 0, correct: 0 };
      }
      sessionStats.patternBreakdown[patternKey].attempts += 1;
      if (isCorrect) {
        sessionStats.patternBreakdown[patternKey].correct += 1;
      }

      if (!isCorrect) {
        const confusionKey = `${selectedPattern}->${problem.correctPattern}`;
        sessionStats.confusions[confusionKey] =
          (sessionStats.confusions[confusionKey] || 0) + 1;
      }

      await updateUserStats(
        userId,
        problem.correctPattern,
        isCorrect,
        timeTaken,
      );
      await updateAnalytics(
        userId,
        problem.correctPattern,
        selectedPattern,
        isCorrect,
        timeTaken,
      );
    }

    if (createdAttempts.length > 0) {
      await Attempt.insertMany(createdAttempts);
    }

    const topConfusions = Object.entries(sessionStats.confusions)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([key, count]) => {
        const [selected, correct] = key.split("->");
        return {
          selectedPattern: selected,
          correctPattern: correct,
          count,
        };
      });

    const improvementNotes = Object.entries(sessionStats.patternBreakdown).map(
      ([pattern, data]) => {
        const previousData = previousPatternAccuracy.get(pattern) || {
          attempts: 0,
          correct: 0,
          accuracy: 0,
        };
        const sessionAccuracy = (data.correct / data.attempts) * 100;
        const previousAccuracy = previousData.accuracy || 0;
        return {
          pattern,
          sessionAccuracy: Number(sessionAccuracy.toFixed(1)),
          previousAccuracy: Number(previousAccuracy.toFixed(1)),
          improved: sessionAccuracy >= previousAccuracy,
        };
      },
    );

    const savedAnalytics = await Analytics.findOne({ userId });

    res.status(201).json({
      success: true,
      summary: {
        totalQuestions: sessionStats.totalQuestions,
        correctAnswers: sessionStats.correctAnswers,
        incorrectAnswers:
          sessionStats.totalQuestions - sessionStats.correctAnswers,
        sessionAccuracy: Number(
          (
            (sessionStats.correctAnswers / sessionStats.totalQuestions) *
            100
          ).toFixed(1),
        ),
        weakQuestions: sessionStats.weakQuestions,
        weakCorrect: sessionStats.weakCorrect,
        weakAccuracy:
          sessionStats.weakQuestions > 0
            ? Number(
                (
                  (sessionStats.weakCorrect / sessionStats.weakQuestions) *
                  100
                ).toFixed(1),
              )
            : 0,
        randomCorrect: sessionStats.randomCorrect,
        totalTime: sessionStats.totalTime,
        averageTime:
          sessionStats.totalQuestions > 0
            ? Number(
                (sessionStats.totalTime / sessionStats.totalQuestions).toFixed(
                  1,
                ),
              )
            : 0,
        topConfusions,
        improvementNotes,
        previousOverallAccuracy: Number(previousOverallAccuracy.toFixed(1)),
        newOverallAccuracy: savedAnalytics?.overallStats?.overallAccuracy || 0,
        weakPatterns: savedAnalytics?.weakPatterns || [],
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get attempt history
// @route   GET /api/attempts
// @access  Private
exports.getAttemptHistory = async (req, res, next) => {
  try {
    const { limit = 20, skip = 0, mode } = req.query;

    const query = { userId: req.user.id };
    if (mode) query.mode = mode;

    const attempts = await Attempt.find(query)
      .populate("problemId", "title difficulty correctPattern")
      .sort({ date: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const total = await Attempt.countDocuments(query);

    res.status(200).json({
      success: true,
      count: attempts.length,
      total,
      attempts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user stats
// @route   GET /api/attempts/stats
// @access  Private
exports.getUserStats = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const analytics = await Analytics.findOne({ userId: req.user.id });

    res.status(200).json({
      success: true,
      stats: {
        patternStats: user.patternStats,
        speedRecords: user.speedRecords,
        overallStats: analytics?.overallStats || {},
        weakPatterns: analytics?.weakPatterns || [],
        strongPatterns: analytics?.strongPatterns || [],
      },
    });
  } catch (error) {
    next(error);
  }
};

// Helper function to update user stats
async function updateUserStats(userId, pattern, isCorrect, timeTaken) {
  const user = await User.findById(userId);

  if (!user.patternStats[pattern]) {
    user.patternStats[pattern] = { attempts: 0, correct: 0, avgTime: 0 };
  }

  const stats = user.patternStats[pattern];
  stats.attempts += 1;
  if (isCorrect) {
    stats.correct += 1;
  }

  // Update average time
  stats.avgTime =
    (stats.avgTime * (stats.attempts - 1) + timeTaken) / stats.attempts;

  // Update speed records
  user.speedRecords.totalAttempts += 1;
  const totalCorrect = Object.values(user.patternStats).reduce(
    (sum, s) => sum + s.correct,
    0,
  );
  user.speedRecords.avgAccuracy =
    totalCorrect / user.speedRecords.totalAttempts;

  await user.save();
}

// Helper function to update analytics
async function updateAnalytics(
  userId,
  correctPattern,
  selectedPattern,
  isCorrect,
  timeTaken,
) {
  let analytics = await Analytics.findOne({ userId });

  if (!analytics) {
    analytics = await Analytics.create({ userId });
  }

  // Update pattern accuracy
  if (!analytics.patternAccuracy.has(correctPattern)) {
    analytics.patternAccuracy.set(correctPattern, {
      attempts: 0,
      correct: 0,
      accuracy: 0,
      avgTime: 0,
    });
  }

  const patternData = analytics.patternAccuracy.get(correctPattern);
  patternData.attempts += 1;
  if (isCorrect) {
    patternData.correct += 1;
  }
  patternData.accuracy = (patternData.correct / patternData.attempts) * 100;
  patternData.avgTime =
    (patternData.avgTime * (patternData.attempts - 1) + timeTaken) /
    patternData.attempts;

  // Update confusion matrix
  if (!isCorrect) {
    const key = `${selectedPattern}->${correctPattern}`;
    const currentCount = analytics.confusionMatrix.get(key) || 0;
    analytics.confusionMatrix.set(key, currentCount + 1);
  }

  // Update overall stats
  analytics.overallStats.totalAttempts += 1;
  if (isCorrect) {
    analytics.overallStats.totalCorrect += 1;
    analytics.overallStats.currentStreak += 1;
    if (
      analytics.overallStats.currentStreak > analytics.overallStats.bestStreak
    ) {
      analytics.overallStats.bestStreak = analytics.overallStats.currentStreak;
    }
  } else {
    analytics.overallStats.currentStreak = 0;
  }

  analytics.overallStats.overallAccuracy =
    (analytics.overallStats.totalCorrect /
      analytics.overallStats.totalAttempts) *
    100;

  const totalTime = Array.from(analytics.patternAccuracy.values()).reduce(
    (sum, data) => sum + data.avgTime * data.attempts,
    0,
  );
  analytics.overallStats.avgTime =
    totalTime / analytics.overallStats.totalAttempts;

  // Update weak and strong patterns
  const patterns = Array.from(analytics.patternAccuracy.entries()).map(
    ([pattern, data]) => ({
      pattern,
      accuracy: data.accuracy,
      attempts: data.attempts,
    }),
  );

  analytics.weakPatterns = patterns
    .filter((p) => p.attempts >= 3)
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, 5);

  analytics.strongPatterns = patterns
    .filter((p) => p.attempts >= 3)
    .sort((a, b) => b.accuracy - a.accuracy)
    .slice(0, 5);

  // Update progress history (daily)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const existingHistory = analytics.progressHistory.find((h) => {
    const hDate = new Date(h.date);
    hDate.setHours(0, 0, 0, 0);
    return hDate.getTime() === today.getTime();
  });

  if (existingHistory) {
    existingHistory.accuracy = analytics.overallStats.overallAccuracy;
    existingHistory.attempts = analytics.overallStats.totalAttempts;
    existingHistory.avgTime = analytics.overallStats.avgTime;
  } else {
    analytics.progressHistory.push({
      date: today,
      accuracy: analytics.overallStats.overallAccuracy,
      attempts: analytics.overallStats.totalAttempts,
      avgTime: analytics.overallStats.avgTime,
    });
  }

  // Keep only last 30 days
  analytics.progressHistory = analytics.progressHistory.slice(-30);

  await analytics.save();
}
