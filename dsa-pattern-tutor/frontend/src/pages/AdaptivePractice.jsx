import { useState, useEffect } from 'react';
import AppNav from '../components/AppNav';
import Icon from '../components/Icon';
import ProblemEmptyState from '../components/ProblemEmptyState';
import { problemService } from '../services/problemService';
import { attemptService } from '../services/attemptService';

const PATTERNS = [
  { id: 'slidingWindow', name: 'Sliding Window' },
  { id: 'twoPointers', name: 'Two Pointers' },
  { id: 'binarySearch', name: 'Binary Search' },
  { id: 'dynamicProgramming', name: 'Dynamic Programming' },
  { id: 'greedy', name: 'Greedy' },
  { id: 'backtracking', name: 'Backtracking' },
  { id: 'graphTraversal', name: 'Graph Traversal' },
  { id: 'dfs', name: 'DFS' },
  { id: 'bfs', name: 'BFS' },
  { id: 'heap', name: 'Heap' },
  { id: 'unionFind', name: 'Union Find' },
  { id: 'prefixSum', name: 'Prefix Sum' },
  { id: 'recursion', name: 'Recursion' },
];

const AdaptivePractice = () => {
  const [problem, setProblem] = useState(null);
  const [selectedPattern, setSelectedPattern] = useState(null);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isRunning, setIsRunning] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [isAdaptive, setIsAdaptive] = useState(false);
  const [targetPattern, setTargetPattern] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    loadAdaptiveProblem();
  }, []);

  useEffect(() => {
    let interval;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      handleSubmit();
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const loadAdaptiveProblem = async () => {
    setLoading(true);
    try {
      const data = await problemService.getAdaptiveProblem();
      setProblem(data.problem);
      setLoadError('');
      setIsAdaptive(data.recommended || false);
      setTargetPattern(data.targetPattern || null);
      setSelectedPattern(null);
      setTimeLeft(data.problem.timeLimit || 60);
      setIsRunning(false);
      setShowFeedback(false);
      setFeedback(null);
    } catch (error) {
      console.error('Failed to load problem:', error);
      setProblem(null);
      setLoadError(error.response?.data?.message || 'Unable to load a question right now.');
    } finally {
      setLoading(false);
    }
  };

  const loadRandomProblem = async () => {
    setLoading(true);
    try {
      const data = await problemService.getRandomProblem();
      setProblem(data.problem);
      setLoadError('');
      setIsAdaptive(false);
      setTargetPattern(null);
      setSelectedPattern(null);
      setTimeLeft(data.problem.timeLimit || 60);
      setIsRunning(false);
      setShowFeedback(false);
      setFeedback(null);
    } catch (error) {
      console.error('Failed to load problem:', error);
      setProblem(null);
      setLoadError(error.response?.data?.message || 'Unable to load a question right now.');
    } finally {
      setLoading(false);
    }
  };

  const startTimer = () => {
    setIsRunning(true);
  };

  const handleSubmit = async () => {
    if (!selectedPattern) {
      alert('Please select a pattern');
      return;
    }

    setIsRunning(false);
    setLoading(true);

    try {
      const timeTaken = problem.timeLimit - timeLeft;
      const data = await attemptService.createAttempt({
        problemId: problem.id,
        selectedPattern,
        timeTaken,
        mode: 'adaptive',
      });

      setFeedback(data.attempt);
      setShowFeedback(true);
    } catch (error) {
      console.error('Failed to submit attempt:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNextProblem = () => {
    loadAdaptiveProblem();
  };

  if (loading && !problem) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading problem...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AppNav />

      {!problem && loadError && (
        <ProblemEmptyState message={loadError} onRetry={loadAdaptiveProblem} />
      )}

      {problem && (
      <div className="container mx-auto px-4 sm:px-6 py-8">
        {/* Adaptive Recommendation */}
        {isAdaptive && targetPattern && (
          <div className="card p-4 mb-6 bg-primary/5 border-primary/20">
            <div className="flex items-center">
              <div className="text-primary mr-3">
                <Icon name="target" size={32} />
              </div>
              <div>
                <div className="text-sm text-text-secondary">Recommended Practice</div>
                <div className="font-semibold font-mono text-text-primary capitalize">
                  Focus on: {targetPattern.replace(/([A-Z])/g, ' $1').trim()}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Timer */}
        {!showFeedback && (
          <div className="text-center mb-6">
            <div
              className={`text-4xl font-display font-bold ${
                timeLeft <= 10 ? 'text-red-600 animate-pulse' : 'text-primary'
              }`}
            >
              {timeLeft}s
            </div>
            {!isRunning && (
              <button
                onClick={startTimer}
                className="mt-2 btn-primary"
              >
                Start Timer
              </button>
            )}
          </div>
        )}

        {/* Problem Display */}
        {problem && !showFeedback && (
          <div className="card p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-semibold text-2xl text-text-primary">{problem.title}</h2>
              <span className="px-3 py-1 rounded-full text-sm capitalize bg-primary/10 text-primary border border-primary/20">
                {problem.difficulty}
              </span>
            </div>
            <div className="prose max-w-none">
              <p className="whitespace-pre-wrap text-text-primary">{problem.description}</p>
            </div>

            {problem.examples && problem.examples.length > 0 && (
              <div className="mt-6">
                <h3 className="font-display font-semibold text-lg text-text-primary mb-3">Examples:</h3>
                {problem.examples.map((example, index) => (
                  <div key={index} className="bg-lightBlue p-4 rounded-lg mb-2">
                    <div className="text-sm">
                      <span className="text-text-secondary">Input:</span> {example.input}
                    </div>
                    <div className="text-sm">
                      <span className="text-text-secondary">Output:</span> {example.output}
                    </div>
                    {example.explanation && (
                      <div className="text-sm text-text-secondary mt-1">
                        {example.explanation}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {problem.constraints && problem.constraints.length > 0 && (
              <div className="mt-6">
                <h3 className="font-display font-semibold text-lg text-text-primary mb-3">Constraints:</h3>
                <ul className="list-disc list-inside text-text-secondary">
                  {problem.constraints.map((constraint, index) => (
                    <li key={index}>{constraint}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Pattern Selection */}
        {problem && !showFeedback && (
          <div className="card p-6 mb-6">
            <h3 className="font-display font-semibold text-xl text-text-primary mb-4">Select the Pattern:</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {PATTERNS.map((pattern) => (
                <button
                  key={pattern.id}
                  onClick={() => setSelectedPattern(pattern.id)}
                  className={`p-4 rounded-lg text-left transition-all ${
                    selectedPattern === pattern.id
                      ? 'bg-primary text-white border-2 border-primary'
                      : 'bg-white text-text-secondary hover:bg-lightBlue border-2 border-border'
                  }`}
                >
                  <div className="font-medium">{pattern.name}</div>
                </button>
              ))}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={handleSubmit}
                disabled={!selectedPattern || loading}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Answer
              </button>
            </div>
          </div>
        )}

        {/* Feedback Modal */}
        {showFeedback && feedback && (
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                feedback.isCorrect ? 'bg-green-100' : 'bg-red-100'
              }`}>
                <Icon
                  name={feedback.isCorrect ? 'check' : 'x'}
                  size={32}
                  className={feedback.isCorrect ? 'text-green-600' : 'text-red-600'}
                />
              </div>
              <div
                className={`text-2xl font-display font-bold ${
                  feedback.isCorrect ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {feedback.isCorrect ? 'Correct!' : 'Incorrect'}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-display font-semibold text-lg text-text-primary mb-2">Explanation:</h3>
              <p className="text-text-secondary">{feedback.explanation}</p>
            </div>

            <div className="mb-6">
              <h3 className="font-display font-semibold text-lg text-text-primary mb-2">Your Answer:</h3>
              <p className="text-text-secondary font-mono capitalize">
                {feedback.selectedPattern.replace(/([A-Z])/g, ' $1').trim()}
              </p>
            </div>

            <div className="mb-6">
              <h3 className="font-display font-semibold text-lg text-text-primary mb-2">Correct Pattern:</h3>
              <p className="text-text-secondary font-mono capitalize">
                {feedback.correctPattern.replace(/([A-Z])/g, ' $1').trim()}
              </p>
            </div>

            <div className="mb-6">
              <h3 className="font-display font-semibold text-lg text-text-primary mb-2">Time Taken:</h3>
              <p className="text-text-secondary">{feedback.timeTaken} seconds</p>
            </div>

            {feedback.exampleSolution && (
              <div className="mb-6">
                <h3 className="font-display font-semibold text-lg text-text-primary mb-2">Example Solution:</h3>
                <pre className="bg-lightBlue p-4 rounded-lg overflow-x-auto">
                  <code className="text-sm">{feedback.exampleSolution}</code>
                </pre>
              </div>
            )}

            <div className="flex justify-end gap-4">
              <button
                onClick={handleNextProblem}
                className="btn-primary"
              >
                Next Adaptive Problem
              </button>
            </div>
          </div>
        )}
      </div>
      )}
    </div>
  );
};

export default AdaptivePractice;