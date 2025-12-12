"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";

interface ResizableShapeProps {
  width: number;
  height: number;
  onResize: (width: number, height: number) => void;
  children: React.ReactNode;
  isCircle?: boolean;
  onResizingChange?: (isResizing: boolean) => void;
}

export const ResizableShape: React.FC<ResizableShapeProps> = ({
  width,
  height,
  onResize,
  children,
  isCircle = false,
  onResizingChange,
}) => {
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState<string>("");
  const [localWidth, setLocalWidth] = useState(width);
  const [localHeight, setLocalHeight] = useState(height);
  const containerRef = useRef<HTMLDivElement>(null);
  const startPosRef = useRef({ x: 0, y: 0, width: 0, height: 0 });
  const rafRef = useRef<number | null>(null);

  // Update local dimensions when props change (only when not resizing)
  useEffect(() => {
    if (!isResizing) {
      setLocalWidth(width);
      setLocalHeight(height);
    }
  }, [width, height, isResizing]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing || !resizeDirection) return;

    // Cancel any pending RAF
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
    }

    // Use requestAnimationFrame for smooth updates
    rafRef.current = requestAnimationFrame(() => {
      const deltaX = e.clientX - startPosRef.current.x;
      const deltaY = e.clientY - startPosRef.current.y;

      let newWidth = startPosRef.current.width;
      let newHeight = startPosRef.current.height;

      // Handle different resize directions
      if (resizeDirection.includes("e")) {
        newWidth = Math.max(50, startPosRef.current.width + deltaX);
      }
      if (resizeDirection.includes("w")) {
        newWidth = Math.max(50, startPosRef.current.width - deltaX);
      }
      if (resizeDirection.includes("s")) {
        newHeight = Math.max(50, startPosRef.current.height + deltaY);
      }
      if (resizeDirection.includes("n")) {
        newHeight = Math.max(50, startPosRef.current.height - deltaY);
      }

      // For circles, maintain aspect ratio
      if (isCircle) {
        const size = Math.max(newWidth, newHeight);
        newWidth = size;
        newHeight = size;
      }

      // Update local state immediately for smooth visual feedback
      setLocalWidth(Math.round(newWidth));
      setLocalHeight(Math.round(newHeight));
    });
  }, [isResizing, resizeDirection, isCircle]);

  const handleMouseUp = useCallback(() => {
    if (isResizing) {
      // Final update to parent
      onResize(localWidth, localHeight);
      setIsResizing(false);
      setResizeDirection("");
      onResizingChange?.(false);

      // Cancel any pending RAF
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    }
  }, [isResizing, localWidth, localHeight, onResize, onResizingChange]);

  useEffect(() => {
    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);

      // Cleanup RAF on unmount
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [isResizing, handleMouseMove, handleMouseUp]);

  const handleResizeStart = (direction: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsResizing(true);
    setResizeDirection(direction);
    onResizingChange?.(true);

    startPosRef.current = {
      x: e.clientX,
      y: e.clientY,
      width: localWidth,
      height: localHeight,
    };
  };

  return (
    <div
      ref={containerRef}
      className="relative group"
      style={{
        width: `${localWidth}px`,
        height: `${localHeight}px`,
        transition: isResizing ? 'none' : 'width 0.1s ease-out, height 0.1s ease-out',
        willChange: isResizing ? 'width, height' : 'auto',
      }}
    >
      {children}

      {/* Resize handles - only show on hover */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none ${isResizing ? '!opacity-100' : ''}`}>
        {/* Corner handles */}
        {!isCircle && (
          <>
            {/* Top-left */}
            <div
              onMouseDown={handleResizeStart("nw")}
              className="absolute -top-1.5 -left-1.5 w-3.5 h-3.5 bg-blue-500 border-2 border-white rounded-full cursor-nw-resize pointer-events-auto hover:scale-125 transition-transform shadow-md"
            />
            {/* Top-right */}
            <div
              onMouseDown={handleResizeStart("ne")}
              className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-blue-500 border-2 border-white rounded-full cursor-ne-resize pointer-events-auto hover:scale-125 transition-transform shadow-md"
            />
            {/* Bottom-left */}
            <div
              onMouseDown={handleResizeStart("sw")}
              className="absolute -bottom-1.5 -left-1.5 w-3.5 h-3.5 bg-blue-500 border-2 border-white rounded-full cursor-sw-resize pointer-events-auto hover:scale-125 transition-transform shadow-md"
            />
            {/* Bottom-right */}
            <div
              onMouseDown={handleResizeStart("se")}
              className="absolute -bottom-1.5 -right-1.5 w-3.5 h-3.5 bg-blue-500 border-2 border-white rounded-full cursor-se-resize pointer-events-auto hover:scale-125 transition-transform shadow-md"
            />
          </>
        )}

        {/* Edge handles */}
        {/* Top */}
        <div
          onMouseDown={handleResizeStart("n")}
          className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-2.5 bg-blue-500 border-2 border-white rounded-full cursor-n-resize pointer-events-auto hover:scale-110 transition-transform shadow-md"
        />
        {/* Right */}
        <div
          onMouseDown={handleResizeStart("e")}
          className="absolute top-1/2 -right-1 -translate-y-1/2 w-2.5 h-8 bg-blue-500 border-2 border-white rounded-full cursor-e-resize pointer-events-auto hover:scale-110 transition-transform shadow-md"
        />
        {/* Bottom */}
        <div
          onMouseDown={handleResizeStart("s")}
          className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-2.5 bg-blue-500 border-2 border-white rounded-full cursor-s-resize pointer-events-auto hover:scale-110 transition-transform shadow-md"
        />
        {/* Left */}
        <div
          onMouseDown={handleResizeStart("w")}
          className="absolute top-1/2 -left-1 -translate-y-1/2 w-2.5 h-8 bg-blue-500 border-2 border-white rounded-full cursor-w-resize pointer-events-auto hover:scale-110 transition-transform shadow-md"
        />
      </div>

      {/* Resizing indicator */}
      {isResizing && (
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap pointer-events-none">
          {localWidth} × {localHeight}
        </div>
      )}
    </div>
  );
};
