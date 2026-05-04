import { useEffect, useState } from 'react';
import Icon from '../components/Icon';
import Card, { CardHeader, CardTitle, CardContent, CardFooter } from '../components/Card';
import ProgressBar from '../components/ProgressBar';
import { analyticsService } from '../services/analyticsService';

const WeaknessReport = () => {
  const [weaknessData, setWeaknessData] = useState(null);
  const [confusionData, setConfusionData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [weakness, confusion] = await Promise.all([
        analyticsService.getWeakPatterns(),
        analyticsService.getConfusionMatrix(),
      ]);

      setWeaknessData(weakness);
      setConfusionData(confusion);
    } catch (error) {
      console.error('Failed to load weakness data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-accent/20 border-t-accent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading weakness report...</p>
        </div>
      </div>
    );
  }

  const weakPatterns = weaknessData?.weakPatterns || [];
  const confusionPairs = confusionData?.commonMistakes || [];

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display font-bold text-3xl text-text-primary mb-2">
          Weakness Report
        </h1>
        <p className="text-text-secondary">
          Identify patterns that need more practice and common confusions
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Pattern Accuracy */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Pattern Accuracy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {weakPatterns.slice(0, 8).map((wp, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium font-mono text-sm text-text-primary capitalize">
                        {wp.pattern.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <span className="text-sm text-text-secondary">{wp.accuracy.toFixed(1)}%</span>
                    </div>
                    <ProgressBar
                      value={wp.accuracy}
                      max={100}
                      size="sm"
                      color={wp.accuracy < 50 ? 'danger' : wp.accuracy < 70 ? 'warning' : 'accent'}
                    />
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
          </Card>
        </div>

        {/* Confusion Pairs */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Common Confusions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {confusionPairs.slice(0, 6).map((pair, index) => (
                  <div key={index} className="p-4 bg-background rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="text-sm text-text-primary mb-1">
                          Confused{' '}
                          <span className="font-mono text-red-500">
                            {pair.selectedPattern.replace(/([A-Z])/g, ' $1').trim()}
                          </span>{' '}
                          with{' '}
                          <span className="font-mono text-green-500">
                            {pair.correctPattern.replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-display font-bold text-accent">
                          {pair.count}x
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-text-secondary">
                      <Icon name="alert" size={12} />
                      <span>Focus on distinguishing these patterns</span>
                    </div>
                  </div>
                ))}

                {confusionPairs.length === 0 && (
                  <div className="text-center py-8">
                    <Icon name="check" size={48} className="text-green-500 mx-auto mb-4" />
                    <p className="text-text-secondary">No pattern confusions detected!</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recommendations */}
      {weakPatterns.length > 0 && (
        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Recommended Practice</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                {weakPatterns.slice(0, 3).map((wp, index) => (
                  <div key={index} className="p-4 bg-background rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                        <Icon name="target" size={20} className="text-accent" />
                      </div>
                      <div>
                        <h4 className="font-medium text-text-primary capitalize">
                          {wp.pattern.replace(/([A-Z])/g, ' $1').trim()}
                        </h4>
                        <p className="text-xs text-text-secondary">{wp.attempts} attempts</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-text-secondary">Accuracy</span>
                        <span className="font-medium text-text-primary">{wp.accuracy.toFixed(1)}%</span>
                      </div>
                      <ProgressBar value={wp.accuracy} max={100} size="sm" color="danger" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <button className="btn-primary w-full">
                Start Focused Practice
              </button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
};

export default WeaknessReport;