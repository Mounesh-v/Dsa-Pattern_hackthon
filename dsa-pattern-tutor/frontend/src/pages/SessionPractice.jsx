import { useState, useEffect, useRef } from "react";
import Card, {
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../components/Card";
import Icon from "../components/Icon";
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

const ChartColors = ["#4f46e5", "#10b981", "#f97316", "#ef4444", "#facc15"];

const PieChart = ({ segments }) => {
  const radius = 80;
  const center = 100;
  const circumference = 2 * Math.PI * radius;
  const total = segments.reduce((sum, segment) => sum + segment.value, 0);

  let accumulator = 0;
  const paths = segments.map((segment, index) => {
    if (total === 0) {
      return null;
    }

    const startAngle = (accumulator / total) * 2 * Math.PI;
    accumulator += segment.value;
    const endAngle = (accumulator / total) * 2 * Math.PI;

    const x1 = center + radius * Math.cos(startAngle - Math.PI / 2);
    const y1 = center + radius * Math.sin(startAngle - Math.PI / 2);
    const x2 = center + radius * Math.cos(endAngle - Math.PI / 2);
    const y2 = center + radius * Math.sin(endAngle - Math.PI / 2);
    const largeArcFlag = endAngle - startAngle > Math.PI ? 1 : 0;

    return (
      <path
        key={segment.label}
        d={`M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
        fill={ChartColors[index % ChartColors.length]}
      />
    );
  });

  return (
    <div className="flex flex-col items-center gap-4">
      <svg className="w-48 h-48" viewBox="0 0 200 200">
        {paths}
      </svg>
      <div className="grid grid-cols-1 gap-2 text-sm text-text-secondary">
        {segments.map((segment, index) => (
          <div key={segment.label} className="flex items-center gap-2">
            <span
              className="inline-block w-3 h-3 rounded-full"
              style={{ background: ChartColors[index % ChartColors.length] }}
            />
            <span>
              {segment.label}: {segment.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const BarChart = ({ data }) => {
  const maxValue = Math.max(...data.map((item) => item.value), 1);

  return (
    <div className="space-y-3">
      {data.map((item, index) => (
        <div key={item.label} className="space-y-1">
          <div className="flex items-center justify-between text-sm text-text-secondary">
            <span>{item.label}</span>
            <span>{item.value}%</span>
          </div>
          <div className="h-4 rounded-full bg-background border border-border overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                width: `${(item.value / maxValue) * 100}%`,
                background: ChartColors[index % ChartColors.length],
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

const SessionPractice = () => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedPattern, setSelectedPattern] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [sessionResult, setSessionResult] = useState(null);
  const [error, setError] = useState("");
  const questionStartRef = useRef(Date.now());

  useEffect(() => {
    loadSessionQuestions();
  }, []);

  const loadSessionQuestions = async () => {
    setLoading(true);
    setError("");
    setSessionResult(null);
    setQuestions([]);
    setCurrentIndex(0);
    setAnswers([]);
    setSelectedPattern(null);

    try {
      const data = await problemService.getSessionProblems();
      setQuestions(data.session.questions || []);
      questionStartRef.current = Date.now();
    } catch (err) {
      console.error("Failed to load session questions:", err);
      setError(
        err.response?.data?.message || "Unable to load session questions.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!selectedPattern) {
      return;
    }

    const current = questions[currentIndex];
    const timeTaken = Math.max(
      1,
      Math.round((Date.now() - questionStartRef.current) / 1000),
    );
    const nextAnswers = [
      ...answers,
      {
        problemId: current.id,
        selectedPattern,
        timeTaken,
        source: current.source,
      },
    ];

    setAnswers(nextAnswers);
    setSelectedPattern(null);

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
      questionStartRef.current = Date.now();
      return;
    }

    await submitSession(nextAnswers);
  };

  const submitSession = async (attempts) => {
    setSubmitting(true);
    try {
      const response = await attemptService.submitSessionAttempt(attempts);
      setSessionResult(response.summary);
    } catch (err) {
      console.error("Failed to submit session:", err);
      setError(err.response?.data?.message || "Unable to submit session.");
    } finally {
      setSubmitting(false);
    }
  };

  const currentQuestion = questions[currentIndex];
  const answeredCount = answers.length;
  const weakCount = questions.filter((q) => q.source === "weak").length;
  const randomCount = questions.filter((q) => q.source === "random").length;

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold text-text-primary">
          Session Practice
        </h1>
        <p className="text-text-secondary mt-2 max-w-2xl">
          Work through a 12-question session with weak-topic and random
          questions. Submit each question as you go and
          review your detailed results at the end.
        </p>
      </div>

      {loading && (
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="text-center">
            <div className="w-14 h-14 border-4 border-accent/20 border-t-accent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-text-secondary">Preparing your session…</p>
          </div>
        </div>
      )}

      {error && !loading && (
        <Card>
          <CardContent>
            <div className="text-red-600 font-medium">{error}</div>
            <div className="mt-4">
              <button onClick={loadSessionQuestions} className="btn-primary">
                Retry
              </button>
            </div>
          </CardContent>
        </Card>
      )}

      {!loading && !error && !sessionResult && questions.length > 0 && (
        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <CardTitle>
                      Question {currentIndex + 1} of {questions.length}
                    </CardTitle>
                    <p className="text-sm text-text-secondary">
                      {currentQuestion.source === "weak"
                        ? "Weak concept practice"
                        : "Random practice"}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="block text-sm text-text-secondary">
                      Progress
                    </span>
                    <span className="font-semibold text-text-primary">
                      {answeredCount} answered
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none text-text-primary">
                  <h2 className="font-semibold text-xl">
                    {currentQuestion.title}
                  </h2>
                  <p className="whitespace-pre-wrap mt-4">
                    {currentQuestion.description}
                  </p>
                </div>

                {currentQuestion.examples?.length > 0 && (
                  <div className="mt-6">
                    <h3 className="font-semibold text-lg text-text-primary mb-3">
                      Examples
                    </h3>
                    <div className="space-y-3">
                      {currentQuestion.examples.map((example, index) => (
                        <div
                          key={index}
                          className="rounded-lg bg-background p-4 border border-border"
                        >
                          <div className="text-sm text-text-secondary">
                            <strong>Input:</strong> {example.input}
                          </div>
                          <div className="text-sm text-text-secondary mt-1">
                            <strong>Output:</strong> {example.output}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {currentQuestion.constraints?.length > 0 && (
                  <div className="mt-6">
                    <h3 className="font-semibold text-lg text-text-primary mb-3">
                      Constraints
                    </h3>
                    <ul className="list-disc list-inside space-y-1 text-text-secondary">
                      {currentQuestion.constraints.map((constraint, index) => (
                        <li key={index}>{constraint}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Select the Pattern</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {PATTERNS.map((pattern) => (
                    <button
                      key={pattern.id}
                      type="button"
                      onClick={() => setSelectedPattern(pattern.id)}
                      className={`rounded-2xl p-4 text-left border transition ${
                        selectedPattern === pattern.id
                          ? "border-accent bg-accent/10 text-text-primary"
                          : "border-border bg-background text-text-secondary hover:border-accent/50"
                      }`}
                    >
                      <div className="font-medium">{pattern.name}</div>
                    </button>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <button
                  type="button"
                  onClick={handleSubmitAnswer}
                  disabled={!selectedPattern || submitting}
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {currentIndex + 1 === questions.length
                    ? "Submit Session"
                    : "Submit Answer"}
                </button>
              </CardFooter>
            </Card>
          </div>

          <aside className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Session Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-text-secondary">
                  <div className="flex justify-between">
                    <span>Weak questions</span>
                    <span>{weakCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Random questions</span>
                    <span>{randomCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Answered</span>
                    <span>{answeredCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Remaining</span>
                    <span>{questions.length - answeredCount}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Session Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-text-secondary text-sm">
                  <li>Work through all 12 questions without skipping.</li>
                  <li>Use the pattern list to narrow your reasoning.</li>
                  <li>Focus on weak-concept questions to boost accuracy.</li>
                </ul>
              </CardContent>
            </Card>
          </aside>
        </div>
      )}

      {!loading && sessionResult && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Session Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-3xl border border-border bg-background p-5">
                  <div className="text-sm text-text-secondary">
                    Total Questions
                  </div>
                  <div className="mt-3 text-3xl font-semibold text-text-primary">
                    {sessionResult.totalQuestions}
                  </div>
                </div>
                <div className="rounded-3xl border border-border bg-background p-5">
                  <div className="text-sm text-text-secondary">
                    Correct Answers
                  </div>
                  <div className="mt-3 text-3xl font-semibold text-text-primary">
                    {sessionResult.correctAnswers}
                  </div>
                </div>
                <div className="rounded-3xl border border-border bg-background p-5">
                  <div className="text-sm text-text-secondary">
                    Weak Accuracy
                  </div>
                  <div className="mt-3 text-3xl font-semibold text-text-primary">
                    {sessionResult.weakAccuracy}%
                  </div>
                </div>
                <div className="rounded-3xl border border-border bg-background p-5">
                  <div className="text-sm text-text-secondary">
                    Average Time
                  </div>
                  <div className="mt-3 text-3xl font-semibold text-text-primary">
                    {sessionResult.averageTime}s
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
            <Card>
              <CardHeader>
                <CardTitle>Accuracy Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 lg:grid-cols-2">
                  <div className="rounded-3xl bg-background p-5 border border-border">
                    <PieChart
                      segments={[
                        {
                          label: "Correct",
                          value: sessionResult.correctAnswers,
                        },
                        {
                          label: "Incorrect",
                          value: sessionResult.incorrectAnswers,
                        },
                      ]}
                    />
                  </div>
                  <div className="rounded-3xl bg-background p-5 border border-border">
                    <h3 className="text-sm font-semibold text-text-primary mb-4">
                      Topic Performance
                    </h3>
                    <BarChart
                      data={[
                        {
                          label: "Weak questions",
                          value: sessionResult.weakAccuracy,
                        },
                        {
                          label: "Overall session",
                          value: sessionResult.sessionAccuracy,
                        },
                      ]}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Common Confusions</CardTitle>
              </CardHeader>
              <CardContent>
                {sessionResult.topConfusions.length > 0 ? (
                  <ul className="space-y-3 text-text-secondary">
                    {sessionResult.topConfusions.map((confusion) => (
                      <li
                        key={`${confusion.selectedPattern}-${confusion.correctPattern}`}
                        className="rounded-3xl border border-border bg-background p-4"
                      >
                        <div className="text-sm text-text-primary font-semibold">
                          {confusion.selectedPattern.replace(/([A-Z])/g, " $1")}{" "}
                          →{" "}
                          {confusion.correctPattern.replace(/([A-Z])/g, " $1")}
                        </div>
                        <div className="mt-1 text-sm">
                          Missed {confusion.count} times
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-text-secondary">
                    No repeated confusions this session.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Improvement Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                {sessionResult.improvementNotes.map((note) => (
                  <div
                    key={note.pattern}
                    className="rounded-3xl border border-border bg-background p-4"
                  >
                    <div className="text-sm font-semibold text-text-primary">
                      {note.pattern.replace(/([A-Z])/g, " $1")}
                    </div>
                    <div className="mt-2 text-sm text-text-secondary">
                      Session accuracy: {note.sessionAccuracy}%
                    </div>
                    <div className="text-sm text-text-secondary">
                      Previous accuracy: {note.previousAccuracy}%
                    </div>
                    <div
                      className={`mt-2 text-sm font-medium ${note.improved ? "text-green-600" : "text-orange-600"}`}
                    >
                      {note.improved
                        ? "Improved over prior attempts"
                        : "Keep practicing this pattern"}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
            <button onClick={loadSessionQuestions} className="btn-secondary">
              Start New Session
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SessionPractice;
