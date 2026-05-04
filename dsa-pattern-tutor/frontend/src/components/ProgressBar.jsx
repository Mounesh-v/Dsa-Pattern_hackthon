const ProgressBar = ({
  value = 0,
  max = 100,
  size = 'md',
  color = 'accent',
  showLabel = false,
  className = '',
  ...props
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const sizeStyles = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  };

  const colorStyles = {
    accent: 'bg-accent',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    danger: 'bg-red-500',
  };

  return (
    <div className={`w-full ${className}`} {...props}>
      {showLabel && (
        <div className="flex justify-between text-sm mb-1">
          <span className="text-text-secondary">Progress</span>
          <span className="font-medium text-text-primary">{percentage.toFixed(0)}%</span>
        </div>
      )}
      <div className={`w-full bg-background rounded-full overflow-hidden ${sizeStyles[size]}`}>
        <div
          className={`h-full transition-all duration-500 ease-out ${colorStyles[color]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;