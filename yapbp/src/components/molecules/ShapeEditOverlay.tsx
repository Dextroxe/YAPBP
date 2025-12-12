"use client";

import React, { useState } from "react";
import { Type, FileText, Image as ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ShapeEditOverlayProps {
  onEditTitle: () => void;
  onEditSubText: () => void;
  onEditImage: () => void;
  hasImage: boolean;
}

// Hover overlay for quick shape content editing
export const ShapeEditOverlay: React.FC<ShapeEditOverlayProps> = ({
  onEditTitle,
  onEditSubText,
  onEditImage,
  hasImage,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center gap-3 z-20 rounded-inherit"
    >
      <motion.button
        onClick={(e) => {
          e.stopPropagation();
          onEditTitle();
        }}
        className="p-3 bg-white rounded-lg shadow-lg hover:bg-blue-50 transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        title="Edit title"
      >
        <Type size={20} className="text-gray-700" />
      </motion.button>

      <motion.button
        onClick={(e) => {
          e.stopPropagation();
          onEditSubText();
        }}
        className="p-3 bg-white rounded-lg shadow-lg hover:bg-blue-50 transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        title="Edit description"
      >
        <FileText size={20} className="text-gray-700" />
      </motion.button>

      <motion.button
        onClick={(e) => {
          e.stopPropagation();
          onEditImage();
        }}
        className={`p-3 rounded-lg shadow-lg transition-colors ${
          hasImage
            ? 'bg-blue-500 hover:bg-blue-600'
            : 'bg-white hover:bg-blue-50'
        }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        title={hasImage ? "Change image" : "Add image"}
      >
        <ImageIcon size={20} className={hasImage ? "text-white" : "text-gray-700"} />
      </motion.button>
    </motion.div>
  );
};
