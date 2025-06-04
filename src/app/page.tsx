'use client';

import { useState, useRef } from 'react';
import { createWorker } from 'tesseract.js';
import Image from 'next/image'; // Corrected import

export default function Home() {
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null); // State for image dimensions
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Clean up previous preview URL and dimensions
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(null);
    setImageDimensions(null);

    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        setImage(null);
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('File size should be less than 10MB');
        setImage(null);
        return;
      }

      setImage(file);
      setError(null);
      setText('');
      
      const objectUrl = URL.createObjectURL(file);
      setImagePreview(objectUrl); // Set preview URL for display

      // Get image dimensions
      const img = new window.Image();
      img.onload = () => {
        setImageDimensions({ width: img.naturalWidth, height: img.naturalHeight });
        // The objectUrl used for img.src will be the same as imagePreview.
        // It will be revoked when a new image is selected or when cleared.
      };
      img.onerror = () => {
        setError('Failed to load image dimensions. Please try a different image.');
        setImagePreview(null); // Clear preview if dimensions can't be loaded
        setImageDimensions(null);
        URL.revokeObjectURL(objectUrl); // Clean up the failed object URL
        setImage(null);
      };
      img.src = objectUrl;

    } else {
      // No file selected, clear relevant states
      setImage(null);
      // imagePreview and imageDimensions already cleared at the beginning of the function
    }
  };

  const handleOCR = async () => {
    if (!image) return;

    setLoading(true);
    setProgress(0);
    setError(null);

    try {
      const worker = await createWorker('eng', 1, {
        logger: m => {
          if (m.status === 'recognizing text') {
            setProgress(Math.round(m.progress * 100));
          }
        }
      });

      const { data: { text: recognizedText } } = await worker.recognize(image); // Renamed to avoid conflict
      
      if (recognizedText.trim()) {
        setText(recognizedText);
      } else {
        setError('No text found in the image. Please try with a clearer image.');
      }

      await worker.terminate();
    } catch (err) {
      setError('Failed to process image. Please try again.');
      console.error('OCR Error:', err);
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  const handleCopyText = async () => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      const button = document.getElementById('copy-btn');
      if (button) {
        const originalText = button.textContent;
        button.textContent = '✅ Copied!';
        setTimeout(() => {
          button.textContent = originalText;
        }, 2000);
      }
    } catch (err) {
      console.error('Failed to copy text:', err);
      // Optionally, set an error state to inform the user
      setError('Failed to copy text to clipboard.');
    }
  };

  const handleClearAll = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    
    setImage(null);
    setImagePreview(null);
    setImageDimensions(null); // Clear dimensions
    setText('');
    setError(null);
    setProgress(0); // Reset progress as well
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🧠 OCR Text Extractor
          </h1>
          <p className="text-gray-600">
            Extract text from images using advanced OCR technology
          </p>
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="text-center">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-blue-400 transition-colors">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
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

        {/* Image Preview */}
        {imagePreview && imageDimensions && ( // Render only if preview and dimensions are available
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              📸 Image Preview
            </h2>
            <div className="flex justify-center">
              <Image
                src={imagePreview}
                alt="Preview"
                width={imageDimensions.width}   // Provide actual width
                height={imageDimensions.height} // Provide actual height
                className="max-w-full max-h-96 rounded-lg shadow-md object-contain" // Added object-contain for better aspect ratio handling
              />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {image && !loading && ( // Show buttons if image is selected and not loading
          <div className="flex gap-4 justify-center mb-6">
            <button
              onClick={handleOCR}
              disabled={loading} // This is redundant due to outer conditional but kept for clarity
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              🔍 Extract Text
            </button>
            
            <button
              onClick={handleClearAll}
              className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-3 rounded-lg font-medium transition-colors"
            >
              🗑️ Clear All
            </button>
          </div>
        )}
        
        {/* Loading state for OCR button */}
        {image && loading && (
             <div className="flex gap-4 justify-center mb-6">
                <button
                  disabled
                  className="bg-gray-400 text-white px-8 py-3 rounded-lg font-medium flex items-center gap-2"
                >
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    Processing... {progress}%
                </button>
                 <button
                    onClick={handleClearAll}
                    disabled // Disable clear all during processing to avoid issues
                    className="bg-gray-300 text-gray-500 px-8 py-3 rounded-lg font-medium transition-colors"
                  >
                    🗑️ Clear All
                  </button>
             </div>
        )}


        {/* Progress Bar - Combined with loading state above or shown separately if preferred */}
        {loading && progress > 0 && ( // Show only if progress is happening
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="mb-2 flex justify-between text-sm">
              <span className="text-gray-600">Processing...</span>
              <span className="text-gray-600">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Results */}
        {text && !loading && ( // Show text only if not loading and text exists
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                📄 Extracted Text
              </h2>
              <button
                id="copy-btn"
                onClick={handleCopyText}
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
              Character count: {text.length} | Word count: {text.split(/\s+/).filter(word => word.length > 0).length}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>Powered by Fajar Fauzian - OCR Engine</p>
        </div>
      </div>
    </main>
  );
}