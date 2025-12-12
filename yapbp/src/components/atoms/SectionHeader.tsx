"use client";

import React, { useState } from "react";
import { Trash2, Check, X, Space } from "lucide-react";
import { motion } from "framer-motion";
import { GapSize } from "@/types/section";

interface SectionHeaderProps {
  title: string;
  onTitleChange: (newTitle: string) => void;
  onDelete: () => void;
  isDragging?: boolean;
  gap?: GapSize;
  onGapChange?: (gap: GapSize) => void;
}

// Section header with editable title and delete functionality
export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  onTitleChange,
  onDelete,
  isDragging = false,
  gap = 'normal',
  onGapChange,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(title);
  const [showGapMenu, setShowGapMenu] = useState(false);

  const handleSave = () => {
    if (editValue.trim()) {
      onTitleChange(editValue.trim());
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditValue(title);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  return (
    <div
      className={`flex items-center justify-between mb-4 pb-3 border-b-2 border-gray-300 ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      {isEditing ? (
        <div className="flex items-center gap-2 flex-1">
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 px-3 py-1 border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-xl font-bold"
            placeholder="Section title"
            autoFocus
          />
          <motion.button
            onClick={handleSave}
            className="p-2 text-green-600 hover:bg-green-50 rounded transition-colors"
            whileTap={{ scale: 0.95 }}
            title="Save"
          >
            <Check size={20} />
          </motion.button>
          <motion.button
            onClick={handleCancel}
            className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
            whileTap={{ scale: 0.95 }}
            title="Cancel"
          >
            <X size={20} />
          </motion.button>
        </div>
      ) : (
        <>
          <h2
            className="text-2xl font-bold text-gray-800 cursor-pointer hover:text-blue-600 transition-colors"
            onClick={() => setIsEditing(true)}
            title="Click to edit title"
          >
            {title}
          </h2>
          <div className="flex items-center gap-2">
            {/* Gap control */}
            {onGapChange && (
              <div className="relative">
                <motion.button
                  onClick={() => setShowGapMenu(!showGapMenu)}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  title="Adjust gap"
                >
                  <Space size={18} />
                </motion.button>

                {showGapMenu && (
                  <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-10 min-w-[140px]">
                    <button
                      onClick={() => {
                        onGapChange('tight');
                        setShowGapMenu(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded hover:bg-gray-100 transition-colors ${
                        gap === 'tight' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'
                      }`}
                    >
                      Tight
                    </button>
                    <button
                      onClick={() => {
                        onGapChange('normal');
                        setShowGapMenu(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded hover:bg-gray-100 transition-colors ${
                        gap === 'normal' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'
                      }`}
                    >
                      Normal
                    </button>
                    <button
                      onClick={() => {
                        onGapChange('relaxed');
                        setShowGapMenu(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded hover:bg-gray-100 transition-colors ${
                        gap === 'relaxed' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'
                      }`}
                    >
                      Relaxed
                    </button>
                    <button
                      onClick={() => {
                        onGapChange('loose');
                        setShowGapMenu(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded hover:bg-gray-100 transition-colors ${
                        gap === 'loose' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'
                      }`}
                    >
                      Loose
                    </button>
                  </div>
                )}
              </div>
            )}

            <motion.button
              onClick={onDelete}
              className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              title="Delete section"
            >
              <Trash2 size={18} />
            </motion.button>
          </div>
        </>
      )}
    </div>
  );
};
