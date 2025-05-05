'use client';

import { useState } from 'react';
import Image from 'next/image';

interface PropertyImageGalleryProps {
  images: string[];
}

export function PropertyImageGallery({ images }: PropertyImageGalleryProps) {
  const [activeImage, setActiveImage] = useState(0);
  
  // If no images, show a placeholder
  if (!images || images.length === 0) {
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
          src={images[activeImage]}
          alt="Property"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
          priority
        />
      </div>
      
      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setActiveImage(index)}
              className={`relative w-full h-20 bg-gray-100 rounded-md overflow-hidden ${
                index === activeImage ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              <Image
                src={image}
                alt={`Property thumbnail ${index + 1}`}
                fill
                sizes="(max-width: 768px) 25vw, (max-width: 1200px) 16vw, 8vw"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
