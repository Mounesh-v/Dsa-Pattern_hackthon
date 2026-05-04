import { useParams, Link } from 'react-router-dom';
import Icon from '../components/Icon';
import Card, { CardHeader, CardTitle, CardContent, CardFooter } from '../components/Card';
import ProgressBar from '../components/ProgressBar';

const PatternDetail = () => {
  const { id } = useParams();

  // Mock data - in production, this would come from an API
  const patternData = {
    slidingWindow: {
      name: 'Sliding Window',
      difficulty: 'Medium',
      mastery: 65,
      description: 'A technique that involves maintaining a window of elements in an array/string and sliding it across to solve problems efficiently.',
      whenToUse: [
        'When you need to find a subarray or substring with certain properties',
        'When you need to compute something over all contiguous subarrays of a given size',
        'When you need to find the longest/shortest subarray satisfying a condition',
      ],
      commonMistakes: [
        'Not handling edge cases when window size is smaller than array',
        'Forgetting to update the window correctly when sliding',
        'Not considering the order of operations when updating window bounds',
      ],
      examples: [
        {
          title: 'Maximum Sum Subarray of Size K',
          description: 'Find the maximum sum of any contiguous subarray of size K.',
          difficulty: 'Easy',
        },
        {
          title: 'Longest Substring Without Repeating Characters',
          description: 'Find the length of the longest substring without repeating characters.',
          difficulty: 'Medium',
        },
        {
          title: 'Minimum Window Substring',
          description: 'Find the minimum window in a string that contains all characters of another string.',
          difficulty: 'Hard',
        },
      ],
    },
  };

  const pattern = patternData[id] || patternData.slidingWindow;

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link to="/patterns" className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary mb-4">
          <Icon name="arrowLeft" size={16} />
          Back to Patterns
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-display font-bold text-3xl text-text-primary mb-2">
              {pattern.name}
            </h1>
            <div className="flex items-center gap-4">
              <span className="px-3 py-1 rounded-full text-sm capitalize bg-accent/10 text-accent border border-accent/20">
                {pattern.difficulty}
              </span>
              <span className="text-text-secondary text-sm">
                {pattern.mastery}% mastery
              </span>
            </div>
          </div>
          <Link to="/practice" className="btn-primary">
            <Icon name="play" size={16} className="mr-2" />
            Try Now
          </Link>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left - Concept */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Concept</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-text-secondary leading-relaxed">
                {pattern.description}
              </p>
            </CardContent>
          </Card>

          {/* When to Use */}
          <Card>
            <CardHeader>
              <CardTitle>When to Use</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {pattern.whenToUse.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Icon name="check" size={16} className="text-accent mt-0.5 flex-shrink-0" />
                    <span className="text-text-secondary">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Common Mistakes */}
          <Card>
            <CardHeader>
              <CardTitle>Common Mistakes</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {pattern.commonMistakes.map((mistake, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Icon name="alert" size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
                    <span className="text-text-secondary">{mistake}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Right - Examples */}
        <div className="space-y-6">
          {/* Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Your Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-text-secondary">Mastery</span>
                    <span className="text-sm font-medium text-text-primary">{pattern.mastery}%</span>
                  </div>
                  <ProgressBar value={pattern.mastery} max={100} size="md" color="accent" />
                </div>
                <div className="pt-4 border-t border-border">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-secondary">Problems solved</span>
                    <span className="font-medium text-text-primary">12</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Example Problems */}
          <Card>
            <CardHeader>
              <CardTitle>Example Problems</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pattern.examples.map((example, index) => (
                  <Link
                    key={index}
                    to="/practice"
                    className="block p-4 bg-background rounded-lg hover:bg-accent/5 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-text-primary">{example.title}</h4>
                      <span className="px-2 py-0.5 rounded text-xs capitalize bg-accent/10 text-accent">
                        {example.difficulty}
                      </span>
                    </div>
                    <p className="text-sm text-text-secondary line-clamp-2">
                      {example.description}
                    </p>
                  </Link>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Link to="/practice" className="btn-primary w-full">
                Start Practice
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PatternDetail;