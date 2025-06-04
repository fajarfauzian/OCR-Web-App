import React from 'react';

interface ActionButtonsProps {
  onExtractText: () => void;
  onClearAll: () => void;
  loading: boolean;
  progress: number;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ 
  onExtractText, 
  onClearAll, 
  loading, 
  progress 
}) => {
  if (loading) {
    return (
      <div className="flex gap-4 justify-center mb-6">
        <button
          disabled
          className="bg-gray-400 text-white px-8 py-3 rounded-lg font-medium flex items-center gap-2"
        >
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
          Processing... {progress}%
        </button>
        <button
          onClick={onClearAll}
          disabled
          className="bg-gray-300 text-gray-500 px-8 py-3 rounded-lg font-medium transition-colors"
        >
          🗑️ Clear All
        </button>
      </div>
    );
  }

  return (
    <div className="flex gap-4 justify-center mb-6">
      <button
        onClick={onExtractText}
        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
      >
        🔍 Extract Text
      </button>
      
      <button
        onClick={onClearAll}
        className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-3 rounded-lg font-medium transition-colors"
      >
        🗑️ Clear All
      </button>
    </div>
  );
};

export default ActionButtons;