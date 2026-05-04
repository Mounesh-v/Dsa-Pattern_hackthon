const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.resolve(__dirname, "../../.env"), quiet: true });

const PATTERN_NAMES = {
  slidingWindow: "Sliding Window",
  twoPointers: "Two Pointers",
  binarySearch: "Binary Search",
  dynamicProgramming: "Dynamic Programming",
  greedy: "Greedy",
  backtracking: "Backtracking",
  graphTraversal: "Graph Traversal",
  dfs: "DFS",
  bfs: "BFS",
  heap: "Heap",
  unionFind: "Union Find",
  prefixSum: "Prefix Sum",
  recursion: "Recursion",
};

function getGeminiApiKeys() {
  return [process.env.GEMINI_API_KEY, process.env.GEMINI_FALLBACK_API_KEY]
    .map((key) => key?.trim())
    .filter(
      (key) =>
        key &&
        !key.toLowerCase().includes("your-gemini-api-key") &&
        !key.toLowerCase().includes("your-backup-gemini-api-key"),
    );
}

function getGeminiGenerateUrl(apiKey) {
  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  const modelPath = model.startsWith("models/") ? model : `models/${model}`;

  return `https://generativelanguage.googleapis.com/v1beta/${modelPath}:generateContent?key=${apiKey}`;
}

async function generateGeminiContent(body) {
  const apiKeys = getGeminiApiKeys();
  let lastError = null;

  if (apiKeys.length === 0) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }

  for (const apiKey of apiKeys) {
    try {
      const response = await fetch(getGeminiGenerateUrl(apiKey), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        return response;
      }

      const errorText = await response.text();
      lastError = new Error(
        `Gemini request failed with ${response.status}: ${errorText}`,
      );

      if (![403, 404, 429].includes(response.status)) {
        break;
      }
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error("Gemini request failed.");
}

function formatPattern(pattern) {
  if (!pattern) {
    return "Unknown";
  }

  return PATTERN_NAMES[pattern] || pattern.replace(/([A-Z])/g, " $1").trim();
}

function fallbackConfusionExplanation(correctPattern, selectedPattern) {
  const correctName = formatPattern(correctPattern);
  const selectedName = formatPattern(selectedPattern);

  return `${correctName} and ${selectedName} can look similar because both may reuse partial work instead of trying every possibility from scratch. Differentiate them by asking what state is being maintained: ${correctName} is driven by the core structure of the optimal solution, while ${selectedName} uses a different control signal. Trace the smallest example and check whether the chosen move preserves the required invariant for ${correctName}.`;
}

async function generateConfusionExplanation({
  problem,
  correctPattern,
  selectedPattern,
}) {
  if (getGeminiApiKeys().length === 0) {
    return fallbackConfusionExplanation(correctPattern, selectedPattern);
  }

  const correctName = formatPattern(correctPattern);
  const selectedName = formatPattern(selectedPattern);

  const prompt = [
    "You are a DSA tutor explaining why a learner confused two problem-solving patterns.",
    "Write a concise explanation with two short paragraphs:",
    "1. Similarity: what the actual pattern and confused pattern have in common for this problem.",
    "2. How to differentiate: concrete signals the learner should check next time.",
    "Keep it under 130 words. Do not use markdown headings.",
    "",
    `Problem title: ${problem.title}`,
    `Problem description: ${problem.description}`,
    `Actual pattern: ${correctName}`,
    `Confused pattern: ${selectedName}`,
  ].join("\n");

  try {
    const response = await generateGeminiContent({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.35,
        maxOutputTokens: 220,
      },
    });

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts
      ?.map((part) => part.text)
      .filter(Boolean)
      .join("\n")
      .trim();

    return text || fallbackConfusionExplanation(correctPattern, selectedPattern);
  } catch (error) {
    return fallbackConfusionExplanation(correctPattern, selectedPattern);
  }
}

