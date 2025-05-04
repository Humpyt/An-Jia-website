"use client"

import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/components/language-switcher"
import { memo } from "react"

interface PropertyCardProps {
  property: any
  featured?: boolean
}

function PropertyCardComponent({ property, featured = false }: PropertyCardProps) {

  const { translate } = useLanguage()

  // Use the first image from the images array or featured image
  const imageUrl = property.images?.[0] || property.featuredImage || "/placeholder.svg"

  // Format price with thousand separator
  const formatPrice = (price: string, currency: string) => {
    if (!price) return 'Price on request';

    const numericPrice = parseInt(price)
    if (isNaN(numericPrice)) return 'Price on request';

    if (currency === "UGX") {
      return `UGX ${numericPrice.toLocaleString()}`
    }
    return `$${numericPrice.toLocaleString()}`
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <div className="relative w-full h-48">
          <Image
            src={imageUrl}
            alt={property.title || "Property"}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            loading="lazy"
            quality={80}
          />
        </div>
        {property.isPremium && (
          <Badge className="absolute top-2 right-2 bg-gradient-to-r from-amber-500 to-rose-500 text-white border-0">
            {translate("premium")}
          </Badge>
        )}
        {property.propertyType && (
          <Badge className="absolute bottom-2 left-2 capitalize bg-white text-black">
            {translate(property.propertyType.toLowerCase()) || property.propertyType}
          </Badge>
        )}

      </div>
      <div className="p-4">
        <Link href={`/properties/${property.id}`} className="hover:underline">
          <h3 className="font-medium text-base line-clamp-1">{property.title}</h3>
        </Link>
        <p className="text-sm text-neutral-500 mt-1">{property.location}</p>
        <div className="flex items-center gap-2 mt-2 text-sm">
          {property.bedrooms && (
            <>
              <span>
                {property.bedrooms} {translate("bedroom")}{parseInt(property.bedrooms) !== 1 && 's'}
              </span>
              {(property.bathrooms || property.floor || property.squareMeters) && <span>•</span>}
            </>
          )}
          {property.bathrooms && (
            <>
              <span>
                {property.bathrooms} {translate("bathroom")}{parseFloat(property.bathrooms) !== 1 && 's'}
              </span>
              {(property.floor || property.squareMeters) && <span>•</span>}
            </>
          )}
          {property.floor && (
            <>
              <span>{property.floor} {translate('floor')}</span>
              {property.squareMeters && <span>•</span>}
            </>
          )}
          {property.squareMeters && (
            <span>{property.squareMeters} m²</span>
          )}
          {!property.bedrooms && !property.bathrooms && !property.floor && !property.squareMeters && (
            <span>{property.propertyType || translate("property")}</span>
          )}
        </div>
        <div className="mt-3">
          <span className="font-semibold">{formatPrice(property.price, property.currency || 'USD')}</span>
          {property.paymentTerms && (
            <span className="text-neutral-500 text-sm"> /{property.paymentTerms.toLowerCase()}</span>
          )}
        </div>
        {property.amenities && property.amenities.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {property.amenities.slice(0, 3).map((amenity: string, index: number) => (
              <span key={index} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                {translate(amenity.toLowerCase().replace(/\s+/g, '_')) || amenity}
              </span>
            ))}
            {property.amenities.length > 3 && (
              <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                +{property.amenities.length - 3} {translate("more")}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// Memoize the component to prevent unnecessary re-renders
export const PropertyCard = memo(PropertyCardComponent);
