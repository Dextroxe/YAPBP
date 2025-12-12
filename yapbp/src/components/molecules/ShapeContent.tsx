import React, { useEffect, useRef, useState } from 'react';
import { ShapeContent as ShapeContentType } from '@/types/shape';

interface ShapeContentProps {
  content: ShapeContentType;
  onTitleClick?: () => void;
  onDescriptionClick?: () => void;
}

// Title and description display - top-left aligned, directly clickable for editing
// Image is shown separately below the shape
export const ShapeContent: React.FC<ShapeContentProps> = ({
  content,
  onTitleClick,
  onDescriptionClick
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        const height = containerRef.current.offsetHeight;
        const minDimension = Math.min(width, height);

        // Scale factor based on container size (base size is 128px)
        const newScale = Math.max(0.5, Math.min(2, minDimension / 128));
        setScale(newScale);
      }
    };

    updateScale();

    // Use ResizeObserver for responsive scaling
    const resizeObserver = new ResizeObserver(updateScale);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="flex flex-col h-full justify-start items-start overflow-hidden"
      style={{ padding: `${Math.max(8, 12 * scale)}px` }}
    >
      {content.title && (
        <h3
          onClick={(e) => {
            e.stopPropagation();
            onTitleClick?.();
          }}
          className="font-bold text-left leading-tight w-full mb-1 cursor-text hover:text-blue-600 transition-colors"
          style={{
            fontSize: `${Math.max(12, 16 * scale)}px`,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
          }}
          title="Click to edit title"
        >
          {content.title}
        </h3>
      )}
      {content.subText && (
        <p
          onClick={(e) => {
            e.stopPropagation();
            onDescriptionClick?.();
          }}
          className="text-gray-600 text-left leading-snug w-full cursor-text hover:text-blue-600 transition-colors"
          style={{
            fontSize: `${Math.max(10, 13 * scale)}px`,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 4,
            WebkitBoxOrient: 'vertical',
          }}
          title="Click to edit description"
        >
          {content.subText}
        </p>
      )}
    </div>
  );
};
