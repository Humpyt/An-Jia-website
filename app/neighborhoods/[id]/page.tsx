"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PropertyCard } from "@/components/property-card"
import { ArrowLeft, Building, Car, Coffee, MapPin, School, ShoppingBag, Utensils } from "lucide-react"
import { useLanguage } from "@/components/language-switcher"
import { LanguageSwitcher } from "@/components/language-switcher"

// Mock data for neighborhoods
const neighborhoods = {
  kololo: {
    name: "Kololo",
    description:
      "Kololo is an upscale residential area known for embassies, luxury homes, and proximity to the city center. It's one of Kampala's most prestigious neighborhoods, offering stunning views, excellent security, and a range of high-end amenities. The area is popular among expatriates, diplomats, and affluent locals.",
    image: "/images/03/WhatsApp Image 2025-04-09 at 11.36.23 AM.jpeg",
    coordinates: { lat: 0.3333, lng: 32.5833 },
    averagePrice: 1200,
    properties: 24,
    amenities: [
      { name: "Restaurants", icon: Utensils, count: 15 },
      { name: "Cafes", icon: Coffee, count: 8 },
      { name: "Shopping", icon: ShoppingBag, count: 6 },
      { name: "Schools", icon: School, count: 4 },
      { name: "Parking", icon: Car, count: "Available" },
    ],
    highlights: [
      "Prestigious embassy district",
      "Panoramic city views",
      "High-end shopping options",
      "Premium security services",
      "International schools nearby",
      "Exclusive residential area",
    ],
    propertyTypes: [
      { type: "Apartments", percentage: 50 },
      { type: "Houses", percentage: 40 },
      { type: "Villas", percentage: 5 },
      { type: "Townhouses", percentage: 5 },
    ],
  },
  naguru: {
    name: "Naguru",
    description:
      "Naguru is a prestigious neighborhood with beautiful views, modern apartments, and a growing expat community. Located on one of Kampala's hills, it offers a balance of residential tranquility and urban convenience. The area has seen significant development in recent years with new apartment complexes and commercial establishments.",
    image: "/images/03/WhatsApp Image 2025-04-09 at 11.36.25 AM (1).jpeg",
    coordinates: { lat: 0.3378, lng: 32.6011 },
    averagePrice: 950,
    properties: 18,
    amenities: [
      { name: "Restaurants", icon: Utensils, count: 10 },
      { name: "Cafes", icon: Coffee, count: 5 },
      { name: "Shopping", icon: ShoppingBag, count: 4 },
      { name: "Schools", icon: School, count: 3 },
      { name: "Parking", icon: Car, count: "Limited" },
    ],
    highlights: [
      "Panoramic views of Kampala",
      "Naguru Hospital nearby",
      "Mixed residential and commercial area",
      "Growing number of apartment complexes",
      "Close to Kampala's industrial area",
      "Diverse international community",
    ],
    propertyTypes: [
      { type: "Apartments", percentage: 60 },
      { type: "Houses", percentage: 30 },
      { type: "Villas", percentage: 5 },
      { type: "Townhouses", percentage: 5 },
    ],
  },
  bukoto: {
    name: "Bukoto",
    description:
      "Bukoto is a vibrant area with a mix of residential and commercial properties, popular among young professionals. It offers a more affordable alternative to Kololo while still providing good amenities and accessibility. The neighborhood has a lively atmosphere with restaurants, shops, and entertainment options.",
    image: "/images/03/WhatsApp Image 2025-04-09 at 11.36.26 AM.jpeg",
    coordinates: { lat: 0.3456, lng: 32.5978 },
    averagePrice: 800,
    properties: 15,
    amenities: [
      { name: "Restaurants", icon: Utensils, count: 12 },
      { name: "Cafes", icon: Coffee, count: 7 },
      { name: "Shopping", icon: ShoppingBag, count: 5 },
      { name: "Schools", icon: School, count: 2 },
      { name: "Parking", icon: Car, count: "Available" },
    ],
    highlights: [
      "Central location with easy access to downtown",
      "Vibrant nightlife and restaurant scene",
      "Mix of apartments and standalone houses",
      "Popular with young professionals",
      "Good public transportation connections",
      "Several international schools nearby",
    ],
    propertyTypes: [
      { type: "Apartments", percentage: 55 },
      { type: "Houses", percentage: 35 },
      { type: "Villas", percentage: 5 },
      { type: "Townhouses", percentage: 5 },
    ],
  },
  muyenga: {
    name: "Muyenga",
    description:
      "Muyenga, known as 'Tank Hill', offers breathtaking views of Lake Victoria and upscale housing options. This prestigious area combines luxury living with a serene environment, making it popular among both local and international residents. The neighborhood features modern amenities and excellent infrastructure.",
    image: "/images/04/WhatsApp Image 2025-04-09 at 11.37.57 AM.jpeg",
    coordinates: { lat: 0.3012, lng: 32.6133 },
    averagePrice: 1100,
    properties: 20,
    amenities: [
      { name: "Restaurants", icon: Utensils, count: 8 },
      { name: "Cafes", icon: Coffee, count: 6 },
      { name: "Shopping", icon: ShoppingBag, count: 3 },
      { name: "Schools", icon: School, count: 2 },
      { name: "Parking", icon: Car, count: "Available" },
    ],
    highlights: [
      "Panoramic views of Lake Victoria",
      "Upscale residential area",
      "Modern infrastructure",
      "Secure neighborhood",
      "Close to diplomatic missions",
      "Family-friendly environment",
    ],
    propertyTypes: [
      { type: "Houses", percentage: 50 },
      { type: "Apartments", percentage: 30 },
      { type: "Villas", percentage: 15 },
      { type: "Townhouses", percentage: 5 },
    ],
  },
  ntinda: {
    name: "Ntinda",
    description:
      "Ntinda is a rapidly developing suburb that offers a perfect blend of residential comfort and urban convenience. The area features numerous shopping centers, schools, and recreational facilities. It's an ideal choice for families and professionals seeking a balanced lifestyle.",
    image: "/images/04/WhatsApp Image 2025-04-09 at 11.37.58 AM (1).jpeg",
    coordinates: { lat: 0.3489, lng: 32.6194 },
    averagePrice: 700,
    properties: 22,
    amenities: [
      { name: "Restaurants", icon: Utensils, count: 10 },
      { name: "Cafes", icon: Coffee, count: 5 },
      { name: "Shopping", icon: ShoppingBag, count: 8 },
      { name: "Schools", icon: School, count: 5 },
      { name: "Parking", icon: Car, count: "Available" },
    ],
    highlights: [
      "Developing commercial hub",
      "Affordable housing options",
      "Multiple shopping centers",
      "Good schools and education facilities",
      "Growing entertainment scene",
      "Well-connected transport links",
    ],
    propertyTypes: [
      { type: "Apartments", percentage: 45 },
      { type: "Houses", percentage: 40 },
      { type: "Townhouses", percentage: 10 },
      { type: "Villas", percentage: 5 },
    ],
  },
  bugolobi: {
    name: "Bugolobi",
    description:
      "Bugolobi is a quiet, upscale residential area that offers a perfect balance of comfort and convenience. Close to both the industrial area and city center, it provides excellent amenities while maintaining a peaceful atmosphere. The neighborhood is known for its good security and family-friendly environment.",
    image: "/images/05/WhatsApp Image 2025-04-09 at 11.40.23 AM.jpeg",
    coordinates: { lat: 0.3167, lng: 32.6167 },
    averagePrice: 900,
    properties: 16,
    amenities: [
      { name: "Restaurants", icon: Utensils, count: 8 },
      { name: "Cafes", icon: Coffee, count: 4 },
      { name: "Shopping", icon: ShoppingBag, count: 5 },
      { name: "Schools", icon: School, count: 3 },
      { name: "Parking", icon: Car, count: "Available" },
    ],
    highlights: [
      "Peaceful residential environment",
      "Close to industrial area",
      "Good security",
      "Family-friendly neighborhood",
      "Modern shopping facilities",
      "Easy access to city center",
    ],
    propertyTypes: [
      { type: "Houses", percentage: 45 },
      { type: "Apartments", percentage: 40 },
      { type: "Townhouses", percentage: 10 },
      { type: "Villas", percentage: 5 },
    ],
  },
}