function extractJsonObject(text) {
  if (!text) return null;

  const fencedMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const jsonText = fencedMatch ? fencedMatch[1] : text;
  const start = jsonText.indexOf("{");
  const end = jsonText.lastIndexOf("}");

  if (start === -1 || end === -1 || end <= start) {
    return null;
  }

  try {
    return JSON.parse(jsonText.slice(start, end + 1));
  } catch (error) {
    return null;
  }
}

function normalizeCodeAnalysis(value) {
  const score = Number(value?.score);
  const toBullets = (items, fallback) => {
    if (Array.isArray(items)) {
      const cleaned = items
        .filter((item) => typeof item === "string" && item.trim())
        .map((item) => item.trim())
        .slice(0, 5);

      if (cleaned.length > 0) {
        return cleaned;
      }
    }

    if (typeof items === "string" && items.trim()) {
      return [items.trim()];
    }

    return fallback;
  };

  return {
    score: Number.isFinite(score) ? Math.max(0, Math.min(100, Math.round(score))) : 0,
    summary:
      typeof value?.summary === "string" && value.summary.trim()
        ? value.summary.trim()
        : "The submission was reviewed for approach quality and implementation clarity.",
    approachFeedback:
      typeof value?.approachFeedback === "string" && value.approachFeedback.trim()
        ? value.approachFeedback.trim()
        : "Focus on matching the intended pattern, preserving the main invariant, and keeping edge cases explicit.",
    complexity:
      typeof value?.complexity === "string" && value.complexity.trim()
        ? value.complexity.trim()
        : "Complexity could not be determined confidently from the submitted code.",
    keyPoints: toBullets(value?.keyPoints, [
      "Check whether the implementation matches the intended DSA pattern.",
      "Verify correctness on edge cases and sample inputs.",
    ]),
    improvements: toBullets(value?.improvements, [
      "Clarify the core invariant.",
      "Handle edge cases explicitly.",
      "Use descriptive variable names.",
    ]),
    expectedOutput:
      typeof value?.expectedOutput === "string" && value.expectedOutput.trim()
        ? value.expectedOutput.trim()
        : "Expected output was not available.",
    codeOutput:
      typeof value?.codeOutput === "string" && value.codeOutput.trim()
        ? value.codeOutput.trim()
        : "Code output could not be determined from static analysis.",
  };
}

