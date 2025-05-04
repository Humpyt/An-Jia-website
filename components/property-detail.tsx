"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Bed, Bath, ArrowLeft, Heart, ChevronLeft, ChevronRight, Check } from "lucide-react"
import { LanguageSwitcher, useLanguage } from "@/components/language-switcher"
import CacheControl from "@/components/cache-control"
import type { Property } from "@/app/types/property";

// No description summary field needed anymore
export default function PropertyDetail({ property }: { property: Property }) {
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
                  <Badge className="absolute top-4 right-4 bg-yellow-500">{translate("premium")}</Badge>
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
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Bed className="h-5 w-5 text-neutral-500" />
                      <span className="text-neutral-500">{property.bedrooms} {translate("bedrooms")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Bath className="h-5 w-5 text-neutral-500" />
                      <span className="text-neutral-500">{property.bathrooms} {translate("bathrooms")}</span>
                    </div>
                  </div>
                </div>

                {/* Property Summary section removed */}

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
                  <div className="mt-8 overflow-hidden">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] bg-clip-text text-transparent mb-6">
                      {translate("amenities")}
                    </h2>

                    {/* Modern amenities display with animations and hover effects */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {property.amenities.map((amenityKey: string, index: number) => {
                        // Case insensitive matching - convert to lowercase for comparison
                        const normalizedKey = amenityKey.toLowerCase();

                        // Beautiful display names mapping with proper capitalization
                        const amenityDisplayNames: Record<string, string> = {
                          'wifi': 'WiFi',
                          'parking': 'Parking',
                          'security': '24/7 Security',
                          'swimming_pool': 'Swimming Pool',
                          'generator': 'Standby Generator',
                          'elevator': 'Elevator',
                          'terrace': 'Terrace',
                          'gym': 'Gym/Fitness Center',
                          'air_conditioning': 'Air Conditioning',
                          'furnished': 'Fully Furnished',
                          'water_tank': 'Water Tank',
                          'cctv': 'CCTV Surveillance',
                          'garden': 'Garden',
                          'balcony': 'Balcony',
                          'solar_power': 'Solar Power',
                          'internet': 'High-Speed Internet',
                          'laundry': 'Laundry Facilities',
                          'playground': 'Children Playground',
                          'bbq': 'BBQ Area',
                          'storage': 'Storage Room'
                        };

                        // Get the display name with fallback formatting
                        const displayName = amenityDisplayNames[normalizedKey] ||
                          normalizedKey.split('_').map(word =>
                            word.charAt(0).toUpperCase() + word.slice(1)
                          ).join(' ');

                        // Enhanced icon set with type definitions
                        type IconComponentType = () => React.ReactElement;

                        // Define all icons with beautiful, consistent styling
                        const amenityIcons: Record<string, IconComponentType> = {
                          'wifi': () => (
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#6366F1]"><path d="M5 13a10 10 0 0 1 14 0"/><path d="M8.5 16.5a5 5 0 0 1 7 0"/><path d="M2 8.82a15 15 0 0 1 20 0"/><line x1="12" x2="12" y1="20" y2="20"/></svg>
                          ),
                          'swimming_pool': () => (
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#6366F1]"><path d="M2 12h1a1 1 0 1 1 0 2H2"/><path d="M6 12h1a1 1 0 1 1 0 2H6"/><path d="M10 12h1a1 1 0 1 1 0 2h-1"/><path d="M14 12h1a1 1 0 1 1 0 2h-1"/><path d="M18 12h1a1 1 0 1 1 0 2h-1"/><path d="M22 12h-1a1 1 0 1 0 0 2h1"/><path d="M22 16v-2"/><path d="M2 16v-2"/><path d="M16 6a2 2 0 1 1 4 0c0 .56-.56 1.35-2 4"/><path d="M12 6a2 2 0 1 1 4 0c0 .56-.56 1.35-2 4"/><path d="M8 6a2 2 0 1 1 4 0c0 .56-.56 1.35-2 4"/><path d="M4 6a2 2 0 1 1 4 0c0 .56-.56 1.35-2 4"/></svg>
                          ),
                          'parking': () => (
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#6366F1]"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 17V7h4a3 3 0 0 1 0 6H9"/></svg>
                          ),
                          'security': () => (
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#6366F1]"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>
                          ),
                          'furnished': () => (
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#6366F1]"><path d="M20 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v3"/><path d="M2 11v5a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v2H6v-2a2 2 0 0 0-4 0Z"/><path d="M4 18v2"/><path d="M20 18v2"/><path d="M12 4v9"/></svg>
                          ),
                          'balcony': () => (
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#6366F1]"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12h12"/><path d="M6 8h12"/><path d="M6 16h12"/><path d="M2 22h20"/></svg>
                          ),
                          'gym': () => (
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#6366F1]"><path d="M6 7H4a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h2V7Z"/><path d="M18 7h2a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-2V7Z"/><path d="M8 7h8"/><path d="M8 17h8"/><path d="M8 7v10"/><path d="M16 7v10"/></svg>
                          ),
                          'garden': () => (
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#6366F1]"><path d="M22 9 A5 3 0 0 1 17 12 A5 3 0 0 1 12 9 A5 3 0 0 1 17 6 A5 3 0 0 1 22 9 z"/><path d="M17 12v6a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-6"/><path d="M12 9 A5 3 0 0 1 7 12 A5 3 0 0 1 2 9 A5 3 0 0 1 7 6 A5 3 0 0 1 12 9 z"/><path d="M12 19v3"/></svg>
                          ),
                          'air_conditioning': () => (
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#6366F1]"><path d="M9.5 21H9a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-.5"/><path d="M3 8h6"/><path d="M15 8h6"/><path d="M7 12h10"/><path d="M5 16h14"/><path d="M9.5 21a.5.5 0 1 1 0-1a.5.5 0 0 1 0 1Z"/><path d="M14.5 21a.5.5 0 1 1 0-1a.5.5 0 0 1 0 1Z"/></svg>
                          ),
                          'cctv': () => (
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#6366F1]"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a3 3 0 0 0-6 0v4"/><path d="M2 7h20"/><path d="M22 7v3a4 4 0 0 1-4 4h-3"/><path d="M2 7v3a4 4 0 0 0 4 4h3"/></svg>
                          ),
                        };

                        // Get icon or use default checkmark
                        const defaultIcon: IconComponentType = () => <Check className="h-6 w-6 text-[#6366F1]" />;
                        const IconComponent = amenityIcons[normalizedKey] || defaultIcon;

                        // Determine animation delay based on index for staggered animation
                        const animationDelay = `${index * 100}ms`;

                        return (
                          <div
                            key={amenityKey}
                            className="relative group overflow-hidden rounded-xl duration-300 animate-fadeIn"
                            style={{ animationDelay }}
                          >
                            {/* Card with gradient border effect */}
                            <div className="absolute inset-0 bg-gradient-to-br from-[#6366F1]/40 to-[#8B5CF6]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />

                            {/* Card content */}
                            <div className="flex items-center gap-3 p-5 bg-[#F8F7FF] group-hover:bg-[#EEEDFF] transition-all duration-300 rounded-xl relative z-10">
                              {/* Icon with pulse effect on hover */}
                              <div className="flex-shrink-0 relative transform group-hover:scale-110 transition-transform duration-300">
                                <div className="absolute inset-0 bg-[#6366F1]/10 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping" />
                                <IconComponent />
                              </div>

                              {/* Amenity name with slide-up animation */}
                              <span className="font-medium text-neutral-800 transform group-hover:translate-x-1 transition-transform duration-300">
                                {displayName}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Add CSS animation keyframes */}
                    <style jsx>{`
                      @keyframes fadeIn {
                        from { opacity: 0; transform: translateY(10px); }
                        to { opacity: 1; transform: translateY(0); }
                      }
                      .animate-fadeIn {
                        animation: fadeIn 0.5s ease-out forwards;
                      }
                    `}</style>
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
