import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../components/Icon";
import Card, {
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../components/Card";
import { problemService } from "../services/problemService";
import { attemptService } from "../services/attemptService";

const PATTERNS = [
  { id: "slidingWindow", name: "Sliding Window" },
  { id: "twoPointers", name: "Two Pointers" },
  { id: "binarySearch", name: "Binary Search" },
  { id: "dynamicProgramming", name: "Dynamic Programming" },
  { id: "greedy", name: "Greedy" },
  { id: "backtracking", name: "Backtracking" },
  { id: "graphTraversal", name: "Graph Traversal" },
  { id: "dfs", name: "DFS" },
  { id: "bfs", name: "BFS" },
  { id: "heap", name: "Heap" },
  { id: "unionFind", name: "Union Find" },
  { id: "prefixSum", name: "Prefix Sum" },
  { id: "recursion", name: "Recursion" },
];

const getPatternName = (patternId) =>
  PATTERNS.find((pattern) => pattern.id === patternId)?.name ||
  patternId?.replace(/([A-Z])/g, " $1").trim() ||
  "Unknown";

const toTitleSlug = (value) =>
  value
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\/(www\.)?leetcode\.com\/problems\//, "")
    .replace(/\/.*$/, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

const getConfusionAdvice = (selectedPattern, correctPattern) =>
  `Look for the structural signal before naming the technique. You selected ${getPatternName(
    selectedPattern,
  )}, while this problem is closer to ${getPatternName(correctPattern)}.`;

const PAGE_SIZE = 50;
//dark mode added
const Practice = () => {
  const navigate = useNavigate();
  const problemDetailRef = useRef(null);
  const [problem, setProblem] = useState(null);
  const [selectedPattern, setSelectedPattern] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [difficulty, setDifficulty] = useState("medium");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchError, setSearchError] = useState("");
  const [problemListSearch, setProblemListSearch] = useState("");
  const [problemList, setProblemList] = useState([]);
  const [problemListTotal, setProblemListTotal] = useState(0);
  const [problemListSkip, setProblemListSkip] = useState(0);
  const [problemListDifficulty, setProblemListDifficulty] = useState("ALL");
  const [problemListLoading, setProblemListLoading] = useState(false);
  const [problemListError, setProblemListError] = useState("");

  useEffect(() => {
    loadProblem();
    loadStats();
  }, [difficulty]);

  useEffect(() => {
    loadProblemList({ reset: true });
  }, [problemListDifficulty]);

  const filteredProblemList = problemList.filter((item) => {
    const query = problemListSearch.trim().toLowerCase();
    if (!query) return true;

    return (
      item.title?.toLowerCase().includes(query) ||
      item.titleSlug?.toLowerCase().includes(toTitleSlug(query))
    );
  });

  const loadStats = async () => {
    try {
      const data = await attemptService.getUserStats();
      setStats(data.stats);
    } catch (error) {
      console.error("Failed to load user stats:", error);
    }
  };

  const loadProblem = async () => {
    setLoading(true);
    setSearchError("");
    try {
      const data = await problemService.getRandomProblem(difficulty);
      setProblem(data.problem);
      setSelectedPattern(null);
      setShowFeedback(false);
      setFeedback(null);
    } catch (error) {
      console.error("Failed to load problem:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (event) => {
    event.preventDefault();

    const titleSlug = toTitleSlug(searchQuery);
    if (!titleSlug) {
      setSearchError("Enter a LeetCode title slug, question name, or URL.");
      return;
    }

    setLoading(true);
    setSearchError("");
    try {
      const data = await problemService.getLeetCodeProblem(titleSlug);
      openLeetCodeProblem(data.problem);
    } catch (error) {
      console.error("Failed to load LeetCode problem:", error);
      setSearchError(
        error.response?.data?.message ||
          "Could not fetch that LeetCode question. Try a slug like two-sum.",
      );
    } finally {
      setLoading(false);
    }
  };

  const showProblemBelow = (nextProblem) => {
    setProblem(nextProblem);
    setSelectedPattern(null);
    setShowFeedback(false);
    setFeedback(null);
    setTimeout(() => {
      problemDetailRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 0);
  };

  const openLeetCodeProblem = (nextProblem) => {
    if (nextProblem.inferredPatterns?.length > 0) {
      showProblemBelow(nextProblem);
      return;
    }

    navigate("/code", {
      state: {
        leetcodeTitleSlug: nextProblem.titleSlug,
      },
    });
  };

  const loadProblemList = async ({ reset = false } = {}) => {
    const nextSkip = reset ? 0 : problemListSkip;

    setProblemListLoading(true);
    setProblemListError("");
    try {
      const data = await problemService.getLeetCodeProblems({
        limit: PAGE_SIZE,
        skip: nextSkip,
        difficulty:
          problemListDifficulty === "ALL"
            ? undefined
            : problemListDifficulty.toUpperCase(),
      });

      setProblemList((current) =>
        reset ? data.problems : [...current, ...data.problems],
      );
      setProblemListTotal(data.total || 0);
      setProblemListSkip(nextSkip + (data.count || data.problems?.length || 0));
    } catch (error) {
      console.error("Failed to load LeetCode problem list:", error);
      setProblemListError(
        error.response?.data?.message ||
          "Could not load the LeetCode problem list.",
      );
    } finally {
      setProblemListLoading(false);
    }
  };

  const handleSelectLeetCodeProblem = async (titleSlug) => {
    setLoading(true);
    setSearchError("");
    try {
      const data = await problemService.getLeetCodeProblem(titleSlug);
      openLeetCodeProblem(data.problem);
    } catch (error) {
      console.error("Failed to load selected LeetCode problem:", error);
      setSearchError(
        error.response?.data?.message ||
          "Could not fetch that LeetCode question.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedPattern) {
      alert("Please select a pattern");
      return;
    }

    setLoading(true);
    try {
      if (problem.source === "leetcode") {
        const correctPattern = problem.correctPattern;
        const isCorrect =
          Boolean(correctPattern) && selectedPattern === correctPattern;

        setFeedback({
          id: `leetcode-attempt:${problem.titleSlug}`,
          isCorrect,
          correctPattern: correctPattern || "unknown",
          selectedPattern,
          explanation: correctPattern
            ? `${getPatternName(correctPattern)} is inferred from the LeetCode topic tags for this problem.`
            : "No supported DSA pattern could be inferred from this problem's LeetCode topic tags.",
        });
        setShowFeedback(true);
        return;
      }

      const data = await attemptService.createAttempt({
        problemId: problem.id,
        selectedPattern,
        timeTaken: 0,
        mode: "practice",
      });

      setFeedback(data.attempt);
      setShowFeedback(true);
      await loadStats();
    } catch (error) {
      console.error("Failed to submit attempt:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNextProblem = () => {
    loadProblem();
  };

  if (loading && !problem) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-accent/20 border-t-accent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading problem...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <form
        onSubmit={handleSearch}
        className="mb-6 rounded-lg border border-border bg-card p-4"
      >
        <div className="flex flex-col gap-3 md:flex-row">
          <label className="relative flex-1">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">
              <Icon name="search" size={18} />
            </span>
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search LeetCode question, e.g. two-sum"
              className="input-field w-full pl-11"
            />
          </label>
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? "Searching..." : "Fetch Question"}
          </button>
          <button
            type="button"
            onClick={loadProblem}
            disabled={loading}
            className="btn-secondary"
          >
            Random Local
          </button>
        </div>
        {searchError && (
          <p className="mt-3 text-sm font-medium text-red-600">
            {searchError}
          </p>
        )}
      </form>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>All LeetCode Problems</CardTitle>
              <p className="mt-1 text-sm text-text-secondary">
                Showing {filteredProblemList.length} of {problemListTotal || problemList.length}
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <label className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
                  <Icon name="search" size={16} />
                </span>
                <input
                  value={problemListSearch}
                  onChange={(event) => setProblemListSearch(event.target.value)}
                  placeholder="Filter loaded problems"
                  className="input-field w-full py-2 pl-9 text-sm sm:w-56"
                />
              </label>
              <div className="flex flex-wrap gap-2">
                {["ALL", "EASY", "MEDIUM", "HARD"].map((diff) => (
                  <button
                    key={diff}
                    type="button"
                    onClick={() => setProblemListDifficulty(diff)}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                      problemListDifficulty === diff
                        ? "bg-accent text-white"
                        : "bg-background border border-border text-text-secondary hover:border-accent/50"
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {problemListError && (
            <p className="mb-3 text-sm font-medium text-red-600">
              {problemListError}
            </p>
          )}

          <div className="max-h-[28rem] overflow-auto rounded-lg border border-border">
            <div className="min-w-[720px]">
              <div className="grid grid-cols-[5rem_1fr_7rem_12rem_6rem] gap-3 border-b border-border bg-background px-4 py-3 text-xs font-semibold uppercase text-text-muted">
                <div>ID</div>
                <div>Problem</div>
                <div>Difficulty</div>
                <div>Pattern</div>
                <div></div>
              </div>

              {filteredProblemList.map((item) => (
                <div
                  key={item.titleSlug}
                  className="grid grid-cols-[5rem_1fr_7rem_12rem_6rem] gap-3 border-b border-border px-4 py-3 text-sm last:border-b-0"
                >
                  <div className="font-mono text-text-muted">{item.id}</div>
                  <div>
                    <div className="font-medium text-text-primary">
                      {item.title}
                    </div>
                    <div className="text-xs text-text-secondary">
                      {item.titleSlug}
                    </div>
                  </div>
                  <div className="capitalize text-text-secondary">
                    {item.difficulty}
                  </div>
                  <div className="text-text-secondary">
                    {item.inferredPatterns?.length > 0
                      ? item.inferredPatterns.map(getPatternName).join(", ")
                      : "Unmapped"}
                  </div>
                  <div className="text-right">
                    <button
                      type="button"
                      onClick={() => handleSelectLeetCodeProblem(item.titleSlug)}
                      className="rounded-lg border border-border px-3 py-2 text-xs font-semibold text-text-primary hover:border-accent hover:text-accent"
                    >
                      Open
                    </button>
                  </div>
                </div>
              ))}

              {!problemListLoading && filteredProblemList.length === 0 && (
                <div className="px-4 py-8 text-center text-sm text-text-secondary">
                  No problems match your search.
                </div>
              )}

              {problemListLoading && (
                <div className="px-4 py-8 text-center text-sm text-text-secondary">
                  Loading problems...
                </div>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <button
            type="button"
            onClick={() => loadProblemList()}
            disabled={
              problemListLoading ||
              (problemListTotal > 0 && problemList.length >= problemListTotal)
            }
            className="btn-secondary w-full"
          >
            {problemListLoading ? "Loading..." : "Load More Problems"}
          </button>
        </CardFooter>
      </Card>

      {/* Difficulty Selector */}
      {!showFeedback && (
        <div className="flex justify-center gap-2 mb-8">
          {["easy", "medium", "hard"].map((diff) => (
            <button
              key={diff}
              onClick={() => setDifficulty(diff)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                difficulty === diff
                  ? "bg-accent text-white"
                  : "bg-card border border-border text-text-secondary hover:bg-accent/5"
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      )}

      {problem && !showFeedback && (
        <div ref={problemDetailRef} className="grid scroll-mt-24 lg:grid-cols-2 gap-6">
          {/* Problem Description */}
          <div>
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="font-display font-semibold text-2xl text-text-primary mb-2">
                      {problem.title}
                    </h2>
                    <span className="px-3 py-1 rounded-full text-sm capitalize bg-accent/10 text-accent border border-accent/20">
                      {problem.difficulty}
                    </span>
                    {problem.source === "leetcode" && (
                      <a
                        href={problem.url}
                        target="_blank"
                        rel="noreferrer"
                        className="ml-2 inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-background text-text-secondary border border-border hover:text-accent"
                      >
                        LeetCode
                        <Icon name="externalLink" size={14} />
                      </a>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {problem.contentHtml ? (
                  <div
                    className="prose max-w-none text-text-primary leading-relaxed [&_pre]:overflow-auto [&_pre]:rounded-lg [&_pre]:bg-background [&_pre]:p-4 [&_code]:font-mono [&_strong]:text-text-primary"
                    dangerouslySetInnerHTML={{ __html: problem.contentHtml }}
                  />
                ) : (
                  <div className="prose max-w-none">
                    <p className="whitespace-pre-wrap text-text-primary leading-relaxed">
                      {problem.description}
                    </p>
                  </div>
                )}

                {problem.tags && problem.tags.length > 0 && (
                  <div className="mt-6">
                    <h3 className="font-display font-semibold text-lg text-text-primary mb-3">
                      LeetCode Tags:
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {problem.tags.map((tag) => (
                        <span
                          key={tag.slug}
                          className="px-3 py-1 rounded-full bg-background border border-border text-sm text-text-secondary"
                        >
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {problem.inferredPatterns?.length > 0 && (
                  <div className="mt-6 rounded-lg border border-accent/20 bg-accent/10 p-4">
                    <div className="text-sm font-medium text-text-primary">
                      Pattern from API tags
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {problem.inferredPatterns.map((pattern) => (
                        <span
                          key={pattern}
                          className="px-3 py-1 rounded-full bg-card border border-accent/20 text-sm font-medium text-accent"
                        >
                          {getPatternName(pattern)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {problem.examples && problem.examples.length > 0 && (
                  <div className="mt-6">
                    <h3 className="font-display font-semibold text-lg text-text-primary mb-3">
                      Examples:
                    </h3>
                    <div className="space-y-3">
                      {problem.examples.map((example, index) => (
                        <div
                          key={index}
                          className="p-4 bg-background rounded-lg"
                        >
                          <div className="text-sm mb-2">
                            <span className="text-text-secondary">Input:</span>{" "}
                            <span className="font-mono text-text-primary">
                              {example.input}
                            </span>
                          </div>
                          <div className="text-sm">
                            <span className="text-text-secondary">Output:</span>{" "}
                            <span className="font-mono text-text-primary">
                              {example.output}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {problem.constraints && problem.constraints.length > 0 && (
                  <div className="mt-6">
                    <h3 className="font-display font-semibold text-lg text-text-primary mb-3">
                      Constraints:
                    </h3>
                    <ul className="space-y-1">
                      {problem.constraints.map((constraint, index) => (
                        <li key={index} className="text-sm text-text-secondary">
                          {constraint}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Pattern Selection */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Select the Pattern</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {PATTERNS.map((pattern) => (
                    <button
                      key={pattern.id}
                      onClick={() => setSelectedPattern(pattern.id)}
                      className={`p-4 rounded-lg text-left transition-all ${
                        selectedPattern === pattern.id
                          ? "bg-accent text-white border-2 border-accent"
                          : "bg-background border-2 border-border text-text-secondary hover:border-accent/50"
                      }`}
                    >
                      <div className="font-medium text-sm">{pattern.name}</div>
                    </button>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <button
                  onClick={handleSubmit}
                  disabled={!selectedPattern || loading}
                  className="btn-primary w-full"
                >
                  {loading ? "Submitting..." : "Submit Answer"}
                </button>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}

      {/* Feedback */}
      {showFeedback && feedback && (
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4 mb-6">
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center ${
                      feedback.isCorrect ? "bg-green-100" : "bg-red-100"
                    }`}
                  >
                    <Icon
                      name={feedback.isCorrect ? "check" : "x"}
                      size={32}
                      className={
                        feedback.isCorrect ? "text-green-600" : "text-red-600"
                      }
                    />
                  </div>
                  <div>
                    <h2 className="font-display font-bold text-2xl text-text-primary">
                      {feedback.isCorrect ? "Correct!" : "Incorrect"}
                    </h2>
                    <p className="text-text-secondary">
                      {feedback.isCorrect
                        ? "Great job identifying the right pattern."
                        : "This answer was not correct, but you can learn from the confusion."}
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="p-4 bg-background rounded-lg border border-border">
                    <h3 className="font-medium text-text-primary mb-2">
                      Your Answer
                    </h3>
                    <p className="font-mono text-text-secondary capitalize">
                      {feedback.selectedPattern
                        .replace(/([A-Z])/g, " $1")
                        .trim()}
                    </p>
                  </div>
                  <div className="p-4 bg-background rounded-lg border border-border">
                    <h3 className="font-medium text-text-primary mb-2">
                      Correct Pattern
                    </h3>
                    <p className="font-mono text-text-secondary capitalize">
                      {feedback.correctPattern
                        .replace(/([A-Z])/g, " $1")
                        .trim()}
                    </p>
                  </div>
                </div>

                {feedback.explanation && (
                  <div className="p-4 bg-background rounded-lg border border-border">
                    <h3 className="font-medium text-text-primary mb-2">
                      Explanation
                    </h3>
                    <p className="text-text-secondary">
                      {feedback.explanation}
                    </p>
                  </div>
                )}

                {!feedback.isCorrect && (
                  <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                    <h3 className="font-medium text-red-700 mb-2">
                      Why this confusion happened
                    </h3>
                    <p className="text-text-secondary">
                      {getConfusionAdvice(
                        feedback.selectedPattern,
                        feedback.correctPattern,
                      )}
                    </p>
                    <div className="mt-4 text-sm text-text-secondary">
                      <p className="font-semibold text-text-primary mb-2">
                        How to track this next time
                      </p>
                      <p>
                        Compare the problem structure against the key traits of
                        the correct pattern above. If the problem involves{" "}
                        {feedback.correctPattern
                          .replace(/([A-Z])/g, " $1")
                          .trim()
                          .toLowerCase()}
                        , focus on those signal words before choosing the
                        pattern.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <div className="flex gap-3 flex-col sm:flex-row">
                  <button
                    onClick={handleNextProblem}
                    className="btn-primary flex-1"
                  >
                    Next Problem
                  </button>
                  <button
                    onClick={() => setShowFeedback(false)}
                    className="btn-secondary flex-1"
                  >
                    Review Again
                  </button>
                </div>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Updated Weakness Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded-3xl bg-background p-4 border border-border">
                    <div className="text-sm text-text-secondary">
                      Overall Accuracy
                    </div>
                    <div className="mt-2 text-3xl font-semibold text-text-primary">
                      {stats?.overallStats?.overallAccuracy?.toFixed(1) || 0}%
                    </div>
                  </div>

                  <div className="rounded-3xl bg-background p-4 border border-border">
                    <div className="text-sm text-text-secondary">
                      Most Recent Weak Patterns
                    </div>
                    {stats?.weakPatterns?.length > 0 ? (
                      <ul className="mt-3 space-y-2">
                        {stats.weakPatterns.slice(0, 4).map((pattern) => (
                          <li
                            key={pattern.pattern}
                            className="rounded-2xl bg-white p-3 border border-border"
                          >
                            <div className="font-medium text-text-primary capitalize">
                              {pattern.pattern
                                .replace(/([A-Z])/g, " $1")
                                .trim()}
                            </div>
                            <div className="text-sm text-text-secondary">
                              Accuracy: {pattern.accuracy.toFixed(1)}% •
                              Attempts: {pattern.attempts}
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-3 text-text-secondary">
                        Weak pattern data will appear after more attempts.
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default Practice;
