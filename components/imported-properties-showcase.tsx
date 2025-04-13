"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { MapPin, Bed, Bath, ArrowRight } from "lucide-react"
import { properties } from "@/lib/property-data"

// Select properties for showcase (different from featured properties)
const showcaseProperties = properties
  .filter(p => p.bedrooms && parseInt(p.bedrooms) >= 2)
  .slice(5, 11);

export function ImportedPropertiesShowcase() {
  const [displayProperties, setDisplayProperties] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setDisplayProperties(showcaseProperties);
      setLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  const formatPrice = (price: string, currency: string) => {
    if (currency === "UGX") {
      return `UGX ${parseInt(price).toLocaleString()}`
    }
    return `$${price}`
  }

  if (loading) {
    return (
      <div className="py-12">
        <div className="container">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold tracking-tight">Latest Properties</h2>
            <p className="mt-2 text-muted-foreground">Discover our newest listings in Kampala</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="aspect-video relative">
                    <Skeleton className="h-full w-full" />
                  </div>
                  <CardHeader className="p-4">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2 mt-2" />
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <Skeleton className="h-4 w-1/3" />
                    <div className="mt-4 flex items-center gap-4">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Skeleton className="h-10 w-full" />
                  </CardFooter>
                </Card>
              ))}
          </div>
        </div>
      </div>
    )
  }

  if (displayProperties.length === 0) {
    return null
  }

  return (
    <div className="py-12 bg-slate-50">
      <div className="container">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight">Latest Properties</h2>
          <p className="mt-2 text-muted-foreground">Discover our newest listings in Kampala</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {displayProperties.map((property) => {
            // Use first image in the array
            const imageUrl = property.images[0] || "/placeholder.svg?height=200&width=300"

            return (
              <Card key={property.id} className="overflow-hidden group">
                <div className="aspect-video relative overflow-hidden">
                  <img
                    src={imageUrl}
                    alt={property.title}
                    className="object-cover w-full h-full transition-transform group-hover:scale-105"
                  />
                  {property.isPremium && <Badge className="absolute top-2 right-2 bg-yellow-500">Premium</Badge>}
                </div>
                <CardHeader className="p-4">
                  <CardTitle className="line-clamp-1">{property.title}</CardTitle>
                  <CardDescription className="flex items-center">
                    <MapPin className="mr-1 h-3 w-3" />
                    {property.location}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="font-bold text-lg">
                    {formatPrice(property.price, property.currency)}
                    {property.paymentTerms && (
                      <span className="text-sm font-normal text-muted-foreground ml-1">
                        /{property.paymentTerms.toLowerCase()}
                      </span>
                    )}
                  </div>
                  <div className="mt-4 flex items-center gap-4 text-sm">
                    <div className="flex items-center">
                      <Bed className="mr-1 h-4 w-4 text-muted-foreground" />
                      {property.bedrooms} {parseInt(property.bedrooms) === 1 ? "Bedroom" : "Bedrooms"}
                    </div>
                    <div className="flex items-center">
                      <Bath className="mr-1 h-4 w-4 text-muted-foreground" />
                      {Math.floor(parseInt(property.bedrooms) * 0.75)} {Math.floor(parseInt(property.bedrooms) * 0.75) === 1 ? "Bathroom" : "Bathrooms"}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button asChild className="w-full">
                    <Link href={`/properties/${property.id}`}>
                      View Details
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>
        <div className="mt-8 text-center">
          <Button asChild size="lg">
            <Link href="/properties">
              View All Properties
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
