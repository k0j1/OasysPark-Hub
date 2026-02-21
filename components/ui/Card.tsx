import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', hover = false }) => {
  return (
    <div 
      className={`
        bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-xl p-5
        ${hover ? 'transition-all duration-300 hover:border-oasys-primary/50 hover:shadow-lg hover:shadow-cyan-900/20 group' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};
