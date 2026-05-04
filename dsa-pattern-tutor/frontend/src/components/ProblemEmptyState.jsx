import { Link } from 'react-router-dom';
import Icon from './Icon';

const ProblemEmptyState = ({ message = 'No questions are available yet.', onRetry }) => {
  return (
    <div className="container mx-auto px-4 sm:px-6 py-16">
      <div className="card mx-auto max-w-xl p-8 text-center animate-slide-up">
        <div className="mb-4 text-4xl text-primary">
          <Icon name="alert" size={48} />
        </div>
        <h1 className="font-display font-bold mb-3 text-2xl text-text-primary">No Questions Found</h1>
        <p className="mb-6 text-text-secondary">{message}</p>
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <button onClick={onRetry} className="btn-primary">
            Try Again
          </button>
          <Link to="/dashboard" className="btn-secondary text-center">
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProblemEmptyState;