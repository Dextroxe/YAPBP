"use client";

import React, { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { DraggableSection } from "../molecules/DraggableSection";
import { PortfolioForm } from "../molecules/PortfolioForm";
import { ImageUploader } from "../molecules/ImageUploader";
import { ShapeData, ShapeType, ShapeSize } from "@/types/shape";
import { SectionData, GapSize } from "@/types/section";
import { Square, RectangleHorizontal, Circle, FolderPlus } from "lucide-react";
import { motion } from "framer-motion";

// Main canvas component that manages sections and shapes
export const PortfolioCanvas: React.FC = () => {
  const [sections, setSections] = useState<SectionData[]>([]);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [editingShape, setEditingShape] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<'title' | 'subText' | 'imageUrl' | null>(null);
  const [selectedSize, setSelectedSize] = useState<ShapeSize>('medium');
  const [formData, setFormData] = useState({
    title: "",
    subText: "",
    imageUrl: "",
    size: 'medium' as ShapeSize,
  });

  // Configure sensors for drag detection
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handle drag end - reorder sections or shapes
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    // Check if we're dragging a section
    const activeSection = sections.find((s) => s.id === active.id);
    const overSection = sections.find((s) => s.id === over.id);

    if (activeSection && overSection) {
      // Reordering sections
      setSections((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    } else {
      // Reordering shapes within a section
      setSections((sects) =>
        sects.map((section) => {
          const oldIndex = section.shapes.findIndex(
            (item) => item.id === active.id
          );
          const newIndex = section.shapes.findIndex(
            (item) => item.id === over.id
          );
          if (oldIndex !== -1 && newIndex !== -1) {
            return {
              ...section,
              shapes: arrayMove(section.shapes, oldIndex, newIndex),
            };
          }
          return section;
        })
      );
    }
  };

  // Add a new section
  const addSection = () => {
    const newSection: SectionData = {
      id: `section-${Date.now()}`,
      title: "New Section",
      shapes: [],
      order: sections.length,
    };
    setSections((prev) => [...prev, newSection]);
    setSelectedSectionId(newSection.id); // Auto-select the new section
  };

  // Update section title
  const handleSectionTitleChange = (sectionId: string, newTitle: string) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId ? { ...section, title: newTitle } : section
      )
    );
  };

  // Delete a section
  const handleDeleteSection = (sectionId: string) => {
    setSections((prev) => prev.filter((s) => s.id !== sectionId));
    // Clear selection if deleting the selected section
    if (selectedSectionId === sectionId) {
      setSelectedSectionId(null);
    }
  };

  // Add a shape to the selected section
  const addShapeToSelectedSection = (type: ShapeType) => {
    if (!selectedSectionId) return;

    const newShape: ShapeData = {
      id: `shape-${Date.now()}`,
      type,
      size: selectedSize, // Use the currently selected size
      content: { title: "New Shape", subText: "Double click to edit" },
      position: { x: 0, y: 0 },
      order: 0,
    };

    setSections((prev) =>
      prev.map((section) =>
        section.id === selectedSectionId
          ? { ...section, shapes: [...section.shapes, newShape] }
          : section
      )
    );
  };

  // Open edit form for a shape
  const handleContentEdit = (id: string) => {
    // Search for shape in sections
    let shape: ShapeData | undefined;
    for (const section of sections) {
      shape = section.shapes.find((s) => s.id === id);
      if (shape) break;
    }

    if (shape) {
      setEditingShape(id);
      setEditingField(null); // Full edit mode
      setFormData({
        title: shape.content.title || "",
        subText: shape.content.subText || "",
        imageUrl: shape.content.imageUrl || "",
        size: shape.size || 'medium',
      });
    }
  };

  // Quick edit for specific field
  const handleQuickEdit = (id: string, field: 'title' | 'subText' | 'imageUrl') => {
    // Search for shape in sections
    let shape: ShapeData | undefined;
    for (const section of sections) {
      shape = section.shapes.find((s) => s.id === id);
      if (shape) break;
    }

    if (shape) {
      setEditingShape(id);
      setEditingField(field);
      setFormData({
        title: shape.content.title || "",
        subText: shape.content.subText || "",
        imageUrl: shape.content.imageUrl || "",
        size: shape.size || 'medium',
      });
    }
  };

  // Save edited content
  const handleSaveContent = () => {
    if (editingShape) {
      // Update in sections
      setSections((prev) =>
        prev.map((section) => ({
          ...section,
          shapes: section.shapes.map((shape) =>
            shape.id === editingShape
              ? {
                  ...shape,
                  content: {
                    title: formData.title,
                    subText: formData.subText,
                    imageUrl: formData.imageUrl
                  },
                  size: formData.size
                }
              : shape
          ),
        }))
      );

      setEditingShape(null);
      setEditingField(null);
      setFormData({ title: "", subText: "", imageUrl: "", size: 'medium' });
    }
  };

  // Handle section selection
  const handleSectionSelect = (sectionId: string) => {
    setSelectedSectionId(sectionId);
  };

  // Handle gap change for a section
  const handleSectionGapChange = (sectionId: string, gap: GapSize) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId ? { ...section, gap } : section
      )
    );
  };

  // Handle shape resize
  const handleShapeResize = (shapeId: string, width: number, height: number) => {
    setSections((prev) =>
      prev.map((section) => ({
        ...section,
        shapes: section.shapes.map((shape) =>
          shape.id === shapeId
            ? { ...shape, width, height }
            : shape
        ),
      }))
    );
  };

  return (
    <div className="w-full h-screen flex">
      {/* Left Side - Form (50%) */}
      <div className="w-1/2 flex-shrink-0 border-r border-gray-200">
        <PortfolioForm />
      </div>

      {/* Right Side - Canvas (50%) */}
      <div className="w-1/2 flex-shrink-0 flex flex-col relative bg-gray-50">
        <div className="flex-1 p-8 overflow-auto">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            {/* Sections with vertical sorting */}
            <SortableContext items={sections} strategy={verticalListSortingStrategy}>
              {sections.map((section) => (
                <DraggableSection
                  key={section.id}
                  section={section}
                  onTitleChange={handleSectionTitleChange}
                  onDelete={handleDeleteSection}
                  onShapeContentEdit={handleContentEdit}
                  onAddShapeToSection={() => {}} // Not used anymore
                  isSelected={selectedSectionId === section.id}
                  onSelect={handleSectionSelect}
                  onGapChange={handleSectionGapChange}
                  onShapeResize={handleShapeResize}
                  onQuickEdit={handleQuickEdit}
                />
              ))}
            </SortableContext>
          </DndContext>

          {/* Empty state */}
          {sections.length === 0 && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-gray-400">
                <p className="text-xl mb-2">No sections yet</p>
                <p className="text-sm">
                  Click the folder icon below to create your first section
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Toolbar - Only show shapes when section is selected */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-lg border border-gray-200 px-6 py-3 flex gap-3 items-center shadow-xl rounded-full">
          <motion.button
            onClick={addSection}
            className="p-3 hover:bg-blue-50 rounded-lg transition-colors border-r border-gray-200 pr-4"
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.95 }}
            title="Add Section"
          >
            <FolderPlus size={24} className="text-blue-600" />
          </motion.button>

          {/* Only show shape buttons when a section is selected */}
          {selectedSectionId && (
            <>
              {/* Size selector */}
              <div className="flex gap-1 pl-2 border-l border-gray-300">
                <button
                  onClick={() => setSelectedSize('small')}
                  className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                    selectedSize === 'small'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  title="Small Size"
                >
                  S
                </button>
                <button
                  onClick={() => setSelectedSize('medium')}
                  className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                    selectedSize === 'medium'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  title="Medium Size"
                >
                  M
                </button>
                <button
                  onClick={() => setSelectedSize('large')}
                  className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                    selectedSize === 'large'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  title="Large Size"
                >
                  L
                </button>
              </div>

              {/* Shape buttons */}
              <div className="flex gap-3 pl-2 border-l border-gray-300">
                <motion.button
                  onClick={() => addShapeToSelectedSection("rectangle")}
                  className="p-3 hover:bg-gray-100 rounded-lg transition-colors"
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  title="Add Rectangle to Selected Section"
                >
                  <RectangleHorizontal size={24} className="text-gray-700" />
                </motion.button>
                <motion.button
                  onClick={() => addShapeToSelectedSection("square")}
                  className="p-3 hover:bg-gray-100 rounded-lg transition-colors"
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  title="Add Square to Selected Section"
                >
                  <Square size={24} className="text-gray-700" />
                </motion.button>
                <motion.button
                  onClick={() => addShapeToSelectedSection("circle")}
                  className="p-3 hover:bg-gray-100 rounded-lg transition-colors"
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  title="Add Circle to Selected Section"
                >
                  <Circle size={24} className="text-gray-700" />
                </motion.button>
              </div>
            </>
          )}

          {/* Indicator when no section is selected */}
          {!selectedSectionId && sections.length > 0 && (
            <div className="pl-2 text-sm text-gray-500 italic">
              Select a section to add shapes
            </div>
          )}
        </div>

        {/* Edit modal for shape content */}
        {editingShape && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-96">
              <h3 className="text-xl font-bold mb-4">
                {editingField === 'title' ? 'Edit Title' :
                 editingField === 'subText' ? 'Edit Description' :
                 editingField === 'imageUrl' ? 'Edit Image' :
                 'Edit Shape Content'}
              </h3>

              <div className="space-y-4">
                {(editingField === null || editingField === 'title') && (
                  <div>
                    <label className="block text-sm font-medium mb-1">Title</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter title"
                      autoFocus
                    />
                  </div>
                )}

                {(editingField === null || editingField === 'subText') && (
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Description
                    </label>
                    <textarea
                      value={formData.subText}
                      onChange={(e) =>
                        setFormData({ ...formData, subText: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter description"
                      rows={3}
                      autoFocus={editingField === 'subText'}
                    />
                  </div>
                )}

                {(editingField === null || editingField === 'imageUrl') && (
                  <ImageUploader
                    value={formData.imageUrl}
                    onChange={(url) => setFormData({ ...formData, imageUrl: url })}
                    label="Image"
                  />
                )}

                {editingField === null && (
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Size
                    </label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setFormData({ ...formData, size: 'small' })}
                        className={`flex-1 py-2 px-4 rounded font-medium transition-colors ${
                          formData.size === 'small'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        Small
                      </button>
                      <button
                        onClick={() => setFormData({ ...formData, size: 'medium' })}
                        className={`flex-1 py-2 px-4 rounded font-medium transition-colors ${
                          formData.size === 'medium'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        Medium
                      </button>
                      <button
                        onClick={() => setFormData({ ...formData, size: 'large' })}
                        className={`flex-1 py-2 px-4 rounded font-medium transition-colors ${
                          formData.size === 'large'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        Large
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleSaveContent}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setEditingShape(null);
                    setEditingField(null);
                  }}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
