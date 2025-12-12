import React from 'react';
import { ShapeSize } from '@/types/shape';

interface CircleProps {
  className?: string;
  children?: React.ReactNode;
  size?: ShapeSize;
  width?: number; // Custom width in pixels
  height?: number; // Custom height in pixels
}

// Size mappings for circle (in pixels)
const sizeMap = {
  small: { width: 96, height: 96 },
  medium: { width: 128, height: 128 },
  large: { width: 160, height: 160 },
};

// Basic circle shape component
export const Circle: React.FC<CircleProps> = ({
  className = '',
  children,
  size = 'medium',
  width,
  height
}) => {
  // Use custom dimensions if provided, otherwise use size preset
  const dimensions = width && height
    ? { width, height }
    : sizeMap[size];

  return (
    <div
      className={`rounded-full ${className}`}
      style={{ width: `${dimensions.width}px`, height: `${dimensions.height}px` }}
    >
      {children}
    </div>
  );
};
