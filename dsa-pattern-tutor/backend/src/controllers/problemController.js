const mongoose = require("mongoose");
const Problem = require("../models/Problem");
const User = require("../models/User");
const Analytics = require("../models/Analytics");

const LEETCODE_API_URL =
  process.env.LEETCODE_API_URL || "https://alfa-leetcode-api.onrender.com";
const LEETCODE_GRAPHQL_URL = "https://leetcode.com/graphql";
const SESSION_QUESTION_COUNT = 12;
const WEAK_SESSION_QUESTION_COUNT = 6;

const formatProblemForSession = (problem) => ({
  id: problem._id,
  title: problem.title,
  description: problem.description,
  difficulty: problem.difficulty,
  examples: problem.examples,
  constraints: problem.constraints,
  timeLimit: problem.timeLimit,
});

const tagPatternMap = {
  "sliding-window": "slidingWindow",
  "two-pointers": "twoPointers",
  "binary-search": "binarySearch",
  "dynamic-programming": "dynamicProgramming",
  greedy: "greedy",
  backtracking: "backtracking",
  graph: "graphTraversal",
  "graph-theory": "graphTraversal",
  "depth-first-search": "dfs",
  "breadth-first-search": "bfs",
  heap: "heap",
  "priority-queue": "heap",
  "union-find": "unionFind",
  "prefix-sum": "prefixSum",
  recursion: "recursion",
};

const sanitizeProblemContent = (content = "") =>
  content
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
    .replace(/\son\w+="[^"]*"/gi, "")
    .replace(/\son\w+='[^']*'/gi, "");

const stripProblemContent = (content = "") =>
  sanitizeProblemContent(content)
    .replace(/<pre>/gi, "\n")
    .replace(/<\/pre>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

const normalizeTitleSlug = (value = "") =>
  value
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\/(www\.)?leetcode\.com\/problems\//, "")
    .replace(/\/.*$/, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

const getInferredPatterns = (topicTags = []) => {
  const patterns = topicTags
    .map((tag) => tagPatternMap[tag.slug])
    .filter(Boolean);

  return [...new Set(patterns)];
};

const normalizeLeetCodeProblem = (question) => {
  const topicTags = Array.isArray(question.topicTags)
    ? question.topicTags.map((tag) => ({
        name: tag.name,
        slug: tag.slug,
      }))
    : [];
  const inferredPatterns = getInferredPatterns(topicTags);

  return {
    id: `leetcode:${question.titleSlug}`,
    source: "leetcode",
    title: question.title,
    titleSlug: question.titleSlug,
    difficulty: question.difficulty?.toLowerCase() || "medium",
    contentHtml: sanitizeProblemContent(question.content || ""),
    description: stripProblemContent(question.content || ""),
    examples: [],
    constraints: [],
    tags: topicTags,
    inferredPatterns,
    correctPattern: inferredPatterns[0] || null,
    likes: question.likes,
    dislikes: question.dislikes,
    stats: question.stats,
    url: `https://leetcode.com/problems/${question.titleSlug}/`,
  };
};

const fetchWithTimeout = async (url, options = {}) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);

  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }
};

const fetchSelectedProblemFromAlfa = async (titleSlug) => {
  const response = await fetchWithTimeout(
    `${LEETCODE_API_URL}/select?titleSlug=${encodeURIComponent(titleSlug)}`,
  );

  if (!response.ok) {
    throw new Error(`Alfa LeetCode API returned ${response.status}`);
  }

  const data = await response.json();
  return data.question || data;
};

