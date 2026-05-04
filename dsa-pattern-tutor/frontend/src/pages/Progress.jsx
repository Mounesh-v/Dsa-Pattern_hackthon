import { useEffect, useState } from 'react';
import Icon from '../components/Icon';
import Card, { CardHeader, CardTitle, CardContent } from '../components/Card';
import ProgressBar from '../components/ProgressBar';
import { analyticsService } from '../services/analyticsService';

const Progress = () => {
  const [progressData, setProgressData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      const data = await analyticsService.getProgress();
      setProgressData(data);
    } catch (error) {
      console.error('Failed to load progress:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-accent/20 border-t-accent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading progress...</p>
        </div>
      </div>
    );
  }

  const progressHistory = progressData?.progressHistory || [];
  const overallStats = progressData?.overallStats || {};

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display font-bold text-3xl text-text-primary mb-2">
          Your Progress
        </h1>
        <p className="text-text-secondary">
          Track your learning journey and improvement over time
        </p>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <div className="text-text-secondary text-sm mb-2">Total Problems</div>
          <div className="text-3xl font-display font-bold text-text-primary">
            {overallStats.totalProblems || 0}
          </div>
        </Card>
        <Card>
          <div className="text-text-secondary text-sm mb-2">Solved</div>
          <div className="text-3xl font-display font-bold text-accent">
            {overallStats.solved || 0}
          </div>
        </Card>
        <Card>
          <div className="text-text-secondary text-sm mb-2">Accuracy</div>
          <div className="text-3xl font-display font-bold text-text-primary">
            {overallStats.accuracy?.toFixed(1) || 0}%
          </div>
        </Card>
        <Card>
          <div className="text-text-secondary text-sm mb-2">Current Streak</div>
          <div className="text-3xl font-display font-bold text-text-primary">
            {overallStats.streak || 0}
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Progress Over Time */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Progress Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {progressHistory.slice(0, 7).map((entry, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-24 text-sm text-text-secondary">
                      {new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                    <div className="flex-1">
                      <ProgressBar value={entry.accuracy} max={100} size="sm" color="accent" />
                    </div>
                    <div className="w-16 text-right text-sm font-medium text-text-primary">
                      {entry.accuracy.toFixed(0)}%
                    </div>
                  </div>
                ))}

                {progressHistory.length === 0 && (
                  <div className="text-center py-8">
                    <Icon name="chart" size={48} className="text-text-secondary mx-auto mb-4" />
                    <p className="text-text-secondary">Start practicing to see your progress</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Achievements */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Recent Achievements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { icon: 'flame', title: '5 Day Streak', date: '2 days ago' },
                  { icon: 'star', title: 'First Perfect Score', date: '1 week ago' },
                  { icon: 'trophy', title: 'Pattern Master', date: '2 weeks ago' },
                ].map((achievement, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-background rounded-lg">
                    <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                      <Icon name={achievement.icon} size={20} className="text-accent" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-text-primary">{achievement.title}</h4>
                      <p className="text-xs text-text-secondary">{achievement.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Learning Goals */}
      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Learning Goals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { title: 'Complete 50 problems', progress: 32, total: 50 },
                { title: 'Achieve 80% accuracy', progress: 78, total: 100 },
                { title: 'Master 5 patterns', progress: 3, total: 5 },
              ].map((goal, index) => (
                <div key={index} className="p-4 bg-background rounded-lg">
                  <h4 className="font-medium text-text-primary mb-3">{goal.title}</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-text-secondary">Progress</span>
                      <span className="font-medium text-text-primary">{goal.progress}/{goal.total}</span>
                    </div>
                    <ProgressBar value={goal.progress} max={goal.total} size="sm" color="accent" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Progress;