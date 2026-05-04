import { useState } from 'react';
import Icon from '../components/Icon';
import PatternCard from '../components/PatternCard';

const PATTERNS = [
  { id: 'slidingWindow', name: 'Sliding Window', difficulty: 'Medium', mastery: 65, problemsSolved: 12 },
  { id: 'twoPointers', name: 'Two Pointers', difficulty: 'Medium', mastery: 42, problemsSolved: 8 },
  { id: 'binarySearch', name: 'Binary Search', difficulty: 'Easy', mastery: 89, problemsSolved: 15 },
  { id: 'dynamicProgramming', name: 'Dynamic Programming', difficulty: 'Hard', mastery: 35, problemsSolved: 6 },
  { id: 'greedy', name: 'Greedy', difficulty: 'Medium', mastery: 58, problemsSolved: 10 },
  { id: 'backtracking', name: 'Backtracking', difficulty: 'Hard', mastery: 28, problemsSolved: 4 },
  { id: 'graphTraversal', name: 'Graph Traversal', difficulty: 'Medium', mastery: 72, problemsSolved: 14 },
  { id: 'dfs', name: 'Depth First Search', difficulty: 'Medium', mastery: 67, problemsSolved: 11 },
  { id: 'bfs', name: 'Breadth First Search', difficulty: 'Medium', mastery: 61, problemsSolved: 9 },
  { id: 'heap', name: 'Heap/Priority Queue', difficulty: 'Medium', mastery: 45, problemsSolved: 7 },
  { id: 'unionFind', name: 'Union Find', difficulty: 'Hard', mastery: 32, problemsSolved: 5 },
  { id: 'prefixSum', name: 'Prefix Sum', difficulty: 'Easy', mastery: 78, problemsSolved: 13 },
  { id: 'recursion', name: 'Recursion', difficulty: 'Medium', mastery: 55, problemsSolved: 9 },
];

const Patterns = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');

  const filteredPatterns = PATTERNS.filter((pattern) => {
    const matchesSearch = pattern.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = selectedDifficulty === 'all' || pattern.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();
    return matchesSearch && matchesDifficulty;
  });

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display font-bold text-3xl text-text-primary mb-2">
          Pattern Library
        </h1>
        <p className="text-text-secondary">
          Master the fundamental patterns behind DSA problems
        </p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="flex-1 relative">
          <Icon name="search" size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
          <input
            type="text"
            placeholder="Search patterns..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field w-full pl-10"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'easy', 'medium', 'hard'].map((difficulty) => (
            <button
              key={difficulty}
              onClick={() => setSelectedDifficulty(difficulty)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                selectedDifficulty === difficulty
                  ? 'bg-accent text-white'
                  : 'bg-card border border-border text-text-secondary hover:bg-accent/5'
              }`}
            >
              {difficulty}
            </button>
          ))}
        </div>
      </div>

      {/* Pattern Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredPatterns.map((pattern) => (
          <PatternCard key={pattern.id} pattern={pattern} />
        ))}
      </div>

      {filteredPatterns.length === 0 && (
        <div className="text-center py-12">
          <Icon name="search" size={48} className="text-text-secondary mx-auto mb-4" />
          <p className="text-text-secondary">No patterns found matching your search</p>
        </div>
      )}
    </div>
  );
};

export default Patterns;