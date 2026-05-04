const Problem = require('../models/Problem');
const User = require('../models/User');
const Analytics = require('../models/Analytics');

// @desc    Get random problem
// @route   GET /api/problems/random
// @access  Public
exports.getRandomProblem = async (req, res, next) => {
  try {
    console.log(req.query)
    const { difficulty } = req.query;

    const query = { isActive: true };
    if (difficulty) {
      query.difficulty = difficulty;
    }

    const count = await Problem.countDocuments(query);
    const random = Math.floor(Math.random() * count);

    const problem = await Problem.findOne(query).skip(random);

    if (!problem) {
      return res.status(404).json({ message: 'No problems found' });
    }

    // Return problem without correct pattern
    const problemData = {
      id: problem._id,
      title: problem.title,
      description: problem.description,
      difficulty: problem.difficulty,
      examples: problem.examples,
      constraints: problem.constraints,
      timeLimit: problem.timeLimit,
    };

    res.status(200).json({
      success: true,
      problem: problemData,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get adaptive problem based on user performance
// @route   GET /api/problems/adaptive
// @access  Private
exports.getAdaptiveProblem = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Get user analytics
    const analytics = await Analytics.findOne({ userId });
    if (!analytics) {
      // If no analytics, return random problem
      return exports.getRandomProblem(req, res, next);
    }

    // Find weakest patterns
    const weakPatterns = analytics.weakPatterns
      .sort((a, b) => a.accuracy - b.accuracy)
      .slice(0, 3);

    if (weakPatterns.length === 0) {
      // If no weak patterns, return random problem
      return exports.getRandomProblem(req, res, next);
    }

    // Get problems for weakest patterns
    const pattern = weakPatterns[Math.floor(Math.random() * weakPatterns.length)].pattern;
    const problems = await Problem.find({
      correctPattern: pattern,
      isActive: true,
    });

    if (problems.length === 0) {
      return exports.getRandomProblem(req, res, next);
    }

    // Return random problem from weak patterns
    const problem = problems[Math.floor(Math.random() * problems.length)];

    const problemData = {
      id: problem._id,
      title: problem.title,
      description: problem.description,
      difficulty: problem.difficulty,
      examples: problem.examples,
      constraints: problem.constraints,
      timeLimit: problem.timeLimit,
    };

    res.status(200).json({
      success: true,
      problem: problemData,
      recommended: true,
      targetPattern: pattern,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new problem
// @route   POST /api/problems
// @access  Private/Admin
exports.createProblem = async (req, res, next) => {
  try {
    const problem = await Problem.create({
      ...req.body,
      createdBy: req.user.id,
    });

    res.status(201).json({
      success: true,
      problem,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update problem
// @route   PUT /api/problems/:id
// @access  Private/Admin
exports.updateProblem = async (req, res, next) => {
  try {
    let problem = await Problem.findById(req.params.id);

    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    problem = await Problem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      problem,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete problem
// @route   DELETE /api/problems/:id
// @access  Private/Admin
exports.deleteProblem = async (req, res, next) => {
  try {
    const problem = await Problem.findById(req.params.id);

    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    await problem.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Problem deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all problems
// @route   GET /api/problems
// @access  Private/Admin
exports.getAllProblems = async (req, res, next) => {
  try {
    const { difficulty, pattern } = req.query;

    const query = {};
    if (difficulty) query.difficulty = difficulty;
    if (pattern) query.correctPattern = pattern;

    const problems = await Problem.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: problems.length,
      problems,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get problem by ID
// @route   GET /api/problems/:id
// @access  Public
exports.getProblemById = async (req, res, next) => {
  try {
    const problem = await Problem.findById(req.params.id);

    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    res.status(200).json({
      success: true,
      problem,
    });
  } catch (error) {
    next(error);
  }
};
