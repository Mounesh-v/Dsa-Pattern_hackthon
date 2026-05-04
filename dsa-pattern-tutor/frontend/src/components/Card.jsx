const Card = ({
  children,
  className = '',
  hover = false,
  clickable = false,
  onClick,
  ...props
}) => {
  const baseClasses = 'card';
  const hoverClasses = hover ? 'card-hover cursor-pointer' : '';
  const clickableClasses = clickable ? 'cursor-pointer hover:bg-accent/5' : '';

  return (
    <div
      className={`${baseClasses} ${hoverClasses} ${clickableClasses} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '' }) => {
  return <div className={`mb-4 ${className}`}>{children}</div>;
};

export const CardTitle = ({ children, className = '' }) => {
  return <h3 className={`font-display font-semibold text-xl text-text-primary ${className}`}>{children}</h3>;
};

export const CardContent = ({ children, className = '' }) => {
  return <div className={className}>{children}</div>;
};

export const CardFooter = ({ children, className = '' }) => {
  return <div className={`mt-4 pt-4 border-t border-border ${className}`}>{children}</div>;
};

export default Card;