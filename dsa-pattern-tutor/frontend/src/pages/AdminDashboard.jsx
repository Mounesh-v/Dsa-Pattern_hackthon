import { useEffect, useState } from 'react';
import AppNav from '../components/AppNav';
import Icon from '../components/Icon';
import { problemService } from '../services/problemService';

const AdminDashboard = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProblem, setEditingProblem] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    difficulty: 'medium',
    correctPattern: 'slidingWindow',
    timeLimit: 60,
    examples: [],
    constraints: [],
  });

  useEffect(() => {
    loadProblems();
  }, []);

  const loadProblems = async () => {
    try {
      const data = await problemService.getAllProblems();
      setProblems(data.problems);
    } catch (error) {
      console.error('Failed to load problems:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProblem = async (e) => {
    e.preventDefault();
    try {
      await problemService.createProblem(formData);
      setShowAddModal(false);
      resetForm();
      loadProblems();
    } catch (error) {
      console.error('Failed to create problem:', error);
      alert('Failed to create problem');
    }
  };

  const handleUpdateProblem = async (e) => {
    e.preventDefault();
    try {
      await problemService.updateProblem(editingProblem._id, formData);
      setShowAddModal(false);
      setEditingProblem(null);
      resetForm();
      loadProblems();
    } catch (error) {
      console.error('Failed to update problem:', error);
      alert('Failed to update problem');
    }
  };

  const handleDeleteProblem = async (id) => {
    if (!window.confirm('Are you sure you want to delete this problem?')) {
      return;
    }

    try {
      await problemService.deleteProblem(id);
      loadProblems();
    } catch (error) {
      console.error('Failed to delete problem:', error);
      alert('Failed to delete problem');
    }
  };

  const handleEditProblem = (problem) => {
    setEditingProblem(problem);
    setFormData({
      title: problem.title,
      description: problem.description,
      difficulty: problem.difficulty,
      correctPattern: problem.correctPattern,
      timeLimit: problem.timeLimit,
      examples: problem.examples || [],
      constraints: problem.constraints || [],
    });
    setShowAddModal(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      difficulty: 'medium',
      correctPattern: 'slidingWindow',
      timeLimit: 60,
      examples: [],
      constraints: [],
    });
  };

  const PATTERNS = [
    'slidingWindow',
    'twoPointers',
    'binarySearch',
    'dynamicProgramming',
    'greedy',
    'backtracking',
    'graphTraversal',
    'dfs',
    'bfs',
    'heap',
    'unionFind',
    'prefixSum',
    'recursion',
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AppNav />

      <div className="container mx-auto px-4 sm:px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="card p-6">
            <div className="text-text-secondary text-sm mb-2">Total Problems</div>
            <div className="text-3xl font-display font-bold text-primary">
              {problems.length}
            </div>
          </div>
          <div className="card p-6">
            <div className="text-text-secondary text-sm mb-2">Easy Problems</div>
            <div className="text-3xl font-display font-bold text-primary">
              {problems.filter((p) => p.difficulty === 'easy').length}
            </div>
          </div>
          <div className="card p-6">
            <div className="text-text-secondary text-sm mb-2">Hard Problems</div>
            <div className="text-3xl font-display font-bold text-primary">
              {problems.filter((p) => p.difficulty === 'hard').length}
            </div>
          </div>
        </div>

        {/* Add Problem Button */}
        <div className="mb-6">
          <button
            onClick={() => {
              resetForm();
              setEditingProblem(null);
              setShowAddModal(true);
            }}
            className="btn-primary"
          >
            <Icon name="plus" size={16} className="mr-2" />
            Add New Problem
          </button>
        </div>

        {/* Problems List */}
        <div className="card p-6">
          <h2 className="font-display font-semibold text-2xl text-text-primary mb-4">All Problems</h2>
          <div className="space-y-4">
            {problems.map((problem) => (
              <div
                key={problem._id}
                className="flex items-center justify-between p-4 bg-lightBlue rounded-lg"
              >
                <div className="flex-1">
                  <div className="font-semibold text-text-primary">{problem.title}</div>
                  <div className="text-sm text-text-secondary">
                    <span className="capitalize">{problem.difficulty}</span> •{' '}
                    <span className="font-mono capitalize">
                      {problem.correctPattern.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditProblem(problem)}
                    className="px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
                  >
                    <Icon name="edit" size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteProblem(problem._id)}
                    className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    <Icon name="trash" size={16} />
                  </button>
                </div>
              </div>
            ))}
            {problems.length === 0 && (
              <div className="text-center text-text-secondary py-8">
                No problems yet. Add your first problem!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add/Edit Problem Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="card p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-slide-up">
            <h2 className="font-display font-semibold text-2xl text-text-primary mb-4">
              {editingProblem ? 'Edit Problem' : 'Add New Problem'}
            </h2>

            <form onSubmit={editingProblem ? handleUpdateProblem : handleAddProblem} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="input-field w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input-field w-full h-32"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Difficulty</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                    className="input-field w-full"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Time Limit (seconds)</label>
                  <input
                    type="number"
                    value={formData.timeLimit}
                    onChange={(e) => setFormData({ ...formData, timeLimit: parseInt(e.target.value) })}
                    className="input-field w-full"
                    min="10"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Correct Pattern</label>
                <select
                  value={formData.correctPattern}
                  onChange={(e) => setFormData({ ...formData, correctPattern: e.target.value })}
                  className="input-field w-full"
                >
                  {PATTERNS.map((pattern) => (
                    <option key={pattern} value={pattern}>
                      {pattern.replace(/([A-Z])/g, ' $1').trim()}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingProblem(null);
                    resetForm();
                  }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                >
                  {editingProblem ? 'Update Problem' : 'Add Problem'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;