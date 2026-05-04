import { useEffect, useState } from 'react';
import Icon from '../components/Icon';
import Card, { CardHeader, CardTitle, CardContent } from '../components/Card';
import ProgressBar from '../components/ProgressBar';
import { analyticsService } from '../services/analyticsService';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

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
        {/* Progress Over Time Chart */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Progress Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              {progressHistory.length > 0 ? (
                <div className="h-64">
                  <Line
                    data={{
                      labels: progressHistory.slice(0, 7).map(entry =>
                        new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                      ),
                      datasets: [
                        {
                          label: 'Accuracy %',
                          data: progressHistory.slice(0, 7).map(entry => entry.accuracy),
                          borderColor: 'rgb(99, 102, 241)',
                          backgroundColor: 'rgba(99, 102, 241, 0.1)',
                          tension: 0.3,
                          fill: true,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          display: false,
                        },
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          max: 100,
                          ticks: {
                            callback: (value) => value + '%',
                          },
                        },
                      },
                    }}
                  />
                </div>
              ) : (
                <div className="text-center py-8">
                  <Icon name="chart" size={48} className="text-text-secondary mx-auto mb-4" />
                  <p className="text-text-secondary">Start practicing to see your progress</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Statistics Chart */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Performance Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <Bar
                  data={{
                    labels: ['Total Problems', 'Solved', 'Accuracy', 'Streak'],
                    datasets: [
                      {
                        label: 'Statistics',
                        data: [
                          overallStats.totalProblems || 0,
                          overallStats.solved || 0,
                          overallStats.accuracy || 0,
                          overallStats.streak || 0,
                        ],
                        backgroundColor: [
                          'rgba(99, 102, 241, 0.7)',
                          'rgba(34, 197, 94, 0.7)',
                          'rgba(249, 115, 22, 0.7)',
                          'rgba(236, 72, 153, 0.7)',
                        ],
                        borderColor: [
                          'rgb(99, 102, 241)',
                          'rgb(34, 197, 94)',
                          'rgb(249, 115, 22)',
                          'rgb(236, 72, 153)',
                        ],
                        borderWidth: 1,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false,
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                      },
                    },
                  }}
                />
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