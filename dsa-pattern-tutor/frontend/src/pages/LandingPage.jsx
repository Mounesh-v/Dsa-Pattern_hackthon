import { Link } from 'react-router-dom';
import Icon from '../components/Icon';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center">
        <div className="container mx-auto px-6 py-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium">
                <Icon name="flame" size={16} />
                <span>Train your pattern recognition</span>
              </div>

              <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-text-primary leading-tight">
                Stop memorizing DSA.
                <br />
                <span className="text-accent">Start recognizing patterns.</span>
              </h1>

              <p className="text-lg text-text-secondary max-w-xl">
                Train your brain to identify patterns behind problems — not just solve them.
                Build intuition that lasts beyond the interview.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/register"
                  className="btn-primary text-center px-8 py-4 text-base font-semibold"
                >
                  Start Training
                </Link>
                <Link
                  to="/patterns"
                  className="btn-secondary text-center px-8 py-4 text-base font-semibold"
                >
                  Explore Patterns
                </Link>
              </div>

              {/* Social Proof */}
              <div className="flex items-center gap-6 pt-8 border-t">
                <div>
                  <div className="text-2xl font-display font-bold text-text-primary">10K+</div>
                  <div className="text-sm text-text-secondary">Active learners</div>
                </div>
                <div>
                  <div className="text-2xl font-display font-bold text-text-primary">50K+</div>
                  <div className="text-sm text-text-secondary">Problems solved</div>
                </div>
                <div>
                  <div className="text-2xl font-display font-bold text-text-primary">95%</div>
                  <div className="text-sm text-text-secondary">Success rate</div>
                </div>
              </div>
            </div>

            {/* Right - Product Preview */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-transparent rounded-2xl blur-3xl" />
              <div className="relative bg-card border rounded-2xl p-6 shadow-2xl">
                {/* Mini Dashboard Preview */}
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-accent flex items-center justify-center">
                        <Icon name="code" size={16} className="text-white" />
                      </div>
                      <span className="font-semibold text-text-primary">Dashboard</span>
                    </div>
                    <div className="flex gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                      <div className="h-2 w-2 rounded-full bg-yellow-500" />
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-background rounded-lg p-3">
                      <div className="text-xs text-text-secondary mb-1">Solved</div>
                      <div className="text-lg font-display font-bold text-text-primary">127</div>
                    </div>
                    <div className="bg-background rounded-lg p-3">
                      <div className="text-xs text-text-secondary mb-1">Accuracy</div>
                      <div className="text-lg font-display font-bold text-accent">78%</div>
                    </div>
                    <div className="bg-background rounded-lg p-3">
                      <div className="text-xs text-text-secondary mb-1">Streak</div>
                      <div className="text-lg font-display font-bold text-text-primary">12</div>
                    </div>
                  </div>

                  {/* Weakness Insight */}
                  <div className="bg-accent/5 border border-accent/20 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10 text-accent">
                        <Icon name="alert" size={16} />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-text-primary mb-1">
                          Pattern Confusion Detected
                        </div>
                        <div className="text-xs text-text-secondary">
                          You're mixing <span className="font-mono text-accent">Sliding Window</span> with <span className="font-mono text-accent">Two Pointer</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Pattern Cards */}
                  <div className="space-y-2">
                    <div className="text-xs font-medium text-text-secondary">Your Progress</div>
                    <div className="space-y-2">
                      {[
                        { name: 'Sliding Window', progress: 65 },
                        { name: 'Two Pointers', progress: 42 },
                        { name: 'Binary Search', progress: 89 },
                      ].map((pattern) => (
                        <div key={pattern.name} className="flex items-center gap-3">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-medium text-text-primary">{pattern.name}</span>
                              <span className="text-xs text-text-secondary">{pattern.progress}%</span>
                            </div>
                            <div className="h-1.5 bg-background rounded-full overflow-hidden">
                              <div
                                className="h-full bg-accent rounded-full transition-all"
                                style={{ width: `${pattern.progress}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-display font-bold text-3xl text-text-primary mb-4">
              Why Pattern Recognition Matters
            </h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              Most interview problems are variations of fundamental patterns. Master the patterns, solve any problem.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: 'brain',
                title: 'Pattern Recognition',
                description: 'Train your brain to identify the underlying pattern behind any problem.',
              },
              {
                icon: 'trendingUp',
                title: 'Adaptive Learning',
                description: 'Focus on your weak areas with personalized recommendations.',
              },
              {
                icon: 'shield',
                title: 'Interview Ready',
                description: 'Build confidence with real interview-style practice.',
              },
            ].map((feature) => (
              <div key={feature.title} className="card p-6">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <Icon name={feature.icon} size={24} className="text-accent" />
                </div>
                <h3 className="font-display font-semibold text-lg text-text-primary mb-2">
                  {feature.title}
                </h3>
                <p className="text-text-secondary text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-accent/5">
        <div className="container mx-auto px-6 text-center">
          <h2 className="font-display font-bold text-3xl text-text-primary mb-4">
            Ready to Transform Your DSA Skills?
          </h2>
          <p className="text-text-secondary mb-8 max-w-xl mx-auto">
            Join thousands of developers who have mastered pattern recognition and aced their interviews.
          </p>
          <Link
            to="/register"
            className="btn-primary inline-block px-8 py-4 text-base font-semibold"
          >
            Start Free Today
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-accent flex items-center justify-center">
                <Icon name="code" size={16} className="text-white" />
              </div>
              <span className="font-display font-bold text-text-primary">DSA Pattern Tutor</span>
            </div>
            <p className="text-sm text-text-secondary">
              © 2024 DSA Pattern Tutor. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;