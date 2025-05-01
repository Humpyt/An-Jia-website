"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Bed, Bath, ArrowLeft, Heart, ChevronLeft, ChevronRight } from "lucide-react"
import { LanguageSwitcher, useLanguage } from "@/components/language-switcher"
import CacheControl from "@/components/cache-control"
import type { Property } from "@/app/types/property";

// Extend the Property type to include our new descriptionSummary field
interface ExtendedProperty extends Property {
  descriptionSummary?: string;
}

export default function PropertyDetail({ property }: { property: ExtendedProperty }) {
  const [isSaved, setIsSaved] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const { translate } = useLanguage()

  const formatPrice = (price: string, currency: string) => {
    const numericPrice = parseInt(price)
    if (currency === "UGX") {
      return `UGX ${numericPrice.toLocaleString()}`
    }
    return `$${numericPrice.toLocaleString()}`
  }

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === property.images.length - 1 ? 0 : prevIndex + 1
    )
  }

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? property.images.length - 1 : prevIndex - 1
    )
  }

  const goToImage = (index: number) => {
    setCurrentImageIndex(index)
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="flex-1">
        <div className="container py-8">
          {/* Header with Back Button and Cache Control */}
          <div className="flex items-center justify-between mb-6">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/properties" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                {translate("back_to_properties")}
              </Link>
            </Button>

            {/* Add the cache control button with a tooltip */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {translate("not_seeing_updates")}
              </span>
              <CacheControl />
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Main Image */}
              <div className="aspect-video relative overflow-hidden rounded-lg">
                <Image
                  src={property.images[currentImageIndex] || "/placeholder.svg"}
                  alt={`${property.title} - Image ${currentImageIndex + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                {property.isPremium && (
                  <Badge className="absolute top-4 right-4 bg-yellow-500">Premium</Badge>
                )}

                {/* Navigation buttons */}
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>

                {/* Image counter */}
                <div className="absolute bottom-4 right-4 bg-black/50 text-white px-2 py-1 rounded text-sm">
                  {currentImageIndex + 1} / {property.images.length}
                </div>
              </div>

              {/* Thumbnail grid */}
              <div className="mt-6 grid gap-4 grid-cols-4">
                {property.images.map((image: string, index: number) => (
                  <div
                    key={index}
                    className={`aspect-video relative overflow-hidden rounded-lg cursor-pointer ${currentImageIndex === index ? 'ring-2 ring-primary' : ''}`}
                    onClick={() => goToImage(index)}
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${property.title} - Image ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 25vw, 20vw"
                    />
                  </div>
                ))}
              </div>

              {/* Property Details */}
              <div className="flex items-center gap-4">
                {/* Bedrooms */}
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-white rounded-lg">
                    <Bed className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500">{translate("bedrooms")}</p>
                    <p className="font-semibold">{property.bedrooms}</p>
                  </div>
                </div>

                {/* Bathrooms */}
                {property.bathrooms && (
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-white rounded-lg">
                      <Bath className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-neutral-500">{translate("bathrooms")}</p>
                      <p className="font-semibold">{property.bathrooms}</p>
                    </div>
                  </div>
                )}

                {/* Square Meters */}
                {property.squareMeters && (
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-white rounded-lg">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-5 w-5 text-primary"
                      >
                        <rect width="18" height="18" x="3" y="3" rx="2" />
                        <path d="M3 9h18" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-neutral-500">{translate("area")}</p>
                      <p className="font-semibold">{property.squareMeters} m²</p>
                    </div>
                  </div>
                )}

                {/* Location */}
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-white rounded-lg">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500">{translate("location")}</p>
                    <p className="font-semibold">{property.location}</p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h1 className="text-3xl font-bold">{property.title}</h1>
                <div className="mt-2 flex items-center gap-2">
                  <Badge className="capitalize">{property.propertyType}</Badge>
                  {property.squareMeters && (
                    <span className="text-sm text-neutral-500">{property.squareMeters} m²</span>
                  )}
                </div>
                <div className="mt-2 flex items-center gap-2 text-neutral-500">
                  <MapPin className="h-4 w-4" />
                  {property.location}
                </div>
                {property.googlePin && (
                  <div className="mt-2 flex items-center gap-2 text-neutral-500">
                    <MapPin className="h-4 w-4" />
                    <span>{property.googlePin}</span>
                  </div>
                )}

                <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
                  {/* Always display bedrooms from backend */}
                  <div className="flex items-center gap-2">
                    <Bed className="h-4 w-4 text-neutral-500" />
                    <span>{property.bedrooms} {translate("bedroom")}</span>
                  </div>
                  {/* Always display bathrooms from backend */}
                  <div className="flex items-center gap-2">
                    <Bath className="h-4 w-4 text-neutral-500" />
                    <span>{property.bathrooms || "0"} {translate("bathroom")}</span>
                  </div>
                  {property.units && (
                    <div className="flex items-center gap-2">
                      <span className="text-neutral-500">{property.units} {translate("units")}</span>
                    </div>
                  )}
                </div>

                {/* Property Summary */}
                {property.descriptionSummary && (
                  <div className="mt-6">
                    <h2 className="text-xl font-semibold">{translate("property_summary")}</h2>
                    <div className="mt-2 p-4 bg-primary/5 rounded-lg border border-primary/10 text-neutral-700 font-medium">
                      {property.descriptionSummary}
                    </div>
                  </div>
                )}

                {/* Full Description Section */}
                {property.description && (
                  <div className="mt-6">
                    <h2 className="text-xl font-semibold">{translate("description")}</h2>
                    <div
                      className="mt-2 text-neutral-600 property-description"
                      dangerouslySetInnerHTML={{ __html: property.description }}
                    />
                  </div>
                )}

                {/* Amenities Section */}
                {property.amenities && property.amenities.length > 0 && (
                  <div className="mt-6">
                    <h2 className="text-xl font-semibold">{translate("amenities")}</h2>
                    <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                      {property.amenities.map((amenity: string) => (
                        <div
                          key={amenity}
                          className="flex items-center gap-2 p-2 rounded-lg bg-neutral-50 hover:bg-neutral-100 transition-colors"
                        >
                          <div className="p-1 bg-white rounded">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-4 w-4 text-primary"
                            >
                              <polyline points="9 11 12 14 22 4" />
                              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                            </svg>
                          </div>
                          <span className="font-medium">{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="text-2xl">
                    {formatPrice(property.price, property.currency)}
                    {property.paymentTerms && (
                      <span className="text-base font-normal text-neutral-500 ml-1">
                        /{property.paymentTerms?.toLowerCase()}
                      </span>
                    )}
                  </CardTitle>
                  <CardDescription>Contact the agent for more details</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold">{property.ownerName || translate('property_owner')}</h3>
                      <p className="text-sm text-neutral-500">{translate('contact_for_details')}</p>
                    </div>
                    <div className="space-y-2">
                      <Button className="w-full" size="lg" asChild>
                        <a href="tel:+256707507465">+256 707 507 465 / +256 782 528 269</a>
                      </Button>
                    </div>
                    {property.ownerContact && (
                      <div className="text-sm text-neutral-500">
                        <p>{translate('contact')}: {property.ownerContact}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
