"use client"

import { useState } from "react"
import { MapPin } from "lucide-react"

interface PropertyMapProps {
  properties: any[]
}

export function PropertyMap({ properties }: PropertyMapProps) {
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null)

  return (
    <div className="grid md:grid-cols-[1fr_350px] gap-6 h-[600px]">
      <div className="relative rounded-lg overflow-hidden border bg-muted">
        {/* This would be replaced with an actual Google Maps integration */}
        <div className="absolute inset-0 bg-muted flex items-center justify-center">
          <div className="text-center p-6">
            <img
              src="/placeholder.svg?height=600&width=800&text=Google+Maps+Integration"
              alt="Map of Kampala properties"
              className="w-full h-auto rounded-lg mb-4"
            />
            <p className="text-muted-foreground">Google Maps integration would display property pins here</p>
          </div>
        </div>

        {/* Property markers - these would be positioned on the actual map */}
        <div className="hidden">
          {properties.map((property) => (
            <button
              key={property.id}
              className="absolute p-1 bg-primary text-white rounded-full"
              style={{
                left: `${Math.random() * 80 + 10}%`,
                top: `${Math.random() * 80 + 10}%`,
              }}
              onClick={() => setSelectedProperty(property.id)}
            >
              <MapPin className="h-4 w-4" />
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-auto h-full border rounded-lg p-4">
        <h3 className="font-medium mb-4">Properties in Kampala</h3>
        <div className="grid gap-4">
          {properties.map((property) => {
            // Find the primary image or use the first one
            const primaryImage = property.property_images.find((img: any) => img.is_primary)
            const imageUrl = primaryImage
              ? primaryImage.image_url
              : property.property_images.length > 0
                ? property.property_images[0].image_url
                : "/placeholder.svg?height=400&width=400"

            return (
              <div
                key={property.id}
                className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                  selectedProperty === property.id ? "border-primary bg-primary/5" : ""
                }`}
                onClick={() => setSelectedProperty(property.id)}
              >
                <div className="flex gap-3">
                  <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
                    <img
                      src={imageUrl || "/placeholder.svg"}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">{property.title}</h4>
                    <p className="text-xs text-muted-foreground">{property.location}</p>
                    <div className="flex items-center gap-2 mt-1 text-xs">
                      <span>{property.bedrooms} bed</span>
                      <span>•</span>
                      <span>{property.bathrooms} bath</span>
                    </div>
                    <p className="font-medium mt-1">
                      {property.currency === "USD" ? "$" : "UGX"} {property.price.toLocaleString()}
                      <span className="text-xs text-muted-foreground">/mo</span>
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
