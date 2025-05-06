"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Heart } from "lucide-react"
import { Star } from "lucide-react"
import { useLanguage } from "@/components/language-switcher"
import { memo, useState } from "react"
import { ResilientImage } from "@/components/resilient-image"
import { formatPrice } from "@/lib/utils"

interface PropertyCardProps {
  property: any
  featured?: boolean
}

function PropertyCardComponent({ property, featured = false }: PropertyCardProps) {
  const [isSaved, setIsSaved] = useState(false)
  const { translate } = useLanguage()

  // Use featured image or first image from gallery with fallback
  const getImageUrl = () => {
    // First try to use the featured image
    if (property.featured_image) {
      return property.featured_image;
    }

    // Then try to use the first image from the gallery
    if (property.images && property.images.length > 0) {
      return property.images[0];
    }

    // Default fallback based on property ID
    return `/images/properties/property-${property.id || '1'}.jpg`;
  };

  const imageUrl = getImageUrl();

  // We now use the formatPrice function from utils.ts

  // Generate a consistent rating based on property id
  const rating = property.id ? (4.5 + (parseInt(property.id) % 5) * 0.1).toFixed(1) : "4.8"

  // Map small property IDs (1-9) to actual WordPress IDs for backward compatibility
  const getPropertyId = () => {
    // If it's already a WordPress ID (large number), use it directly
    if (property.id && parseInt(property.id) > 100) {
      return property.id;
    }

    // Map small IDs to WordPress IDs
    const knownIds = ['224', '212', '193', '182', '164', '159', '154', '143', '141'];
    const index = (parseInt(property.id) - 1) % knownIds.length;
    return knownIds[index >= 0 ? index : 0];
  };

  const propertyId = getPropertyId();

  return (
    <Link href={`/properties/${propertyId}`} className="block">
      <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 group">
        <div className="relative">
          <div className="relative w-full h-48">
            <ResilientImage
              src={imageUrl}
              alt={property.title || "Property"}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              priority={featured}
              fallbackSrc="/images/properties/property-placeholder.svg"
              showLoadingEffect={true}
            />
          </div>
          {(property.isPremium || featured) && (
            <Badge className="absolute top-2 left-2 bg-orange-500 text-white border-0 px-2 rounded-sm text-xs font-medium">
              Premium
            </Badge>
          )}
          <button
            onClick={(e) => {
              e.preventDefault(); // Prevent navigation when clicking the heart
              setIsSaved(!isSaved);
            }}
            className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-full shadow-sm hover:bg-white transition-colors"
            aria-label={isSaved ? translate("saved") : translate("save_property")}
          >
            <Heart className={`h-4 w-4 ${isSaved ? "fill-rose-500 text-rose-500" : "text-gray-600"}`} />
          </button>
        </div>
        <div className="p-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-base text-gray-900 line-clamp-1">
              {property.title}
            </h3>
            <div className="flex items-center gap-0.5 text-xs ml-1">
              <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
              <span className="text-amber-600">{rating}</span>
              <span className="text-gray-400">({property.id ? (10 + parseInt(property.id) % 20) : 15})</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {property.location || "Naguru, Kampala"}
          </p>

          <div className="flex items-center gap-4 text-xs text-gray-600 mt-2">
            <div>
              <span>{property.bedrooms} bedrooms</span>
            </div>
            <span>•</span>
            {property.bathrooms ? (
              <div>
                <span>{property.bathrooms} bathrooms</span>
              </div>
            ) : (
              <div>
                <span>{Math.max(1, Math.floor(parseInt(property.bedrooms || "3") * 0.7))} bathrooms</span>
              </div>
            )}
          </div>

          <div className="mt-2">
            <span className="font-bold text-base">
              {formatPrice(property.price, property.currency || 'USD')}
            </span>
            <span className="text-gray-500 text-xs">/{property.paymentTerms?.toLowerCase() || "monthly"}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

// Memoize the component to prevent unnecessary re-renders
export const PropertyCard = memo(PropertyCardComponent);
