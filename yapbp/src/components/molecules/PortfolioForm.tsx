"use client";

import React from "react";
import { motion } from "framer-motion";

interface PortfolioFormProps {
  // We'll add form fields later if required
}

// Left side form for portfolio settings and configuration
export const PortfolioForm: React.FC<PortfolioFormProps> = () => {
  return (
    <div className="h-full bg-white border-r border-gray-200 p-6 overflow-auto">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Portfolio Builder
        </h1>
        <p className="text-sm text-gray-500 mb-8">
          Configure your portfolio settings and layout
        </p>

        {/* Basic Info Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
              1
            </span>
            Basic Information
          </h2>
          <div className="space-y-4 pl-10">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Portfolio Title
              </label>
              <input
                type="text"
                placeholder="My Portfolio"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tagline
              </label>
              <input
                type="text"
                placeholder="Building awesome things"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Theme Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
              2
            </span>
            Theme Settings
          </h2>
          <div className="space-y-4 pl-10">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color Scheme
              </label>
              <div className="grid grid-cols-4 gap-2">
                {["#3B82F6", "#10B981", "#F59E0B", "#EF4444"].map((color) => (
                  <button
                    key={color}
                    className="w-full aspect-square rounded-lg border-2 border-gray-200 hover:border-gray-400 transition-colors"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Layout Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
              3
            </span>
            Layout Options
          </h2>
          <div className="space-y-4 pl-10">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Grid Columns
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="2">2 Columns</option>
                <option value="3">3 Columns</option>
                <option value="4">4 Columns</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gap Size
              </label>
              <input
                type="range"
                min="2"
                max="8"
                defaultValue="4"
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-6 border-t border-gray-200">
          <motion.button
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors mb-3"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Save Changes
          </motion.button>
          <motion.button
            className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Preview
          </motion.button>
        </div>

        {/* Helper Text */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Tip:</strong> Click on a section on the right to add shapes
            to it. Use the drag handle to reorder sections.
          </p>
        </div>
      </div>
    </div>
  );
};
