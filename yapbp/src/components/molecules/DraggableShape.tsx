"use client";

import React, { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Square } from "../atoms/Square";
import { Rectangle } from "../atoms/Rectangle";
import { Circle } from "../atoms/Circle";
import { ShapeContent } from "./ShapeContent";
import { ResizableShape } from "./ResizableShape";
import { ShapeEditOverlay } from "./ShapeEditOverlay";
import { ShapeData } from "@/types/shape";
import { AnimatePresence } from "framer-motion";

interface DraggableShapeProps {
  shape: ShapeData;
  onContentEdit: (id: string) => void;
  onResize: (id: string, width: number, height: number) => void;
  onQuickEdit?: (id: string, field: 'title' | 'subText' | 'imageUrl') => void;
}

// Draggable wrapper using @dnd-kit for sortable grid functionality
export const DraggableShape: React.FC<DraggableShapeProps> = ({
  shape,
  onContentEdit,
  onResize,
  onQuickEdit,
}) => {
  const [isResizing, setIsResizing] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: shape.id,
    disabled: isResizing, // Disable dragging while resizing
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  // Get dimensions for the shape
  const getDimensions = () => {
    // If custom dimensions are set, use those
    if (shape.width && shape.height) {
      return { width: shape.width, height: shape.height };
    }

    // Otherwise use preset sizes
    const size = shape.size || 'medium';
    const sizeMap = {
      small: {
        square: { width: 96, height: 96 },
        rectangle: { width: 192, height: 80 },
        circle: { width: 96, height: 96 },
      },
      medium: {
        square: { width: 128, height: 128 },
        rectangle: { width: 240, height: 112 },
        circle: { width: 128, height: 128 },
      },
      large: {
        square: { width: 160, height: 160 },
        rectangle: { width: 288, height: 144 },
        circle: { width: 160, height: 160 },
      },
    };

    return sizeMap[size][shape.type];
  };

  // Render the appropriate shape based on type
  const renderShape = () => {
    const baseClasses = `
      bg-white border border-gray-200 shadow-sm overflow-hidden w-full h-full
      ${isDragging ? "cursor-grabbing scale-105 shadow-xl" : "cursor-grab"}
      hover:border-blue-400 hover:shadow-md transition-all duration-200
    `;

    const content = <ShapeContent content={shape.content} />;
    const { width, height } = getDimensions();

    switch (shape.type) {
      case "rectangle":
        return <Rectangle className={baseClasses} width={width} height={height}>{content}</Rectangle>;
      case "square":
        return <Square className={baseClasses} width={width} height={height}>{content}</Square>;
      case "circle":
        return <Circle className={baseClasses} width={width} height={height}>{content}</Circle>;
      default:
        return null;
    }
  };

  const handleResize = (width: number, height: number) => {
    onResize(shape.id, width, height);
  };

  const handleResizingChange = (resizing: boolean) => {
    setIsResizing(resizing);
  };

  const { width, height } = getDimensions();

  // Only apply drag listeners when not resizing
  const dragListeners = isResizing ? {} : listeners;

  const handleQuickEdit = (field: 'title' | 'subText' | 'imageUrl') => {
    if (onQuickEdit) {
      onQuickEdit(shape.id, field);
    } else {
      onContentEdit(shape.id);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {/* Main Shape */}
      <div
        ref={setNodeRef}
        style={{
          ...style,
          flexShrink: 0, // Prevent shrinking
          flexGrow: 0, // Prevent growing
          width: `${width}px`, // Explicitly set width
          height: `${height}px`, // Explicitly set height
        }}
        className="touch-none"
      >
        <ResizableShape
          width={width}
          height={height}
          onResize={handleResize}
          onResizingChange={handleResizingChange}
          isCircle={shape.type === 'circle'}
        >
          <div
            {...attributes}
            {...dragListeners}
            onMouseEnter={() => !isResizing && setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            className="w-full h-full relative"
          >
            {renderShape()}

            {/* Edit overlay on hover */}
            <AnimatePresence>
              {isHovering && !isResizing && !isDragging && (
                <ShapeEditOverlay
                  onEditTitle={() => handleQuickEdit('title')}
                  onEditSubText={() => handleQuickEdit('subText')}
                  onEditImage={() => handleQuickEdit('imageUrl')}
                  hasImage={!!shape.content.imageUrl}
                />
              )}
            </AnimatePresence>
          </div>
        </ResizableShape>
      </div>

      {/* Image Display Below Shape */}
      {shape.content.imageUrl && (
        <div
          style={{ width: `${width}px` }}
          className="relative h-32 rounded-lg overflow-hidden border border-gray-200 shadow-sm"
        >
          <img
            src={shape.content.imageUrl}
            alt={shape.content.title || 'Shape image'}
            className="w-full h-full object-cover"
          />
        </div>
      )}
    </div>
  );
};
