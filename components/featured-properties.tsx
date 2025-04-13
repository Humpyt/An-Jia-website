"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import { properties } from "@/lib/property-data"
import { useLanguage } from "@/components/language-switcher"

// Select a few properties to feature
const featuredProperties = properties
  .filter(p => p.isPremium)
  .slice(0, 4);

export function FeaturedProperties() {
  const [favorites, setFavorites] = useState<string[]>([])
  const { translate } = useLanguage()

  const toggleFavorite = (id: string) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter((favId) => favId !== id))
    } else {
      setFavorites([...favorites, id])
    }
  }

  return (
    <section className="py-12">
      <div className="container">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight">{translate("featured_properties")}</h2>
          <p className="mt-2 text-muted-foreground">{translate("discover_premium")}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProperties.map((property) => (
            <Card key={property.id} className="overflow-hidden border-0 shadow-lg rounded-xl">
              <div className="relative">
                <Link href={`/properties/${property.id}`}>
                  <div className="aspect-square overflow-hidden relative">
                    <Image
                      src={property.images[0] || "/placeholder.svg"}
                      alt={property.title}
                      fill
                      className="object-cover transition-transform hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                  </div>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm hover:bg-white/90 rounded-full shadow-sm"
                  onClick={() => toggleFavorite(property.id)}
                >
                  <Heart className={`h-5 w-5 ${favorites.includes(property.id) ? "fill-rose-500 text-rose-500" : ""}`} />
                  <span className="sr-only">Add to favorites</span>
                </Button>
                {property.isPremium && (
                  <Badge className="absolute top-3 left-3 bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-500 hover:to-rose-500 text-white border-0">
                    Premium
                  </Badge>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <Link href={`/properties/${property.id}`} className="hover:underline">
                    <h3 className="font-medium text-base line-clamp-1">{property.title}</h3>
                  </Link>
                  <div className="flex items-center gap-1 text-sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-4 h-4 text-amber-500"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>{(4.5 + (parseInt(property.id) % 5) * 0.1).toFixed(2)}</span>
                    <span className="text-neutral-400">({10 + (parseInt(property.id) % 20)})</span>
                  </div>
                </div>
                <p className="text-sm text-neutral-500 mt-1">{property.location}</p>
                <div className="flex items-center gap-2 mt-2 text-sm">
                  <span>
                    {property.bedrooms} {parseInt(property.bedrooms) === 1 ? translate("bed") : translate("beds")}
                  </span>
                  <span>•</span>
                  <span>
                    {Math.floor(parseInt(property.bedrooms) * 0.75)} {Math.floor(parseInt(property.bedrooms) * 0.75) === 1 ? translate("bath") : translate("baths")}
                  </span>
                </div>
                <div className="mt-3">
                  <span className="font-semibold">${property.price}</span>
                  <span className="text-neutral-500 text-sm"> /{property.paymentTerms.toLowerCase()}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Button asChild size="lg" className="bg-rose-500 hover:bg-rose-600 text-white">
            <Link href="/properties">
              {translate("view_all_properties")}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="ml-2 h-4 w-4"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
