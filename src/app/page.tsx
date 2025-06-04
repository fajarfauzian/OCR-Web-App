'use client';

import React from 'react';
import Header from '../components/Header';
import ImageUpload from '../components/ImageUpload';
import ImagePreview from '../components/ImagePreview';
import ActionButtons from '../components/ActionButtons';
import ProgressBar from '../components/ProgressBar';
import TextResult from '../components/TextResult';
import Footer from '../components/Footer';
import { useOCR } from '../hooks/useOCR';

export default function Home() {
  const {
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
  } = useOCR();

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        <Header />
        
        <ImageUpload 
          onImageChange={handleImageChange}
          error={error}
        />

        {imagePreview && imageDimensions && (
          <ImagePreview 
            imagePreview={imagePreview}
            imageDimensions={imageDimensions}
          />
        )}

        {image && (
          <ActionButtons
            onExtractText={handleOCR}
            onClearAll={handleClearAll}
            loading={loading}
            progress={progress}
          />
        )}

        {loading && progress > 0 && (
          <ProgressBar progress={progress} />
        )}

        {text && !loading && (
          <TextResult 
            text={text}
            onCopyText={handleCopyText}
          />
        )}

        <Footer />
      </div>
    </main>
  );
}