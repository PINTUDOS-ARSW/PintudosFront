import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

function Button({ children, className = '', onClick }: ButtonProps) {
  return (
    <button
      className={`px-4 py-2 rounded bg-black text-white ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default Button;