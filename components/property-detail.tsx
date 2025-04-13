"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Bed, Bath, ArrowLeft, Heart, ChevronLeft, ChevronRight } from "lucide-react"
import { LanguageSwitcher, useLanguage } from "@/components/language-switcher"

export default function PropertyDetail({ property }: { property: any }) {
  const [isSaved, setIsSaved] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const { translate } = useLanguage()

  const formatPrice = (price: string, currency: string) => {
    if (currency === "UGX") {
      return `UGX ${parseInt(price).toLocaleString()}`
    }
    return `$${price}`
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
    <>
      <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/50">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="An Jia You Xuan" width={150} height={50} priority className="h-10 w-auto" />
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link href="/properties" className="text-sm font-medium hover:text-rose-500 transition-colors">
              Properties
            </Link>
            <Link href="/neighborhoods" className="text-sm font-medium hover:text-rose-500 transition-colors">
              Neighborhoods
            </Link>
            <Link href="/about" className="text-sm font-medium hover:text-rose-500 transition-colors">
              About
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <Button variant="ghost" size="sm" className="hidden md:flex hover:bg-rose-50 hover:text-rose-500" asChild>
              <Link href="/list-property">List your property</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="container py-8">
          <Button variant="ghost" size="sm" className="mb-6" asChild>
            <Link href="/properties" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              {translate("back_to_properties")}
            </Link>
          </Button>

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
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

              <div className="mt-6 grid gap-4 grid-cols-4">
                {property.images.map((image: string, index: number) => (
                  <div 
                    key={index} 
                    className={`aspect-video relative overflow-hidden rounded-lg cursor-pointer ${currentImageIndex === index ? 'ring-2 ring-rose-500' : ''}`}
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

              <div className="mt-8">
                <h1 className="text-3xl font-bold">{property.title}</h1>
                <div className="mt-2 flex items-center gap-2 text-neutral-500">
                  <MapPin className="h-4 w-4" />
                  {property.location}
                </div>

                <div className="mt-4 flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Bed className="h-5 w-5 text-neutral-500" />
                    <span>
                      {property.bedrooms} {parseInt(property.bedrooms) === 1 ? translate("bed") : translate("beds")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bath className="h-5 w-5 text-neutral-500" />
                    <span>
                      {Math.floor(parseInt(property.bedrooms) * 0.75)}{" "}
                      {Math.floor(parseInt(property.bedrooms) * 0.75) === 1 ? translate("bath") : translate("baths")}
                    </span>
                  </div>
                </div>

                <div className="mt-6">
                  <h2 className="text-xl font-semibold">{translate("description")}</h2>
                  <p className="mt-2 text-neutral-600 whitespace-pre-line">{property.description}</p>
                </div>

                <div className="mt-6">
                  <h2 className="text-xl font-semibold">{translate("amenities")}</h2>
                  <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {property.amenities.map((amenity: string) => (
                      <div
                        key={amenity}
                        className="flex items-center gap-2 p-2 rounded-lg bg-neutral-50"
                      >
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
                          className="h-4 w-4 text-neutral-500"
                        >
                          <polyline points="9 11 12 14 22 4" />
                          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                        </svg>
                        {amenity}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="text-2xl">
                    {formatPrice(property.price, property.currency)}
                    {property.paymentTerms && (
                      <span className="text-base font-normal text-neutral-500 ml-1">
                        /{property.paymentTerms.toLowerCase()}
                      </span>
                    )}
                  </CardTitle>
                  <CardDescription>Contact the agent for more details</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold">{property.agents.name}</h3>
                      <p className="text-sm text-neutral-500">{property.agents.company}</p>
                    </div>
                    <div className="space-y-2">
                      <Button className="w-full" size="lg">
                        {translate("contact_agent")}
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full"
                        size="lg"
                        onClick={() => setIsSaved(!isSaved)}
                      >
                        <Heart
                          className={`mr-2 h-4 w-4 ${isSaved ? "fill-current text-rose-500" : ""}`}
                        />
                        {isSaved ? translate("saved") : translate("save_property")}
                      </Button>
                    </div>
                    <div className="text-sm text-neutral-500">
                      <p>Phone: {property.agents.phone}</p>
                      <p>Email: {property.agents.email}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
