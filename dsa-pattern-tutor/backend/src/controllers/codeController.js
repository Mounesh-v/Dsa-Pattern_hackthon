const CodeSubmission = require("../models/CodeSubmission");
const Problem = require("../models/Problem");
const User = require("../models/User");
const { analyzeCodeSubmission } = require("../services/geminiService");

function serializeTutorScore(user) {
  return {
    totalScore: user.tutorScore?.totalScore || 0,
    scoredQuestions: user.tutorScore?.scoredQuestions || 0,
    averageScore: user.tutorScore?.averageScore || 0,
  };
}

function ensureTutorScore(user) {
  if (!user.tutorScore) {
    user.tutorScore = {
      totalScore: 0,
      scoredQuestions: 0,
      averageScore: 0,
    };
  }
}

// @desc    Analyze code and award one-time tutor score per question
// @route   POST /api/code/submit
// @access  Private
exports.submitCode = async (req, res, next) => {
  try {
    const { problemId, language = "javascript", code } = req.body;
    const userId = req.user.id;

    if (!problemId || !code?.trim()) {
      return res.status(400).json({ message: "Problem and code are required" });
    }

    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    const analysis = await analyzeCodeSubmission({
      problem,
      language,
      code,
    });

    let submission = await CodeSubmission.findOne({ userId, problemId });
    let scoreAwarded = false;

    if (!submission) {
      submission = await CodeSubmission.create({
        userId,
        problemId,
        language,
        code,
        score: analysis.score,
        analysis,
      });

      const user = await User.findById(userId);
      ensureTutorScore(user);
      user.tutorScore.totalScore += analysis.score;
      user.tutorScore.scoredQuestions += 1;
      user.tutorScore.averageScore =
        user.tutorScore.totalScore / user.tutorScore.scoredQuestions;
      await user.save();
      scoreAwarded = true;
    }

    const user = await User.findById(userId);

    res.status(200).json({
      success: true,
      scoreAwarded,
      analysis: scoreAwarded
        ? analysis
        : {
            ...analysis,
            score: submission.score,
          },
      firstAttemptScore: submission.score,
      tutorScore: serializeTutorScore(user),
      message: scoreAwarded
        ? analysis.provider === "local-fallback"
          ? `Gemini was unavailable, so a local fallback review was used. Added ${analysis.score} tutor points for this question.`
          : `Added ${analysis.score} tutor points for this question.`
        : "This question was already scored earlier. Feedback is refreshed, but tutor score stays unchanged.",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current tutor score
// @route   GET /api/code/tutor-score
// @access  Private
exports.getTutorScore = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      tutorScore: serializeTutorScore(user),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get scored code submissions
// @route   GET /api/code/history
// @access  Private
exports.getCodeHistory = async (req, res, next) => {
  try {
    const { limit = 20, skip = 0 } = req.query;
    const query = { userId: req.user.id };

    const submissions = await CodeSubmission.find(query)
      .populate("problemId", "title difficulty correctPattern")
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const total = await CodeSubmission.countDocuments(query);

    res.status(200).json({
      success: true,
      count: submissions.length,
      total,
      submissions,
    });
  } catch (error) {
    next(error);
  }
};
