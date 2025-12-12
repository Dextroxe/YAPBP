import React from 'react';

interface TitleProps {
  text: string;
  className?: string;
}

// Title text component for shape content
export const Title: React.FC<TitleProps> = ({ text, className = '' }) => {
  return (
    <h3 className={`font-bold text-lg ${className}`}>
      {text}
    </h3>
  );
};
