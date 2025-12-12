import React from 'react';

interface SubTextProps {
  text: string;
  className?: string;
}

// Subtitle or description text component
export const SubText: React.FC<SubTextProps> = ({ text, className = '' }) => {
  return (
    <p className={`text-sm text-gray-600 ${className}`}>
      {text}
    </p>
  );
};
