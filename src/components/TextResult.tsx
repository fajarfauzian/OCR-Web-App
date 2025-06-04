import React from 'react';

interface TextResultProps {
  text: string;
  onCopyText: () => void;
}

const TextResult: React.FC<TextResultProps> = ({ text, onCopyText }) => {
  const wordCount = text.split(/\s+/).filter(word => word.length > 0).length;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          📄 Extracted Text
        </h2>
        <button
          id="copy-btn"
          onClick={onCopyText}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
        >
          📋 Copy Text
        </button>
      </div>
      
      <div className="bg-gray-50 rounded-lg p-4 border">
        <pre className="whitespace-pre-wrap text-gray-800 text-sm leading-relaxed">
          {text}
        </pre>
      </div>
      
      <div className="mt-4 text-sm text-gray-500">
        Character count: {text.length} | Word count: {wordCount}
      </div>
    </div>
  );
};

export default TextResult;