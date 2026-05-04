import { useState, useEffect } from "react";
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
//dark mode added
const Practice = () => {
  const [problem, setProblem] = useState(null);
  const [selectedPattern, setSelectedPattern] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [difficulty, setDifficulty] = useState("medium");

  useEffect(() => {
    loadProblem();
    loadStats();
  }, [difficulty]);

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

  const handleSubmit = async () => {
    if (!selectedPattern) {
      alert("Please select a pattern");
      return;
    }

    setLoading(true);
    try {
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
        <div className="grid lg:grid-cols-2 gap-6">
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
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <p className="whitespace-pre-wrap text-text-primary leading-relaxed">
                    {problem.description}
                  </p>
                </div>

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

<<<<<<< HEAD
                {feedback.confusionExplanation && (
                  <div className="p-4 bg-accent/5 border border-accent/20 rounded-lg">
                    <h3 className="font-medium text-text-primary mb-2">
                      Confusion Explanator:
                    </h3>
                    <p className="text-text-secondary leading-relaxed whitespace-pre-wrap">
                      {feedback.confusionExplanation}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex gap-3">
                <button onClick={handleNextProblem} className="btn-primary flex-1">
                  Next Problem
                </button>
                <button onClick={() => setShowFeedback(false)} className="btn-secondary">
                  Review
                </button>
              </div>
            </CardFooter>
          </Card>
=======
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
>>>>>>> 57a5b91aa60546f143543f7b02f6ae895331f563
        </div>
      )}
    </div>
  );
};

export default Practice;
