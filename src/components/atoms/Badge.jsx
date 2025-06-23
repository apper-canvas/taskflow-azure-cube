const Badge = ({ 
  children, 
  variant = 'default', 
  size = 'medium',
  color,
  className = '' 
}) => {
  const baseClasses = 'inline-flex items-center font-medium rounded-full';
  
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-primary/10 text-primary',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800'
  };

  const sizes = {
    small: 'px-2 py-0.5 text-xs',
    medium: 'px-2.5 py-1 text-xs',
    large: 'px-3 py-1.5 text-sm'
  };

  let badgeClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;
  
  const style = color ? { backgroundColor: `${color}20`, color: color } : {};

  return (
    <span className={badgeClasses} style={style}>
      {children}
    </span>
  );
};

export default Badge;