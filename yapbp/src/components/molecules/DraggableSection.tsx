"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import { SectionHeader } from "../atoms/SectionHeader";
import { DraggableShape } from "./DraggableShape";
import { SectionData, GapSize } from "@/types/section";
import { ShapeType } from "@/types/shape";
import { GripVertical } from "lucide-react";

interface DraggableSectionProps {
  section: SectionData;
  onTitleChange: (sectionId: string, newTitle: string) => void;
  onDelete: (sectionId: string) => void;
  onShapeContentEdit: (shapeId: string) => void;
  onAddShapeToSection: (sectionId: string, type: ShapeType) => void;
  isSelected?: boolean;
  onSelect: (sectionId: string) => void;
  onGapChange: (sectionId: string, gap: GapSize) => void;
  onShapeResize: (shapeId: string, width: number, height: number) => void;
  onQuickEdit?: (shapeId: string, field: 'title' | 'subText' | 'imageUrl') => void;
}

// Draggable section containing a grid of shapes
export const DraggableSection: React.FC<DraggableSectionProps> = ({
  section,
  onTitleChange,
  onDelete,
  onShapeContentEdit,
  onAddShapeToSection,
  isSelected = false,
  onSelect,
  onGapChange,
  onShapeResize,
  onQuickEdit,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={() => onSelect(section.id)}
      className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6 cursor-pointer transition-all ${
        isDragging ? "opacity-50 ring-2 ring-blue-400" : ""
      } ${
        isSelected ? "ring-2 ring-blue-400 border-blue-400 shadow-md" : "hover:shadow-md hover:border-gray-300"
      }`}
    >
      {/* Drag handle and header */}
      <div className="flex items-start gap-3 mb-4">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 transition-colors pt-1"
          title="Drag to reorder section"
        >
          <GripVertical size={24} />
        </div>
        <div className="flex-1">
          <SectionHeader
            title={section.title}
            onTitleChange={(newTitle) => onTitleChange(section.id, newTitle)}
            onDelete={() => onDelete(section.id)}
            isDragging={isDragging}
            gap={section.gap}
            onGapChange={(gap) => onGapChange(section.id, gap)}
          />
        </div>
      </div>

      {/* Shapes grid with nested sortable context - using flexbox for flexible sizes */}
      <SortableContext items={section.shapes} strategy={rectSortingStrategy}>
        <div className={`flex flex-wrap items-start min-h-[100px] ${
          section.gap === 'tight' ? 'gap-1' :
          section.gap === 'relaxed' ? 'gap-5' :
          section.gap === 'loose' ? 'gap-8' :
          'gap-3' // default normal
        }`}>
          {section.shapes.map((shape) => (
            <DraggableShape
              key={shape.id}
              shape={shape}
              onContentEdit={onShapeContentEdit}
              onResize={onShapeResize}
              onQuickEdit={onQuickEdit}
            />
          ))}

          {/* Empty state for section */}
          {section.shapes.length === 0 && (
            <div className="w-full flex items-center justify-center py-8 text-gray-400 border-2 border-dashed border-gray-300 rounded-lg">
              <p className="text-sm">
                {isSelected
                  ? "Use the toolbar at the bottom to add shapes to this section"
                  : "Click on this section to select it and add shapes"}
              </p>
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
};
