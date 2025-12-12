"use client";

import React, { useState, useRef } from "react";
import { Upload, Link as LinkIcon, X } from "lucide-react";
import Image from "next/image";

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  value,
  onChange,
  label = "Image",
}) => {
  const [mode, setMode] = useState<"url" | "upload">("url");
  const [preview, setPreview] = useState<string>(value);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB");
      return;
    }

    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setPreview(result);
      onChange(result);
    };
    reader.readAsDataURL(file);
  };

  const handleUrlChange = (url: string) => {
    setPreview(url);
    onChange(url);
  };

  const clearImage = () => {
    setPreview("");
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium">{label}</label>

      {/* Mode Selector */}
      <div className="flex gap-2 mb-3">
        <button
          type="button"
          onClick={() => setMode("url")}
          className={`flex-1 py-2 px-4 rounded font-medium transition-colors flex items-center justify-center gap-2 ${
            mode === "url"
              ? "bg-blue-500 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          <LinkIcon size={16} />
          URL
        </button>
        <button
          type="button"
          onClick={() => setMode("upload")}
          className={`flex-1 py-2 px-4 rounded font-medium transition-colors flex items-center justify-center gap-2 ${
            mode === "upload"
              ? "bg-blue-500 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          <Upload size={16} />
          Upload
        </button>
      </div>

      {/* URL Input Mode */}
      {mode === "url" && (
        <div>
          <input
            type="text"
            value={value}
            onChange={(e) => handleUrlChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://example.com/image.jpg"
          />
        </div>
      )}

      {/* File Upload Mode */}
      {mode === "upload" && (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <Upload size={20} />
            <span className="text-sm text-gray-600">
              Click to upload image (max 5MB)
            </span>
          </label>
        </div>
      )}

      {/* Preview */}
      {preview && (
        <div className="relative mt-3">
          <div className="relative w-full h-40 border border-gray-200 rounded overflow-hidden bg-gray-50">
            <Image
              src={preview}
              alt="Preview"
              fill
              className="object-contain"
              unoptimized={preview.startsWith("data:")}
            />
          </div>
          <button
            type="button"
            onClick={clearImage}
            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
            title="Remove image"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <p className="text-xs text-gray-500">
        {mode === "url"
          ? "Enter a direct link to an image"
          : "Upload an image from your device"}
      </p>
    </div>
  );
};
