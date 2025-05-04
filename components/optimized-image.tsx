"use client"

import { useState, useEffect } from "react"
import Image, { ImageProps } from "next/image"
import { cn } from "@/lib/utils"

interface OptimizedImageProps extends Omit<ImageProps, 'placeholder' | 'blurDataURL'> {
  fallbackSrc?: string
}

// Simple blur data URL for placeholder
const blurDataURL = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAEDQIHq4C2sgAAAABJRU5ErkJggg=="

export function OptimizedImage({
  src,
  alt,
  className,
  fallbackSrc = "/images/placeholder.jpg",
  ...props
}: OptimizedImageProps) {
  const [imgSrc, setImgSrc] = useState<string>(src as string)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  // Reset state when src changes
  useEffect(() => {
    setImgSrc(src as string)
    setIsLoading(true)
    setError(false)
  }, [src])

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <Image
        {...props}
        src={error ? fallbackSrc : imgSrc}
        alt={alt}
        className={cn(
          "transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100",
          props.className
        )}
        placeholder="blur"
        blurDataURL={blurDataURL}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setError(true)
          setIsLoading(false)
        }}
      />
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
    </div>
  )
}
