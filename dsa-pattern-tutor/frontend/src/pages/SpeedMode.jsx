import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

const SpeedMode = () => {
  const navigate = useNavigate();
  const [problem, setProblem] = useState(null);
  const [selectedPattern, setSelectedPattern] = useState(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isRunning, setIsRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    loadProblem();
  }, []);

  useEffect(() => {
    let interval;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      handleTimeout();
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const loadProblem = async () => {
    setLoading(true);
    try {
      const data = await problemService.getRandomProblem('medium');
      setProblem(data.problem);
      setLoadError('');
      setSelectedPattern(null);
      setTimeLeft(30);
      setIsRunning(false);
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

  const handleTimeout = () => {
    setIsRunning(false);
    handleAnswer(null, 30);
  };

  const handleAnswer = async (patternId, timeTaken) => {
    setIsRunning(false);
    setLoading(true);

    try {
      const data = await attemptService.createAttempt({
        problemId: problem.id,
        selectedPattern: patternId,
        timeTaken,
        mode: 'speed',
      });

      const isCorrect = data.attempt.isCorrect;
      setQuestionsAnswered((prev) => prev + 1);

      if (isCorrect) {
        setCorrectAnswers((prev) => prev + 1);
        setStreak((prev) => prev + 1);
        if (streak + 1 > bestStreak) {
          setBestStreak(streak + 1);
        }
        // Score calculation: base 100 + time bonus + streak bonus
        const timeBonus = Math.floor((30 - timeTaken) * 2);
        const streakBonus = streak * 10;
        setScore((prev) => prev + 100 + timeBonus + streakBonus);
      } else {
        setStreak(0);
      }

      // Load next problem
      await loadProblem();
    } catch (error) {
      console.error('Failed to submit attempt:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedPattern) {
      return;
    }

    const timeTaken = 30 - timeLeft;
    await handleAnswer(selectedPattern, timeTaken);
  };

  const endSession = () => {
    setShowResults(true);
  };

  const startNewSession = () => {
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setQuestionsAnswered(0);
    setCorrectAnswers(0);
    setShowResults(false);
    loadProblem();
  };

  if (showResults) {
    const accuracy = questionsAnswered > 0 ? (correctAnswers / questionsAnswered) * 100 : 0;

    return (
      <div className="container mx-auto px-6 py-8">
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
          <div className="card p-8 w-full max-w-2xl">
          <h1 className="font-display font-bold text-4xl text-text-primary text-center mb-8">
            Speed Mode Results
          </h1>

          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="text-center">
              <div className="text-text-secondary text-sm mb-2">Final Score</div>
              <div className="text-5xl font-display font-bold text-text-primary">{score}</div>
            </div>
            <div className="text-center">
              <div className="text-text-secondary text-sm mb-2">Accuracy</div>
              <div className="text-5xl font-display font-bold text-text-primary">
                {accuracy.toFixed(1)}%
              </div>
            </div>
            <div className="text-center">
              <div className="text-text-secondary text-sm mb-2">Questions</div>
              <div className="text-3xl font-display font-bold text-text-primary">
                {questionsAnswered}
              </div>
            </div>
            <div className="text-center">
              <div className="text-text-secondary text-sm mb-2">Best Streak</div>
              <div className="text-3xl font-display font-bold text-text-primary">
                {bestStreak}
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={startNewSession}
              className="btn-primary"
            >
              Play Again
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="btn-secondary"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AppNav />

      {!problem && loadError && (
        <ProblemEmptyState message={loadError} onRetry={loadProblem} />
      )}

      {problem && (
      <div className="container mx-auto px-4 sm:px-6 py-8">
        {/* Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="card p-4 text-center">
            <div className="text-text-secondary text-sm mb-1">Score</div>
            <div className="text-2xl font-display font-bold text-primary">{score}</div>
          </div>
          <div className="card p-4 text-center">
            <div className="text-text-secondary text-sm mb-1">Streak</div>
            <div className="text-2xl font-display font-bold text-primary">{streak}</div>
          </div>
          <div className="card p-4 text-center">
            <div className="text-text-secondary text-sm mb-1">Best</div>
            <div className="text-2xl font-display font-bold text-primary">{bestStreak}</div>
          </div>
          <div className="card p-4 text-center">
            <div className="text-text-secondary text-sm mb-1">Accuracy</div>
            <div className="text-2xl font-display font-bold text-primary">
              {questionsAnswered > 0
                ? ((correctAnswers / questionsAnswered) * 100).toFixed(0)
                : 0}%
            </div>
          </div>
        </div>

        {/* Timer */}
        <div className="text-center mb-6">
          <div
            className={`text-6xl font-display font-bold ${
              timeLeft <= 10 ? 'text-red-600 animate-pulse' : 'text-primary'
            }`}
          >
            {timeLeft}
          </div>
          {!isRunning && (
            <button
              onClick={startTimer}
              className="mt-4 btn-primary text-lg"
            >
              Start
            </button>
          )}
        </div>

        {/* Problem Display */}
        {problem && (
          <div className="card p-6 mb-6">
            <h2 className="font-display font-semibold text-2xl text-text-primary mb-4">{problem.title}</h2>
            <div className="prose max-w-none">
              <p className="whitespace-pre-wrap text-text-primary">{problem.description}</p>
            </div>
          </div>
        )}

        {/* Pattern Selection */}
        {problem && (
          <div className="card p-6">
            <h3 className="font-display font-semibold text-xl text-text-primary mb-4">Quick Select Pattern:</h3>
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {PATTERNS.map((pattern) => (
                <button
                  key={pattern.id}
                  onClick={() => {
                    setSelectedPattern(pattern.id);
                    if (isRunning) {
                      handleSubmit();
                    }
                  }}
                  disabled={!isRunning}
                  className={`p-4 rounded-lg text-center transition-all ${
                    selectedPattern === pattern.id
                      ? 'bg-primary text-white border-2 border-primary'
                      : 'bg-white text-text-secondary hover:bg-lightBlue border-2 border-border'
                  } ${!isRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="font-medium text-sm">{pattern.name}</div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      )}
    </div>
  );
};

export default SpeedMode;