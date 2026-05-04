import { useEffect, useState } from 'react';
import { analyticsService } from '../services/analyticsService';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const Analytics = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [confusionMatrix, setConfusionMatrix] = useState(null);
  const [weakPatterns, setWeakPatterns] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const [dashboard, confusion, weak, prog] = await Promise.all([
        analyticsService.getDashboard(),
        analyticsService.getConfusionMatrix(),
        analyticsService.getWeakPatterns(),
        analyticsService.getProgress(),
      ]);

      setDashboardData(dashboard.data);
      setConfusionMatrix(confusion);
      setWeakPatterns(weak);
      setProgress(prog);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading analytics...</p>
        </div>
      </div>
    );
  }

  const patternAccuracy = dashboardData?.patternAccuracy || [];
  const overallStats = dashboardData?.overallStats || {};

  // Prepare data for charts
  const accuracyChartData = patternAccuracy.map((pa) => ({
    pattern: pa.pattern
      .replace(/([A-Z])/g, ' $1')
      .trim()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' '),
    accuracy: pa.accuracy,
    attempts: pa.attempts,
  }));

  const radarChartData = patternAccuracy.slice(0, 8).map((pa) => ({
    pattern: pa.pattern
      .replace(/([A-Z])/g, ' $1')
      .trim()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' '),
    accuracy: pa.accuracy,
  }));

  const progressChartData = progress?.progressHistory || [];

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Overview Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="card p-6">
          <div className="text-text-secondary text-sm mb-2">Total Attempts</div>
          <div className="text-3xl font-display font-bold text-text-primary">
            {overallStats.totalAttempts || 0}
          </div>
        </div>
        <div className="card p-6">
          <div className="text-text-secondary text-sm mb-2">Overall Accuracy</div>
          <div className="text-3xl font-display font-bold text-text-primary">
            {overallStats.overallAccuracy?.toFixed(1) || 0}%
          </div>
        </div>
        <div className="card p-6">
          <div className="text-text-secondary text-sm mb-2">Best Streak</div>
          <div className="text-3xl font-display font-bold text-text-primary">
            {overallStats.bestStreak || 0}
          </div>
        </div>
        <div className="card p-6">
          <div className="text-text-secondary text-sm mb-2">Avg Time</div>
          <div className="text-3xl font-display font-bold text-text-primary">
            {overallStats.avgTime?.toFixed(1) || 0}s
          </div>
        </div>
      </div>

        {/* Pattern Accuracy Chart */}
        <div className="card p-6 mb-8 animate-slide-up stagger-4">
          <h2 className="font-display font-semibold text-2xl text-text-primary mb-4">
            Pattern Accuracy
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={accuracyChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#D4E6F1" />
                <XAxis
                  dataKey="pattern"
                  stroke="#4A6580"
                  angle={-45}
                  textAnchor="end"
                  height={100}
                />
                <YAxis stroke="#4A6580" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #D4E6F1',
                    borderRadius: '8px',
                    color: '#0D1B2A',
                  }}
                />
                <Bar dataKey="accuracy" fill="#00ABE4" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Radar Chart */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="card p-6">
            <h2 className="font-display font-semibold text-2xl text-text-primary mb-4">
              Pattern Strengths
            </h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarChartData}>
                  <PolarGrid stroke="#D4E6F1" />
                  <PolarAngleAxis dataKey="pattern" stroke="#4A6580" />
                  <PolarRadiusAxis stroke="#4A6580" />
                  <Radar
                    name="Accuracy"
                    dataKey="accuracy"
                    stroke="#00ABE4"
                    fill="#00ABE4"
                    fillOpacity={0.3}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #D4E6F1',
                      borderRadius: '8px',
                      color: '#0D1B2A',
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Weak Patterns */}
          <div className="card p-6 animate-slide-up stagger-6">
            <h2 className="font-display font-semibold text-2xl text-text-primary mb-4">
              Areas to Improve
            </h2>
            <div className="space-y-4">
              {weakPatterns?.weakPatterns?.slice(0, 5).map((wp, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-lightBlue rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium font-mono text-sm text-text-primary capitalize">
                      {wp.pattern.replace(/([A-Z])/g, ' $1').trim()}
                    </div>
                    <div className="text-xs text-text-secondary">
                      {wp.attempts} attempts
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-display font-bold text-primary">
                      {wp.accuracy.toFixed(1)}%
                    </div>
                  </div>
                </div>
              ))}
              {(!weakPatterns?.weakPatterns || weakPatterns.weakPatterns.length === 0) && (
                <div className="text-text-secondary text-center py-8">
                  Complete more challenges to see weak patterns
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Progress Over Time */}
        <div className="card p-6 mb-8">
          <h2 className="font-display font-semibold text-2xl text-text-primary mb-4">
            Progress Over Time
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={progressChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#D4E6F1" />
                <XAxis
                  dataKey="date"
                  stroke="#4A6580"
                  tickFormatter={(value) => new Date(value).toLocaleDateString()}
                />
                <YAxis stroke="#4A6580" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #D4E6F1',
                    borderRadius: '8px',
                    color: '#0D1B2A',
                  }}
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                />
                <Line
                  type="monotone"
                  dataKey="accuracy"
                  stroke="#00ABE4"
                  strokeWidth={2}
                  dot={{ fill: '#00ABE4' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Confusion Matrix */}
        {confusionMatrix?.commonMistakes && confusionMatrix.commonMistakes.length > 0 && (
          <div className="card p-6 animate-slide-up">
            <h2 className="font-display font-semibold text-2xl text-text-primary mb-4">
              Common Mistakes
            </h2>
            <div className="space-y-3">
              {confusionMatrix.commonMistakes.slice(0, 10).map((mistake, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-lightBlue rounded-lg"
                >
                  <div className="flex-1">
                    <div className="font-medium text-text-primary">
                      Confused{' '}
                      <span className="text-red-600 font-mono text-sm capitalize">
                        {mistake.selectedPattern.replace(/([A-Z])/g, ' $1').trim()}
                      </span>{' '}
                      with{' '}
                      <span className="text-green-600 font-mono text-sm capitalize">
                        {mistake.correctPattern.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-display font-bold text-primary">
                      {mistake.count}x
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;