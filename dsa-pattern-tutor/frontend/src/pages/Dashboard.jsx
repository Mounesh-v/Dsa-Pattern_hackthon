import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Icon from '../components/Icon';
import Card, { CardHeader, CardTitle, CardContent, CardFooter } from '../components/Card';
import ProgressBar from '../components/ProgressBar';
import { analyticsService } from '../services/analyticsService';

const Dashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const data = await analyticsService.getDashboard();
      setDashboardData(data.data);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-accent/20 border-t-accent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const stats = dashboardData?.overallStats || {};
  const weakPatterns = dashboardData?.weakPatterns || [];
  const recentAttempts = dashboardData?.recentAttempts || [];

  // Get the most confused pattern pair
  const confusionPair = weakPatterns.length > 0 ? weakPatterns[0] : null;

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Functional Hero */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <h1 className="font-display font-bold text-2xl text-text-primary">
            Welcome back, {user?.name?.split(' ')[0] || 'Learner'}
          </h1>
        </div>

        {/* Context-aware insight */}
        {confusionPair && (
          <div className="flex items-start gap-3 p-4 bg-accent/5 border border-accent/20 rounded-lg">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10 text-accent flex-shrink-0">
              <Icon name="alert" size={16} />
            </div>
            <div className="flex-1">
              <p className="text-sm text-text-primary">
                <span className="font-medium">You're improving!</span> But still mixing{' '}
                <span className="font-mono text-accent">
                  {confusionPair.pattern.replace(/([A-Z])/g, ' $1').trim()}
                </span>{' '}
                with other patterns. Focus on this area today.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <div className="text-text-secondary text-sm mb-2">Problems Solved</div>
          <div className="text-3xl font-display font-bold text-text-primary">
            {stats.totalAttempts || 0}
          </div>
        </Card>
        <Card>
          <div className="text-text-secondary text-sm mb-2">Accuracy</div>
          <div className="text-3xl font-display font-bold text-accent">
            {stats.overallAccuracy?.toFixed(1) || 0}%
          </div>
        </Card>
        <Card>
          <div className="text-text-secondary text-sm mb-2">Best Streak</div>
          <div className="text-3xl font-display font-bold text-text-primary">
            {stats.bestStreak || 0}
          </div>
        </Card>
        <Card>
          <div className="text-text-secondary text-sm mb-2">Avg Time</div>
          <div className="text-3xl font-display font-bold text-text-primary">
            {stats.avgTime?.toFixed(1) || 0}s
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Continue Learning */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Continue Learning</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentAttempts.slice(0, 3).map((attempt) => (
                  <Link
                    key={attempt._id}
                    to="/practice"
                    className="flex items-center gap-4 p-4 bg-background rounded-lg hover:bg-accent/5 transition-colors"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-accent">
                      <Icon name={attempt.isCorrect ? 'check' : 'x'} size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-text-primary truncate">
                        {attempt.problemId?.title}
                      </div>
                      <div className="text-xs text-text-secondary">
                        {attempt.problemId?.difficulty} • {attempt.timeTaken}s
                      </div>
                    </div>
                    <Icon name="arrowRight" size={16} className="text-text-secondary" />
                  </Link>
                ))}

                {recentAttempts.length === 0 && (
                  <div className="text-center py-8">
                    <Icon name="target" size={48} className="text-text-secondary mx-auto mb-4" />
                    <p className="text-text-secondary mb-4">Start your first practice session</p>
                    <Link to="/practice" className="btn-primary inline-block">
                      Start Practice
                    </Link>
                  </div>
                )}
              </div>
            </CardContent>
            {recentAttempts.length > 0 && (
              <CardFooter>
                <Link to="/practice" className="btn-primary w-full">
                  Continue Practice
                </Link>
              </CardFooter>
            )}
          </Card>
        </div>

        {/* Weak Patterns */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Weak Patterns</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {weakPatterns.slice(0, 5).map((wp, index) => (
                  <div key={index} className="p-3 bg-background rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium font-mono text-sm text-text-primary capitalize">
                        {wp.pattern.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <span className="text-xs text-text-secondary">{wp.attempts} attempts</span>
                    </div>
                    <ProgressBar value={wp.accuracy} max={100} size="sm" color="danger" />
                  </div>
                ))}

                {weakPatterns.length === 0 && (
                  <div className="text-center py-8">
                    <Icon name="check" size={48} className="text-green-500 mx-auto mb-4" />
                    <p className="text-text-secondary">No weak patterns detected!</p>
                  </div>
                )}
              </div>
            </CardContent>
            {weakPatterns.length > 0 && (
              <CardFooter>
                <Link to="/weakness" className="btn-secondary w-full">
                  View Full Report
                </Link>
              </CardFooter>
            )}
          </Card>
        </div>
      </div>

      {/* Recommended Next */}
      {weakPatterns.length > 0 && (
        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Recommended Next</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <Icon name="target" size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="font-display font-semibold text-lg text-text-primary mb-2">
                    Focus on {weakPatterns[0].pattern.replace(/([A-Z])/g, ' $1').trim()}
                  </h3>
                  <p className="text-text-secondary text-sm mb-4">
                    Based on your recent performance, we recommend practicing more problems with this pattern to improve your accuracy.
                  </p>
                  <Link to="/patterns" className="btn-primary inline-block">
                    Start Practice
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Dashboard;