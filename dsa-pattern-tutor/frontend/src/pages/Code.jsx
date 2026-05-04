import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import Editor from "@monaco-editor/react";
import Card, {
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../components/Card";
import Icon from "../components/Icon";
import { problemService } from "../services/problemService";
import { codeService } from "../services/codeService";

const LANGUAGE_OPTIONS = [
  { value: "javascript", label: "JavaScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "cpp", label: "C++" },
];

const STARTER_CODE = {
  javascript: `function solve(input) {
  // Write your approach here
}
`,
  python: `def solve(input):
    # Write your approach here
    pass
`,
  java: `class Solution {
    public Object solve(Object input) {
        // Write your approach here
        return null;
    }
}
`,
  cpp: `class Solution {
public:
    void solve() {
        // Write your approach here
    }
};
`,
};

const formatPattern = (pattern) =>
  pattern?.replace(/([A-Z])/g, " $1").trim() || "";

const OutputWindow = ({ title, value }) => (
  <div className="rounded-lg border border-border bg-background">
    <div className="border-b border-border px-4 py-3">
      <h3 className="text-sm font-semibold text-text-primary">{title}</h3>
    </div>
    <pre className="min-h-32 whitespace-pre-wrap break-words px-4 py-3 font-mono text-sm leading-relaxed text-text-secondary">
      {value || "No output available yet."}
    </pre>
  </div>
);

const Code = () => {
  const location = useLocation();
  const selectedLeetCodeSlug = location.state?.leetcodeTitleSlug;
  const [problem, setProblem] = useState(null);
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(STARTER_CODE.javascript);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [tutorScore, setTutorScore] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadProblem();
    loadTutorScore();
  }, []);

  const selectedLanguageLabel = useMemo(
    () =>
      LANGUAGE_OPTIONS.find((option) => option.value === language)?.label ||
      "Code",
    [language],
  );

  const loadProblem = async () => {
    setLoading(true);
    setError("");
    setAnalysis(null);
    setMessage("");

    try {
      const data = selectedLeetCodeSlug
        ? await problemService.getLeetCodeProblem(selectedLeetCodeSlug)
        : await problemService.getRandomProblem();
      setProblem(data.problem);
      setCode(STARTER_CODE[language]);
    } catch (err) {
      console.error("Failed to load coding problem:", err);
      setError(err.response?.data?.message || "Unable to load a code problem.");
    } finally {
      setLoading(false);
    }
  };

  const loadTutorScore = async () => {
    try {
      const data = await codeService.getTutorScore();
      setTutorScore(data.tutorScore);
    } catch (err) {
      console.error("Failed to load tutor score:", err);
    }
  };

  const handleLanguageChange = (event) => {
    const nextLanguage = event.target.value;
    setLanguage(nextLanguage);
    setCode(STARTER_CODE[nextLanguage]);
    setAnalysis(null);
    setMessage("");
  };

  const handleSubmit = async () => {
    if (!problem || !code.trim()) {
      return;
    }

    setSubmitting(true);
    setError("");
    setMessage("");

    try {
      const response = await codeService.submitCode({
        problemId: problem.id,
        language,
        code,
        externalProblem:
          problem.source === "leetcode"
            ? {
                source: problem.source,
                title: problem.title,
                description: problem.description,
                examples: problem.examples,
                constraints: problem.constraints,
                correctPattern: problem.correctPattern,
              }
            : undefined,
      });
      setAnalysis(response.analysis);
      setTutorScore(response.tutorScore);
      setMessage(response.message);
    } catch (err) {
      console.error("Failed to analyze code:", err);
      setError(err.response?.data?.message || "Unable to analyze your code.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-text-primary">
            Code
          </h1>
          <p className="mt-2 max-w-2xl text-text-secondary">
            Solve a DSA question, submit your code, and get Gemini-powered
            feedback on your approach.
          </p>
        </div>

        <div className="rounded-lg border border-border bg-card px-4 py-3 text-right">
          <div className="text-xs uppercase tracking-wide text-text-secondary">
            Tutor Score
          </div>
          <div className="mt-1 font-display text-2xl font-bold text-text-primary">
            {Math.round(tutorScore?.totalScore || 0)}
          </div>
          <div className="text-xs text-text-secondary">
            {tutorScore?.scoredQuestions || 0} scored · avg{" "}
            {Math.round(tutorScore?.averageScore || 0)}/100
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex min-h-[40vh] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-accent/20 border-t-accent" />
            <p className="text-text-secondary">Loading code question...</p>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-[0.9fr_1.35fr]">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle>{problem?.title}</CardTitle>
                    <p className="mt-2 text-sm capitalize text-text-secondary">
                      {problem?.difficulty}
                    </p>
                    {problem?.source === "leetcode" && (
                      <a
                        href={problem.url}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-3 inline-flex items-center gap-1 rounded-full border border-border bg-background px-3 py-1 text-sm text-text-secondary hover:text-accent"
                      >
                        LeetCode
                        <Icon name="externalLink" size={14} />
                      </a>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={loadProblem}
                    className="btn-secondary inline-flex items-center gap-2"
                  >
                    <Icon name="refresh" size={16} />
                    New
                  </button>
                </div>
              </CardHeader>
              <CardContent>
                {problem?.contentHtml ? (
                  <div
                    className="prose max-w-none leading-relaxed text-text-primary [&_pre]:overflow-auto [&_pre]:rounded-lg [&_pre]:bg-background [&_pre]:p-4 [&_code]:font-mono [&_strong]:text-text-primary"
                    dangerouslySetInnerHTML={{ __html: problem.contentHtml }}
                  />
                ) : (
                  <p className="whitespace-pre-wrap leading-relaxed text-text-primary">
                    {problem?.description}
                  </p>
                )}

                {problem?.examples?.length > 0 && (
                  <div className="mt-6 space-y-3">
                    <h3 className="font-semibold text-text-primary">
                      Examples
                    </h3>
                    {problem.examples.map((example, index) => (
                      <div
                        key={index}
                        className="rounded-lg border border-border bg-background p-4 text-sm"
                      >
                        <div className="text-text-secondary">
                          <span className="font-semibold text-text-primary">
                            Input:
                          </span>{" "}
                          {example.input}
                        </div>
                        <div className="mt-1 text-text-secondary">
                          <span className="font-semibold text-text-primary">
                            Output:
                          </span>{" "}
                          {example.output}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {problem?.constraints?.length > 0 && (
                  <div className="mt-6">
                    <h3 className="font-semibold text-text-primary">
                      Constraints
                    </h3>
                    <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-text-secondary">
                      {problem.constraints.map((constraint, index) => (
                        <li key={index}>{constraint}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>

            {analysis && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between gap-4">
                    <CardTitle>Gemini Review</CardTitle>
                    <div className="rounded-lg bg-accent/10 px-3 py-2 font-display text-xl font-bold text-accent">
                      {analysis.score}/100
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {message && (
                    <div className="mb-4 rounded-lg border border-border bg-background p-3 text-sm text-text-secondary">
                      {message}
                    </div>
                  )}
                  <div className="space-y-5 text-text-secondary">
                    {analysis.keyPoints?.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-text-primary">
                          Important Points
                        </h3>
                        <ul className="mt-2 list-inside list-disc space-y-1">
                          {analysis.keyPoints.map((point, index) => (
                            <li key={index}>{point}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div>
                      <h3 className="font-semibold text-text-primary">
                        Approach
                      </h3>
                      <ul className="mt-2 list-inside list-disc space-y-1">
                        <li>{analysis.summary}</li>
                        <li>{analysis.approachFeedback}</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-semibold text-text-primary">
                        Complexity
                      </h3>
                      <ul className="mt-2 list-inside list-disc space-y-1">
                        <li>{analysis.complexity}</li>
                      </ul>
                    </div>

                    {analysis.improvements?.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-text-primary">
                          Improvements
                        </h3>
                        <ul className="mt-2 list-inside list-disc space-y-1">
                          {analysis.improvements.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="grid gap-4 lg:grid-cols-2">
                      <OutputWindow
                        title="Expected Output"
                        value={analysis.expectedOutput}
                      />
                      <OutputWindow
                        title="Your Code Output"
                        value={analysis.codeOutput}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <Card>
            <CardHeader>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle>{selectedLanguageLabel} Editor</CardTitle>
                  <p className="mt-1 text-sm text-text-secondary">
                    Each question can add up to 100 tutor points on the first
                    scored attempt only.
                  </p>
                </div>
                <select
                  value={language}
                  onChange={handleLanguageChange}
                  className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-text-primary"
                >
                  {LANGUAGE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-hidden rounded-lg border border-border">
                <Editor
                  height="620px"
                  language={language}
                  value={code}
                  onChange={(value) => setCode(value || "")}
                  theme="vs-dark"
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbersMinChars: 3,
                    padding: { top: 16, bottom: 16 },
                    scrollBeyondLastLine: false,
                    wordWrap: "on",
                  }}
                />
              </div>
            </CardContent>
            <CardFooter>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting || !code.trim()}
                className="btn-primary inline-flex w-full items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Icon name="play" size={16} />
                {submitting ? "Analyzing..." : "Submit Code"}
              </button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Code;
