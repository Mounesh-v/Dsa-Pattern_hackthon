import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });

    // Log error to error reporting service
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4">
          <div className="card p-8 max-w-lg w-full text-center">
            <div className="text-6xl mb-4">😕</div>
            <h1 className="font-display font-bold text-3xl text-text-primary mb-4">Oops! Something went wrong</h1>
            <p className="text-text-secondary mb-6">
              We encountered an unexpected error. Don't worry, your progress is safe!
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="bg-background p-4 rounded-lg mb-6 text-left border border-border">
                <div className="text-sm text-red-600 font-mono mb-2">
                  {this.state.error.toString()}
                </div>
                {this.state.errorInfo && (
                  <div className="text-xs text-text-secondary font-mono">
                    {this.state.errorInfo.componentStack}
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-4 justify-center">
              <button
                onClick={this.handleReset}
                className="btn-primary"
              >
                Try Again
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="btn-secondary"
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
