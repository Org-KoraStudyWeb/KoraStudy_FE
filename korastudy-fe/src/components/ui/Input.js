import React from 'react';
import './Input.css';

export const Input = ({ 
  className = '', 
  type = 'text', 
  placeholder = '',
  ...props 
}) => {
  return (
    <input 
      type={type}
      className={`input ${className}`}
      placeholder={placeholder}
      {...props}
    />
  );
};