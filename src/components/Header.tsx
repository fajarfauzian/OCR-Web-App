import React from 'react';

const Header: React.FC = () => {
  return (
    <div className="text-center mb-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-2">
        🧠 OCR Text Extractor
      </h1>
      <p className="text-gray-600">
        Extract text from images using advanced OCR technology
      </p>
    </div>
  );
};

export default Header;