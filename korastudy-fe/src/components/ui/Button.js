import React from 'react';
import './Button.css';

export const Button = ({ 
  children, 
  className = '', 
  variant = 'default', 
  onClick, 
  type = 'button',
  ...props 
}) => {
  const baseClasses = 'button';
  const variantClasses = {
    default: 'button-default',
    outline: 'button-outline'
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`;

  return (
    <button 
      className={classes} 
      onClick={onClick} 
      type={type}
      {...props}
    >
      {children}
    </button>
  );
};