// Mock properties data filtered by neighborhood
function getNeighborhoodProperties(neighborhoodId: string) {
  // This would be replaced with actual filtered data from a database
  return [
    {
      id: "1",
      title: "Modern Apartment in " + neighborhoods[neighborhoodId as keyof typeof neighborhoods].name,
      location: neighborhoods[neighborhoodId as keyof typeof neighborhoods].name + ", Kampala",
      price: Math.floor(neighborhoods[neighborhoodId as keyof typeof neighborhoods].averagePrice * 1.1),
      currency: "USD" as const,
      bedrooms: 2,
      bathrooms: 2,
      imageUrl: "/images/01/WhatsApp Image 2025-04-09 at 11.34.14 AM.jpeg",
      amenities: ["Wifi", "Parking", "Generator", "Security"],
      isPremium: true,
    },
    {
      id: "2",
      title: "Cozy Studio in " + neighborhoods[neighborhoodId as keyof typeof neighborhoods].name,
      location: neighborhoods[neighborhoodId as keyof typeof neighborhoods].name + ", Kampala",
      price: Math.floor(neighborhoods[neighborhoodId as keyof typeof neighborhoods].averagePrice * 0.8),
      currency: "USD" as const,
      bedrooms: 1,
      bathrooms: 1,
      imageUrl: "/images/02/WhatsApp Image 2025-04-09 at 11.35.44 AM.jpeg",
      amenities: ["Wifi", "Security"],
    },
    {
      id: "3",
      title: "Family Home in " + neighborhoods[neighborhoodId as keyof typeof neighborhoods].name,
      location: neighborhoods[neighborhoodId as keyof typeof neighborhoods].name + ", Kampala",
      price: Math.floor(neighborhoods[neighborhoodId as keyof typeof neighborhoods].averagePrice * 1.3),
      currency: "USD" as const,
      bedrooms: 3,
      bathrooms: 2,
      imageUrl: "/images/01/WhatsApp Image 2025-04-09 at 11.34.15 AM (1).jpeg",
      amenities: ["Wifi", "Parking", "Generator", "Security", "Garden"],
      isPremium: true,
    },
  ]
}

