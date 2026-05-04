import { Link } from 'react-router-dom';
import Icon from './Icon';
import ProgressBar from './ProgressBar';

const PatternCard = ({ pattern }) => {
  return (
    <Link
      to={`/patterns/${pattern.id}`}
      className="card card-hover block"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
            <Icon name="grid" size={20} className="text-accent" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-text-primary">
              {pattern.name}
            </h3>
            <p className="text-xs text-text-secondary capitalize">
              {pattern.difficulty}
            </p>
          </div>
        </div>
        <Icon name="arrowRight" size={16} className="text-text-secondary" />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-text-secondary">Mastery</span>
          <span className="font-medium text-text-primary">{pattern.mastery}%</span>
        </div>
        <ProgressBar value={pattern.mastery} max={100} size="sm" color="accent" />
      </div>

      {pattern.problemsSolved > 0 && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-secondary">Problems solved</span>
            <span className="font-medium text-text-primary">{pattern.problemsSolved}</span>
          </div>
        </div>
      )}
    </Link>
  );
};

export default PatternCard;