function hasOnlyStarterCode(code) {
  if (/write your approach here/i.test(code)) {
    return true;
  }

  const meaningfulCode = code
    .replace(/\/\/.*$/gm, "")
    .replace(/#.*$/gm, "")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\b(pass|null|None|return\s+null|return\s*;)\b/g, "")
    .replace(/[{}();\s]/g, "");

  return meaningfulCode.length < 18;
}

function fallbackCodeAnalysis({ problem, code }) {
  const hasMeaningfulCode = !hasOnlyStarterCode(code);

  return normalizeCodeAnalysis({
    score: hasMeaningfulCode ? 20 : 0,
    summary: hasMeaningfulCode
      ? "Your code was saved for review, but AI analysis is unavailable because Gemini is not configured on the backend."
      : "This submission does not contain a real solution yet.",
    approachFeedback: hasMeaningfulCode
      ? "Add a valid Gemini API key in backend/.env and restart the backend to receive detailed tutor feedback."
      : "Write the core algorithm before submitting. Placeholders and comments cannot be evaluated as a solution.",
    complexity: "Complexity analysis requires Gemini feedback.",
    keyPoints: hasMeaningfulCode
      ? [
          "Gemini feedback is currently unavailable.",
          "Check your solution manually against the sample cases.",
          "Restart the backend after updating backend/.env.",
        ]
      : [
          "No real algorithm was submitted.",
          "Placeholders and comments are not enough to evaluate correctness.",
        ],
    improvements: hasMeaningfulCode
      ? [
          "Verify edge cases against the problem constraints.",
          "Make sure the implementation matches the intended DSA pattern.",
          "Configure GEMINI_API_KEY to unlock full feedback.",
        ]
      : [
          "Write the core algorithm instead of leaving placeholders.",
          "Handle input parsing and edge cases.",
        ],
    expectedOutput: JSON.stringify(problem.examples || [], null, 2),
    codeOutput: hasMeaningfulCode
      ? "Code output was not executed. Gemini analysis is unavailable."
      : "No output: submitted code is still a placeholder.",
  });
}

async function analyzeCodeSubmission({ problem, language, code }) {
  if (getGeminiApiKeys().length === 0) {
    return fallbackCodeAnalysis({ problem, language, code });
  }

  if (hasOnlyStarterCode(code)) {
    return normalizeCodeAnalysis({
      score: 0,
      summary: "This submission does not contain a real solution yet.",
      approachFeedback:
        "Starter code, placeholders, or comments cannot earn tutor score. Implement the actual algorithm before submitting.",
      complexity: "No meaningful algorithm was present to analyze.",
      keyPoints: [
        "No real algorithm was submitted.",
        "Placeholders and comments are not enough to evaluate correctness.",
      ],
      improvements: [
        "Write the core algorithm instead of leaving placeholders.",
        "Handle input parsing and edge cases.",
        "Use the intended DSA pattern in the implementation.",
      ],
      expectedOutput: JSON.stringify(problem.examples || [], null, 2),
      codeOutput: "No output: submitted code is still a placeholder.",
    });
  }

  const prompt = [
    "You are a strict DSA code evaluator. Grade only the submitted code, not the learner's intent.",
    "Use this exact scoring rubric:",
    "0-10: no meaningful solution, placeholder code, unrelated code, or impossible to assess.",
    "11-30: brute force or mostly incorrect, major missing logic, fails common cases.",
    "31-50: partial solution with some correct ideas but wrong pattern, poor edge handling, or serious complexity problems.",
    "51-70: mostly correct approach but misses important edge cases, has avoidable inefficiency, or unclear state transitions.",
    "71-85: correct and reasonably efficient, but not the cleanest pattern use or has minor robustness/readability issues.",
    "86-95: strong pattern match, efficient complexity, clear implementation, handles edge cases.",
    "96-100: excellent first-attempt solution: optimal pattern, clean invariants, robust edge handling, and production-quality clarity.",
    "Be conservative. Do not award above 85 unless the code is clearly correct and efficient. Do not award above 95 unless it is exceptional.",
    "If the code does not match the expected DSA pattern but might pass some cases, cap the score at 70.",
    "If correctness is uncertain because the implementation is incomplete, cap the score at 50.",
    "Also compare the expected sample output with the output this code would likely produce. If exact execution is impossible, infer from static code reading and clearly say so.",
    "Return only valid JSON with this exact shape:",
    '{"score": number, "summary": string, "keyPoints": string[], "approachFeedback": string, "complexity": string, "improvements": string[], "expectedOutput": string, "codeOutput": string}',
    "Keep every string concise and learner-friendly. keyPoints and improvements must be short bullet-worthy strings. Do not include markdown.",
    "",
    `Problem title: ${problem.title}`,
    `Problem description: ${problem.description}`,
    `Expected pattern: ${formatPattern(problem.correctPattern)}`,
    `Examples: ${JSON.stringify(problem.examples || [])}`,
    `Constraints: ${JSON.stringify(problem.constraints || [])}`,
    `Language: ${language}`,
    "Code:",
    code,
  ].join("\n");

  try {
    const response = await generateGeminiContent({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0,
        topK: 1,
        topP: 0.1,
        maxOutputTokens: 1000,
        responseMimeType: "application/json",
        thinkingConfig: {
          thinkingBudget: 0,
        },
      },
    });

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts
      ?.map((part) => part.text)
      .filter(Boolean)
      .join("\n")
      .trim();

    const parsed = extractJsonObject(text);
    if (!parsed) {
      throw new Error("Gemini returned an invalid code analysis response.");
    }

    return normalizeCodeAnalysis(parsed);
  } catch (error) {
    throw new Error("Unable to analyze code with Gemini. Please try again.");
  }
}

module.exports = {
  analyzeCodeSubmission,
  formatPattern,
  generateConfusionExplanation,
};
