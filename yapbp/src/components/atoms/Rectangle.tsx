import React from "react";
import { ShapeSize } from '@/types/shape';

interface RectangleProps {
  className?: string;
  children?: React.ReactNode;
  size?: ShapeSize;
  width?: number; // Custom width in pixels
  height?: number; // Custom height in pixels
}

// Size mappings for rectangle (landscape orientation, in pixels)
const sizeMap = {
  small: { width: 192, height: 80 },
  medium: { width: 240, height: 112 },
  large: { width: 288, height: 144 },
};

// Basic rectangle shape component
export const Rectangle: React.FC<RectangleProps> = ({
  className = "",
  children,
  size = 'medium',
  width,
  height,
}) => {
  // Use custom dimensions if provided, otherwise use size preset
  const dimensions = width && height
    ? { width, height }
    : sizeMap[size];

  return (
    <div
      className={className}
      style={{ width: `${dimensions.width}px`, height: `${dimensions.height}px` }}
    >
      {children}
    </div>
  );
};
