"use client"

import Image from "next/image"
import { useLanguage } from "@/components/language-switcher"

interface PageHeaderProps {
  title: string
  description?: string
  imagePath?: string
  imageAlt?: string
  imagePosition?: 'center' | 'top' | 'bottom'
  overlay?: boolean
  height?: 'small' | 'medium' | 'large'
  children?: React.ReactNode
}

// Collection of beautiful optimized property stock images
const headerImages = {
  default: "/images/headers/luxury-property-header.jpg",
  properties: "/images/headers/luxury-property-header.jpg",
  about: "/images/headers/kampala-skyline.jpg",
  contact: "/images/headers/modern-office-reception.jpg",
  "list-property": "/images/headers/luxury-home-exterior.jpg",
  neighborhoods: "/images/headers/kampala-neighborhood.jpg",
  login: "/images/headers/modern-living-room.jpg",
  register: "/images/headers/elegant-bedroom.jpg",
  dashboard: "/images/headers/modern-workspace.jpg",
  "property-detail": "/images/headers/luxury-kitchen.jpg",
  "search-properties": "/images/headers/luxury-property-header.jpg",
  "search_properties": "/images/headers/luxury-property-header.jpg",
  "search": "/images/headers/luxury-property-header.jpg",
}

export function PageHeader({
  title,
  description,
  imagePath,
  imageAlt,
  imagePosition = 'center',
  overlay = true,
  height = 'medium',
  children
}: PageHeaderProps) {
  const { translate } = useLanguage()

  // Determine image path - use provided path or get from collection based on title
  const headerImage = imagePath || headerImages[title.toLowerCase() as keyof typeof headerImages] || headerImages.default

  // Determine height class
  const heightClass = {
    small: 'h-40 md:h-48',
    medium: 'h-56 md:h-64',
    large: 'h-72 md:h-96'
  }[height]

  // Determine image position
  const objectPosition = {
    center: 'object-center',
    top: 'object-top',
    bottom: 'object-bottom'
  }[imagePosition]

  return (
    <div className={`relative w-full ${heightClass} overflow-hidden`}>
      {/* Background Image */}
      <Image
        src={headerImage}
        alt={imageAlt || title}
        fill
        className={`object-cover ${objectPosition}`}
        priority
        quality={90}
        sizes="100vw"
      />

      {/* Overlay */}
      {overlay && (
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40" />
      )}

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-center px-4 sm:px-6 lg:px-8 container mx-auto">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
          {(() => {
            // Get the translation key by replacing spaces with underscores
            const translationKey = title.toLowerCase().replace(/\s+/g, '_');
            // Get the translated text
            const translatedText = translate(translationKey) || title;
            // Remove any underscores from the displayed text and capitalize each word
            return translatedText
              .split('_')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ');
          })()}
        </h1>

        {description && (
          <p className="text-white/90 text-lg md:text-xl max-w-2xl">
            {(() => {
              // Get the translation key by replacing spaces with underscores
              const translationKey = description.toLowerCase().replace(/\s+/g, '_');
              // Get the translated text
              const translatedText = translate(translationKey) || description;
              // Remove any underscores from the displayed text and ensure proper capitalization
              return translatedText
                .split('_')
                .map((word, index) => {
                  // Capitalize first word or important words, keep articles and prepositions lowercase
                  const lowercaseWords = ['a', 'an', 'the', 'and', 'but', 'or', 'for', 'nor', 'on', 'at', 'to', 'from', 'by', 'with'];
                  return index === 0 || !lowercaseWords.includes(word)
                    ? word.charAt(0).toUpperCase() + word.slice(1)
                    : word;
                })
                .join(' ');
            })()}
          </p>
        )}

        {children}
      </div>
    </div>
  )
}

// Create a directory for header images if it doesn't exist
// This is just a placeholder - you'll need to add actual images to the public/images/headers directory
const headerImagePaths = [
  {
    path: "/images/headers/luxury-property-header.jpg",
    description: "Luxury property with swimming pool and modern architecture"
  },
  {
    path: "/images/headers/modern-building-exterior.jpg",
    description: "Modern building exterior with glass facade"
  },
  {
    path: "/images/headers/luxury-apartment-interior.jpg",
    description: "Luxury apartment interior with modern furniture"
  },
  {
    path: "/images/headers/kampala-skyline.jpg",
    description: "Beautiful skyline view of Kampala city"
  },
  {
    path: "/images/headers/modern-office-reception.jpg",
    description: "Modern office reception area with elegant design"
  },
  {
    path: "/images/headers/luxury-home-exterior.jpg",
    description: "Luxury home exterior with beautiful landscaping"
  },
  {
    path: "/images/headers/kampala-neighborhood.jpg",
    description: "Scenic view of a Kampala neighborhood"
  },
  {
    path: "/images/headers/modern-living-room.jpg",
    description: "Modern living room with stylish furniture"
  },
  {
    path: "/images/headers/elegant-bedroom.jpg",
    description: "Elegant bedroom with luxurious bedding"
  },
  {
    path: "/images/headers/modern-workspace.jpg",
    description: "Modern workspace with contemporary design"
  },
  {
    path: "/images/headers/luxury-kitchen.jpg",
    description: "Luxury kitchen with high-end appliances"
  },
  {
    path: "/images/headers/property-search.jpg",
    description: "Property search and filter interface with beautiful properties"
  }
]
