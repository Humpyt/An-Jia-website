"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Heart } from "lucide-react"
import { useLanguage } from "@/components/language-switcher"

interface PropertyCardProps {
  property: any
  featured?: boolean
}

export function PropertyCard({ property, featured = false }: PropertyCardProps) {
  const [isSaved, setIsSaved] = useState(false)
  const { translate } = useLanguage()

  // Use the first image from the images array
  const imageUrl = property.images?.[0] || "/placeholder.svg"
  
  // Format price with thousand separator
  const formatPrice = (price: string, currency: string) => {
    const numericPrice = parseInt(price)
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
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        {property.isPremium && (
          <Badge className="absolute top-2 right-2 bg-gradient-to-r from-amber-500 to-rose-500 text-white border-0">
            {featured ? "Premium" : "Premium"}
          </Badge>
        )}
        {property.propertyType && (
          <Badge className="absolute bottom-2 left-2 capitalize bg-white text-black">
            {property.propertyType}
          </Badge>
        )}
        <button
          onClick={() => setIsSaved(!isSaved)}
          className="absolute top-2 left-2 bg-white p-1.5 rounded-full shadow-md"
          aria-label={isSaved ? translate("saved") : translate("save_property")}
        >
          <Heart className={`h-5 w-5 ${isSaved ? "fill-rose-500 text-rose-500" : ""}`} />
        </button>
      </div>
      <div className="p-4">
        <Link href={`/properties/${property.id}`} className="hover:underline">
          <h3 className="font-medium text-base line-clamp-1">{property.title}</h3>
        </Link>
        <p className="text-sm text-neutral-500 mt-1">{property.location}</p>
        <div className="flex items-center gap-2 mt-2 text-sm">
          <span>
            {property.bedrooms} {parseInt(property.bedrooms) === 1 ? translate("bed") : translate("beds")}
          </span>
          {property.floor && (
            <>
              <span>•</span>
              <span>{property.floor} {translate('floor')}</span>
            </>
          )}
          {property.squareMeters && (
            <>
              <span>•</span>
              <span>{property.squareMeters} m²</span>
            </>
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
                {amenity}
              </span>
            ))}
            {property.amenities.length > 3 && (
              <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                +{property.amenities.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
