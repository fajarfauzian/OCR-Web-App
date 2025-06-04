import React, { useRef } from 'react';

interface ImageUploadProps {
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error: string | null;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageChange, error }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div className="text-center">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-blue-400 transition-colors">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={onImageChange}
            className="hidden"
            id="file-input"
          />
          <label
            htmlFor="file-input"
            className="cursor-pointer flex flex-col items-center"
          >
            <div className="text-4xl mb-4">📷</div>
            <div className="text-lg font-medium text-gray-700 mb-2">
              Click to select an image
            </div>
            <div className="text-sm text-gray-500">
              Supports JPG, PNG, GIF, WebP (max 10MB)
            </div>
          </label>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">❌ {error}</p>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;