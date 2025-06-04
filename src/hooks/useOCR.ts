import { useState } from 'react';
import { createWorker } from 'tesseract.js';
import { ImageDimensions } from '../types';

export const useOCR = () => {
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageDimensions, setImageDimensions] = useState<ImageDimensions | null>(null);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(null);
    setImageDimensions(null);

    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        setImage(null);
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        setError('File size should be less than 10MB');
        setImage(null);
        return;
      }

      setImage(file);
      setError(null);
      setText('');
      
      const objectUrl = URL.createObjectURL(file);
      setImagePreview(objectUrl);

      const img = new window.Image();
      img.onload = () => {
        setImageDimensions({ width: img.naturalWidth, height: img.naturalHeight });
      };
      img.onerror = () => {
        setError('Failed to load image dimensions. Please try a different image.');
        setImagePreview(null);
        setImageDimensions(null);
        URL.revokeObjectURL(objectUrl);
        setImage(null);
      };
      img.src = objectUrl;
    } else {
      setImage(null);
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

      const { data: { text: recognizedText } } = await worker.recognize(image);
      
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
      setError('Failed to copy text to clipboard.');
    }
  };

  const handleClearAll = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    
    setImage(null);
    setImagePreview(null);
    setImageDimensions(null);
    setText('');
    setError(null);
    setProgress(0);
  };

  return {
    image,
    imagePreview,
    imageDimensions,
    text,
    loading,
    progress,
    error,
    handleImageChange,
    handleOCR,
    handleCopyText,
    handleClearAll
  };
};