// Define the props type for the page component
type NeighborhoodPageProps = {
  params: { id: string }
  searchParams?: { [key: string]: string | string[] | undefined }
}

// Page component for displaying neighborhood details
export default function NeighborhoodPage({ params }: NeighborhoodPageProps) {
  const { translate } = useLanguage()
  const neighborhoodId = params.id
  const neighborhood = neighborhoods[neighborhoodId as keyof typeof neighborhoods]

  if (!neighborhood) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">{translate("neighborhood_not_found")}</h1>
        <p className="mb-8">{translate("neighborhood_not_found_description")}</p>
        <Button asChild>
          <Link href="/neighborhoods">{translate("view_all_neighborhoods")}</Link>
        </Button>
      </div>
    )
  }

  const properties = getNeighborhoodProperties(neighborhoodId)

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
            <span className="hidden sm:inline-block">KampalaStay</span>
            <span className="sm:hidden">KS</span>
          </Link>
          <div className="hidden md:flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/properties">{translate("properties")}</Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/neighborhoods">{translate("neighborhoods")}</Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/about">{translate("about")}</Link>
            </Button>
            <LanguageSwitcher />
            <Button variant="outline" size="sm">{translate("sign_in")}</Button>
            <Button size="sm">{translate("sign_up")}</Button>
          </div>
          <Button variant="outline" size="icon" className="md:hidden">
            <MapPin className="h-4 w-4" />
            <span className="sr-only">{translate("menu")}</span>
          </Button>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero section */}
        <section className="relative h-[300px] md:h-[400px]">
          <div className="absolute inset-0">
            <Image
              src={neighborhood.image || "/placeholder.svg"}
              alt={neighborhood.name}
              fill
              className="object-cover brightness-[0.7]"
            />
          </div>
          <div className="absolute inset-0 flex items-center">
            <div className="container">
              <Button variant="outline" size="sm" className="mb-4 bg-background/80" asChild>
                <Link href="/neighborhoods">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {translate("back_to_neighborhoods")}
                </Link>
              </Button>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{neighborhood.name}</h1>
              <div className="flex items-center text-white/90 text-sm md:text-base">
                <Building className="h-4 w-4 mr-1" />
                <span>{neighborhood.properties} {translate("properties")}</span>
                <span className="mx-2">•</span>
                <span>{translate("avg")} ${neighborhood.averagePrice}/{translate("mo")}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Neighborhood details */}
        <section className="py-8">
          <div className="container">
            <Tabs defaultValue="overview">
              <TabsList className="w-full md:w-auto grid grid-cols-3 md:inline-flex">
                <TabsTrigger value="overview">{translate("overview")}</TabsTrigger>
                <TabsTrigger value="properties">{translate("properties")}</TabsTrigger>
                <TabsTrigger value="map">{translate("map")}</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6">
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="md:col-span-2">
                    <h2 className="text-2xl font-semibold mb-4">{translate("about")} {neighborhood.name}</h2>
                    <p className="text-muted-foreground mb-6">{translate(`${neighborhoodId}_full_description`)}</p>

                    <h3 className="text-xl font-semibold mb-3">{translate("highlights")}</h3>
                    <ul className="grid sm:grid-cols-2 gap-2 mb-6">
                      {neighborhood.highlights.map((highlight, index) => (
                        <li key={index} className="flex items-start">
                          <div className="mr-2 h-1.5 w-1.5 mt-2 rounded-full bg-primary" />
                          {translate(`${neighborhoodId}_highlight_${index + 1}`)}
                        </li>
                      ))}
                    </ul>

                    <h3 className="text-xl font-semibold mb-3">{translate("property_types")}</h3>
                    <div className="grid sm:grid-cols-2 gap-4 mb-6">
                      {neighborhood.propertyTypes.map((propertyType, index) => (
                        <div key={index} className="flex flex-col">
                          <div className="flex items-center justify-between mb-1">
                            <span>{translate(propertyType.type.toLowerCase())}</span>
                            <span className="text-sm text-muted-foreground">{propertyType.percentage}%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full"
                              style={{ width: `${propertyType.percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Card>
                      <CardContent className="p-6">
                        <h3 className="text-lg font-semibold mb-4">{translate("amenities")}</h3>
                        <div className="space-y-4">
                          {neighborhood.amenities.map((amenity, index) => (
                            <div key={index} className="flex items-center justify-between">
                              <div className="flex items-center">
                                <amenity.icon className="h-5 w-5 mr-3 text-muted-foreground" />
                                <span>{translate(amenity.name.toLowerCase())}</span>
                              </div>
                              <span className="text-sm text-muted-foreground">{amenity.count}</span>
                            </div>
                          ))}
                        </div>

                        <div className="mt-6 pt-6 border-t">
                          <h3 className="text-lg font-semibold mb-4">{translate("transportation")}</h3>
                          <div className="space-y-2 text-sm">
                            <p>• {translate("distance_to_city_center")}</p>
                            <p>• {translate("boda_services")}</p>
                            <p>• {translate("taxi_stages")}</p>
                            <p>• {translate("road_infrastructure")}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="properties" className="mt-6">
                <h2 className="text-2xl font-semibold mb-6">
                  {translate("properties_in")} {neighborhood.name}
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {properties.map((property) => (
                    <PropertyCard key={property.id} {...property} />
                  ))}
                </div>
                <div className="mt-8 text-center">
                  <Button asChild>
                    <Link href={`/properties?location=${neighborhood.name}`}>
                      {translate("view_all_properties_in")} {neighborhood.name}
                    </Link>
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="map" className="mt-6">
                <h2 className="text-2xl font-semibold mb-4">
                  {neighborhood.name} {translate("map")}
                </h2>
                <div className="aspect-[16/9] relative rounded-lg overflow-hidden border">
                  <iframe
                    src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15959.03350731166!2d${neighborhood.coordinates.lng}!3d${neighborhood.coordinates.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x177dbb0932c4e799%3A0x9c9b31a466e6a7d!2s${neighborhood.name}%2C%20Kampala%2C%20Uganda!5e0!3m2!1sen!2sus!4v1712688000000!5m2!1sen!2sus`}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
                <div className="mt-4 text-sm text-muted-foreground">
                  {translate("map_showing")} {neighborhood.name} {translate("area_in_kampala")}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Nearby neighborhoods */}
        <section className="py-8 bg-muted/50">
          <div className="container">
            <h2 className="text-2xl font-semibold mb-6">{translate("nearby_neighborhoods")}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(neighborhoods)
                .filter(([id]) => id !== neighborhoodId)
                .slice(0, 3)
                .map(([id, data]) => (
                  <Card key={id} className="overflow-hidden">
                    <div className="aspect-[16/9] relative">
                      <Image src={data.image || "/placeholder.svg"} alt={data.name} fill className="object-cover" />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg">{data.name}</h3>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {translate(`${id}_description`)}
                      </p>
                      <Button variant="outline" asChild className="w-full">
                        <Link href={`/neighborhoods/${id}`}>{translate("explore")} {data.name}</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col md:flex-row justify-between gap-4 md:h-16 md:items-center">
          <p className="text-sm text-muted-foreground">© 2025 KampalaStay. {translate("all_rights_reserved")}</p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <Link href="#" className="hover:underline">
              {translate("terms")}
            </Link>
            <Link href="#" className="hover:underline">
              {translate("privacy")}
            </Link>
            <Link href="#" className="hover:underline">
              {translate("contact")}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