const fetchSelectedProblemFromLeetCode = async (titleSlug) => {
  const response = await fetchWithTimeout(LEETCODE_GRAPHQL_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Referer: `https://leetcode.com/problems/${titleSlug}/`,
      Origin: "https://leetcode.com",
      "User-Agent": "Mozilla/5.0",
    },
    body: JSON.stringify({
      query: `
        query questionData($titleSlug: String!) {
          question(titleSlug: $titleSlug) {
            questionId
            questionFrontendId
            title
            titleSlug
            content
            difficulty
            likes
            dislikes
            stats
            topicTags {
              name
              slug
            }
          }
        }
      `,
      variables: { titleSlug },
    }),
  });

  if (!response.ok) {
    throw new Error(`LeetCode GraphQL returned ${response.status}`);
  }

  const data = await response.json();
  if (data.errors?.length > 0) {
    throw new Error(data.errors[0].message || "LeetCode GraphQL error");
  }

  return data.data?.question;
};

const normalizeLeetCodeProblemListItem = (question) => {
  const topicTags = Array.isArray(question.topicTags)
    ? question.topicTags.map((tag) => ({
        name: tag.name,
        slug: tag.slug,
      }))
    : [];
  const inferredPatterns = getInferredPatterns(topicTags);

  return {
    id:
      question.questionFrontendId ||
      question.frontendQuestionId ||
      question.questionId ||
      question.titleSlug,
    source: "leetcode",
    title: question.title,
    titleSlug: question.titleSlug,
    difficulty: question.difficulty?.toLowerCase() || "unknown",
    acRate: question.acRate,
    isPaidOnly: Boolean(question.isPaidOnly || question.paidOnly),
    tags: topicTags,
    inferredPatterns,
    url: `https://leetcode.com/problems/${question.titleSlug}/`,
  };
};

const getProblemListFromResponse = (data) =>
  data?.problemsetQuestionList?.questions ||
  data?.data?.problemsetQuestionList?.questions ||
  data?.questions ||
  data?.problems ||
  data?.problemsetQuestionList ||
  [];

const getProblemListTotal = (data, problems) =>
  data?.problemsetQuestionList?.total ||
  data?.data?.problemsetQuestionList?.total ||
  data?.totalQuestions ||
  data?.total ||
  problems.length;

