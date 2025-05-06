'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface PropertyImageGalleryProps {
  images: string[];
}

export function PropertyImageGallery({ images }: PropertyImageGalleryProps) {
  const [activeImage, setActiveImage] = useState(0);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});
  const [validImages, setValidImages] = useState<string[]>([]);

  // Filter out placeholder image for display purposes
  const displayImages = images.filter(img => !img.includes('property-placeholder.jpg'));

  // Effect to initialize valid images
  useEffect(() => {
    setValidImages(displayImages.length > 0 ? displayImages : images);
  }, [images]);

  // Handle image error
  const handleImageError = (index: number) => {
    console.log(`Image at index ${index} failed to load:`, validImages[index]);

    setImageErrors(prev => ({
      ...prev,
      [index]: true
    }));

    // If this is the active image, try to switch to the next valid one
    if (index === activeImage) {
      const nextValidIndex = findNextValidImageIndex(index);
      if (nextValidIndex !== index) {
        setActiveImage(nextValidIndex);
      }
    }
  };

  // Find the next valid image index
  const findNextValidImageIndex = (currentIndex: number): number => {
    // First try forward
    for (let i = currentIndex + 1; i < validImages.length; i++) {
      if (!imageErrors[i]) {
        return i;
      }
    }

    // Then try backward
    for (let i = currentIndex - 1; i >= 0; i--) {
      if (!imageErrors[i]) {
        return i;
      }
    }

    // If all images have errors, return the placeholder or the current index
    const placeholderIndex = validImages.findIndex(img => img.includes('property-placeholder.jpg'));
    return placeholderIndex >= 0 ? placeholderIndex : currentIndex;
  };

  // If no valid images, show a placeholder
  if (!validImages || validImages.length === 0) {
    return (
      <div className="relative w-full h-96 bg-gray-200 rounded-lg overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-gray-500">No images available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main image */}
      <div className="relative w-full h-96 bg-gray-100 rounded-lg overflow-hidden">
        <Image
          src={validImages[activeImage]}
          alt="Property"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
          priority
          onError={() => handleImageError(activeImage)}
        />

        {/* Image navigation arrows for multiple images */}
        {validImages.length > 1 && (
          <>
            <button
              onClick={() => setActiveImage((activeImage - 1 + validImages.length) % validImages.length)}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-md hover:bg-white transition-colors"
              aria-label="Previous image"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => setActiveImage((activeImage + 1) % validImages.length)}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-md hover:bg-white transition-colors"
              aria-label="Next image"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Image counter */}
        {validImages.length > 1 && (
          <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
            {activeImage + 1} / {validImages.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {validImages.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
          {validImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setActiveImage(index)}
              className={`relative w-full h-20 bg-gray-100 rounded-md overflow-hidden ${
                index === activeImage ? 'ring-2 ring-rose-500' : ''
              } ${imageErrors[index] ? 'opacity-50' : ''}`}
              disabled={imageErrors[index]}
            >
              <Image
                src={image}
                alt={`Property thumbnail ${index + 1}`}
                fill
                sizes="(max-width: 768px) 25vw, (max-width: 1200px) 16vw, 8vw"
                className="object-cover"
                onError={() => handleImageError(index)}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
