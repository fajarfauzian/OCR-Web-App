import React from 'react';
import Image from 'next/image';
import { ImageDimensions } from '../types';

interface ImagePreviewProps {
  imagePreview: string;
  imageDimensions: ImageDimensions;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ imagePreview, imageDimensions }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        📸 Image Preview
      </h2>
      <div className="flex justify-center">
        <Image
          src={imagePreview}
          alt="Preview"
          width={imageDimensions.width}
          height={imageDimensions.height}
          className="max-w-full max-h-96 rounded-lg shadow-md object-contain"
        />
      </div>
    </div>
  );
};

export default ImagePreview;