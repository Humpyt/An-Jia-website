'use client';

import { useState, useEffect } from 'react';
import Image, { ImageProps } from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';

// Define a list of fallback images to use when the primary image fails
const FALLBACK_IMAGES = [
  '/images/properties/fallback-1.jpg',
  '/images/properties/fallback-2.jpg',
  '/images/properties/fallback-3.jpg',
  '/images/properties/property-placeholder.svg',
];

// Get a random fallback image
const getRandomFallback = () => {
  return FALLBACK_IMAGES[Math.floor(Math.random() * FALLBACK_IMAGES.length)];
};

interface ResilientImageProps extends Omit<ImageProps, 'onError'> {
  fallbackSrc?: string;
  showLoadingEffect?: boolean;
}

export function ResilientImage({
  src,
  alt,
  fallbackSrc,
  showLoadingEffect = true,
  className,
  ...props
}: ResilientImageProps) {
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  
  // Process the source URL to ensure it's valid
  useEffect(() => {
    // If src is a remote URL (starts with http), use it directly
    if (typeof src === 'string' && (src.startsWith('http') || src.startsWith('/images/'))) {
      setImgSrc(src);
      return;
    }
    
    // For other sources, ensure they're properly formatted
    if (typeof src === 'string') {
      // If it's a relative path without leading slash, add it
      if (!src.startsWith('/') && !src.startsWith('http')) {
        setImgSrc(`/${src}`);
        return;
      }
      
      setImgSrc(src);
    } else {
      // For StaticImageData or other objects
      setImgSrc(src as any);
    }
  }, [src]);

  // Handle image load success
  const handleLoad = () => {
    setIsLoading(false);
    setError(false);
  };

  // Handle image load error
  const handleError = () => {
    setError(true);
    setIsLoading(false);
    
    // Use provided fallback or get a random one
    const newSrc = fallbackSrc || getRandomFallback();
    
    // Only change the source if it's different to avoid infinite loops
    if (imgSrc !== newSrc) {
      console.log(`Image failed to load: ${imgSrc}, using fallback: ${newSrc}`);
      setImgSrc(newSrc);
    }
  };

  // If we're still determining the source, show a skeleton
  if (!imgSrc) {
    return showLoadingEffect ? (
      <Skeleton className={`w-full h-full ${className || ''}`} />
    ) : null;
  }

  return (
    <>
      {isLoading && showLoadingEffect && (
        <Skeleton className={`absolute inset-0 ${className || ''}`} />
      )}
      <Image
        src={imgSrc}
        alt={alt || 'Image'}
        className={`${className || ''} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />
    </>
  );
}
