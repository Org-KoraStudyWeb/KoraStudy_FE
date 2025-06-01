import React from 'react';
import './Checkbox.css';

export const Checkbox = ({ 
  id, 
  className = '', 
  checked, 
  onChange,
  ...props 
}) => {
  return (
    <input 
      type="checkbox"
      id={id}
      className={`checkbox ${className}`}
      checked={checked}
      onChange={onChange}
      {...props}
    />
  );
};