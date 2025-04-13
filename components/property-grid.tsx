"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"

interface PropertyGridProps {
  properties: any[]
}

export function PropertyGrid({ properties }: PropertyGridProps) {
  const [savedProperties, setSavedProperties] = useState<string[]>([])

  if (!properties || properties.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h3 className="text-xl font-semibold mb-2">No properties found</h3>
        <p className="text-neutral-500">Try adjusting your filters or check back later for new listings.</p>
      </div>
    )
  }

  const handleSaveProperty = (propertyId: string) => {
    setSavedProperties(prev => 
      prev.includes(propertyId) 
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId]
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {properties.map((property) => {
        // Use the first image from the images array
        const imageUrl = property.images?.[0] || "/placeholder.svg?height=400&width=400"

        return (
          <div
            key={property.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
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
                <span className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-semibold">
                  Premium
                </span>
              )}
              <button
                onClick={() => handleSaveProperty(property.id)}
                className="absolute top-2 left-2 bg-white p-1.5 rounded-full shadow-md"
                aria-label={savedProperties.includes(property.id) ? "Remove from saved" : "Save property"}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill={savedProperties.includes(property.id) ? "currentColor" : "none"}
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={savedProperties.includes(property.id) ? "text-red-500" : "text-gray-500"}
                >
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                </svg>
              </button>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-1 truncate">{property.title}</h3>
              <p className="text-gray-600 text-sm mb-2 truncate">{property.location}</p>
              <div className="flex justify-between items-center mb-3">
                <span className="text-lg font-bold text-primary">
                  {property.currency || "UGX"} {parseInt(property.price).toLocaleString()}
                </span>
                <span className="text-sm text-gray-500">{property.paymentTerms || ""}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                {property.bedrooms && (
                  <div className="flex items-center gap-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M2 9V4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5" />
                      <path d="M2 11v5a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v2H6v-2a2 2 0 0 0-4 0Z" />
                      <path d="M4 18v2" />
                      <path d="M20 18v2" />
                      <path d="M12 4v9" />
                    </svg>
                    <span>{property.bedrooms}</span>
                  </div>
                )}
                {property.bathrooms && (
                  <div className="flex items-center gap-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1-.5C4.683 3 4 3.683 4 4.5V17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5" />
                      <line x1="10" x2="8" y1="5" y2="7" />
                      <line x1="2" x2="22" y1="12" y2="12" />
                      <line x1="7" x2="7" y1="19" y2="21" />
                      <line x1="17" x2="17" y1="19" y2="21" />
                    </svg>
                    <span>{Math.floor(parseInt(property.bedrooms) * 0.75)}</span>
                  </div>
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
              <Link
                href={`/properties/${property.id}`}
                className="block w-full mt-4 text-center bg-primary text-white py-2 rounded hover:bg-primary-dark transition-colors"
              >
                View Details
              </Link>
            </div>
          </div>
        )
      })}
    </div>
  )
}
