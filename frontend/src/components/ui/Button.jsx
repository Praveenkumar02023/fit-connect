import React from 'react';

const Button = ({
  children,
  onClick,
  variant = 'default',
  size = 'md',
  disabled = false,
  className = '',
}) => {
  let variantClasses = '';
  if (variant === 'default') {
    variantClasses = 'bg-blue-600 text-white hover:bg-blue-700';
  } else if (variant === 'outline') {
    variantClasses = 'border border-blue-600 text-blue-600 hover:bg-blue-50';
  } else if (variant === 'ghost') {
    variantClasses = 'text-blue-600 hover:bg-blue-100';
  } else if (variant === 'destructive') {
    variantClasses = 'bg-red-600 text-white hover:bg-red-700';
  }

  let sizeClasses = '';
  if (size === 'sm') {
    sizeClasses = 'px-3 py-1 text-sm';
  } else if (size === 'md') {
    sizeClasses = 'px-4 py-2 text-base';
  } else if (size === 'lg') {
    sizeClasses = 'px-6 py-3 text-lg';
  }

  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';

  const allClasses = `rounded-xl font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 ${variantClasses} ${sizeClasses} ${disabledClasses} ${className}`;

  return (
    <button
      className={allClasses}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