// @desc    Get random problem
// @route   GET /api/problems/random
// @access  Public
exports.getRandomProblem = async (req, res, next) => {
  try {
    const { difficulty } = req.query;

    const query = { isActive: true };
    if (difficulty) {
      query.difficulty = difficulty;
    }

    const count = await Problem.countDocuments(query);
    const random = Math.floor(Math.random() * count);

    const problem = await Problem.findOne(query).skip(random);

    if (!problem) {
      return res.status(404).json({ message: "No problems found" });
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

// @desc    Get selected LeetCode problem from alfa-leetcode-api
// @route   GET /api/problems/leetcode?titleSlug=two-sum
// @access  Public
exports.getLeetCodeProblem = async (req, res, next) => {
  try {
    const titleSlug = normalizeTitleSlug(req.query.titleSlug || "");

    if (!titleSlug) {
      return res.status(400).json({ message: "Please provide a titleSlug" });
    }

    if (typeof fetch !== "function") {
      return res.status(500).json({
        message: "This Node version does not support fetch on the server.",
      });
    }

    let question = null;
    let lastError = null;

    try {
      question = await fetchSelectedProblemFromAlfa(titleSlug);
    } catch (error) {
      lastError = error;
    }

    if (!question?.titleSlug || !question?.title) {
      try {
        question = await fetchSelectedProblemFromLeetCode(titleSlug);
      } catch (error) {
        lastError = error;
      }
    }

    if (!question?.titleSlug || !question?.title) {
      return res.status(404).json({
        message:
          "LeetCode problem not found. Use the exact slug from the URL, for example two-sum.",
        detail:
          process.env.NODE_ENV === "development" ? lastError?.message : undefined,
      });
    }

    res.status(200).json({
      success: true,
      problem: normalizeLeetCodeProblem(question),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get LeetCode problem list from alfa-leetcode-api
// @route   GET /api/problems/leetcode-list?limit=50&skip=0&difficulty=EASY
// @access  Public
exports.getLeetCodeProblems = async (req, res, next) => {
  try {
    const limit = Math.min(Math.max(Number(req.query.limit) || 50, 1), 100);
    const skip = Math.max(Number(req.query.skip) || 0, 0);
    const difficulty = req.query.difficulty?.toString().toUpperCase();
    const tags = req.query.tags?.toString().trim();

    if (typeof fetch !== "function") {
      return res.status(500).json({
        message: "This Node version does not support fetch on the server.",
      });
    }

    const params = new URLSearchParams({
      limit: String(limit),
      skip: String(skip),
    });

    if (["EASY", "MEDIUM", "HARD"].includes(difficulty)) {
      params.set("difficulty", difficulty);
    }

    if (tags) {
      params.set("tags", tags);
    }

    const response = await fetch(`${LEETCODE_API_URL}/problems?${params}`);

    if (!response.ok) {
      return res.status(response.status).json({
        message: "Failed to fetch problems from LeetCode API",
      });
    }

    const data = await response.json();
    const rawProblems = getProblemListFromResponse(data);
    const problems = Array.isArray(rawProblems)
      ? rawProblems
          .filter((question) => question?.titleSlug && question?.title)
          .map(normalizeLeetCodeProblemListItem)
      : [];

    res.status(200).json({
      success: true,
      count: problems.length,
      total: getProblemListTotal(data, problems),
      skip,
      limit,
      problems,
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
    const pattern =
      weakPatterns[Math.floor(Math.random() * weakPatterns.length)].pattern;
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

// @desc    Get session practice problems
// @route   GET /api/problems/session
// @access  Private
exports.getSessionProblems = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const analytics = await Analytics.findOne({ userId });
    const weakPatterns =
      analytics?.weakPatterns?.map((pattern) => pattern.pattern) || [];

    const selectedProblemIds = [];
    const problems = [];

    if (weakPatterns.length > 0) {
      const weakProblems = await Problem.aggregate([
        { $match: { correctPattern: { $in: weakPatterns }, isActive: true } },
        { $sample: { size: WEAK_SESSION_QUESTION_COUNT } },
      ]);

      weakProblems.forEach((problem) => {
        selectedProblemIds.push(problem._id);
        problems.push({ source: "weak", ...formatProblemForSession(problem) });
      });
    }

    const randomQuery = { isActive: true };
    if (selectedProblemIds.length > 0) {
      randomQuery._id = { $nin: selectedProblemIds };
    }

    const randomSize = SESSION_QUESTION_COUNT - problems.length;
    if (randomSize > 0) {
      const randomProblems = await Problem.aggregate([
        { $match: randomQuery },
        { $sample: { size: randomSize } },
      ]);

      randomProblems.forEach((problem) => {
        selectedProblemIds.push(problem._id);
        problems.push({
          source: "random",
          ...formatProblemForSession(problem),
        });
      });
    }

    if (problems.length < SESSION_QUESTION_COUNT) {
      const fillQuery = { isActive: true, _id: { $nin: selectedProblemIds } };
      const fillCount = SESSION_QUESTION_COUNT - problems.length;
      const fillProblems = await Problem.aggregate([
        { $match: fillQuery },
        {
          $sample: {
            size: Math.min(fillCount, await Problem.countDocuments(fillQuery)),
          },
        },
      ]);
      fillProblems.forEach((problem) => {
        problems.push({
          source: "random",
          ...formatProblemForSession(problem),
        });
      });
    }

    res.status(200).json({
      success: true,
      session: {
        totalQuestions: problems.length,
        weakPatterns,
        questions: problems,
      },
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
      return res.status(404).json({ message: "Problem not found" });
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
      return res.status(404).json({ message: "Problem not found" });
    }

    await problem.deleteOne();

    res.status(200).json({
      success: true,
      message: "Problem deleted successfully",
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
      return res.status(404).json({ message: "Problem not found" });
    }

    res.status(200).json({
      success: true,
      problem,
    });
  } catch (error) {
    next(error);
  }
};
