"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useLanguage } from "@/components/language-switcher"

// Define image paths for neighborhoods
const propertyImages = [
  "/images/03/WhatsApp Image 2025-04-09 at 11.36.23 AM.jpeg",
  "/images/03/WhatsApp Image 2025-04-09 at 11.36.25 AM (1).jpeg",
  "/images/03/WhatsApp Image 2025-04-09 at 11.36.26 AM.jpeg",
  "/images/04/WhatsApp Image 2025-04-09 at 11.37.57 AM.jpeg",
  "/images/04/WhatsApp Image 2025-04-09 at 11.37.58 AM (1).jpeg",
  "/images/05/WhatsApp Image 2025-04-09 at 11.40.23 AM.jpeg",
];

const neighborhoods = [
  {
    id: "kololo",
    name: "Kololo",
    description: "An upscale residential area known for embassies, luxury homes, and proximity to the city center.",
    image: propertyImages[0],
    properties: 24,
    averagePrice: 1200,
  },
  {
    id: "naguru",
    name: "Naguru",
    description: "A prestigious neighborhood with beautiful views, modern apartments, and a growing expat community.",
    image: propertyImages[1],
    properties: 18,
    averagePrice: 950,
  },
  {
    id: "bukoto",
    name: "Bukoto",
    description:
      "A vibrant area with a mix of residential and commercial properties, popular among young professionals.",
    image: propertyImages[2],
    properties: 15,
    averagePrice: 800,
  },
  {
    id: "muyenga",
    name: "Muyenga",
    description: "Known as 'Tank Hill', offering panoramic views of Lake Victoria and upscale housing options.",
    image: propertyImages[3],
    properties: 20,
    averagePrice: 1100,
  },
  {
    id: "ntinda",
    name: "Ntinda",
    description: "A rapidly developing suburb with good amenities, shopping centers, and affordable housing.",
    image: propertyImages[4],
    properties: 22,
    averagePrice: 700,
  },
  {
    id: "bugolobi",
    name: "Bugolobi",
    description: "A quiet, upscale neighborhood with good security, close to the industrial area and city center.",
    image: propertyImages[5],
    properties: 16,
    averagePrice: 900,
  },
]

export function NeighborhoodsContent() {
  const { translate } = useLanguage()
  
  return (
    <main className="flex-1">
      <section className="relative py-20 text-white">
        {/* Background image with overlay */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/images/03/WhatsApp Image 2025-04-09 at 11.36.25 AM (1).jpeg" 
            alt="Kampala Neighborhood" 
            fill 
            className="object-cover"
            priority
            sizes="100vw"
            quality={80}
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="container relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-3xl font-bold tracking-tight mb-4 md:text-4xl">
              {translate("discover_neighborhoods")}
            </h1>
            <p className="text-xl text-white/80">
              {translate("neighborhoods_description")}
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {neighborhoods.map((neighborhood) => (
              <Card key={neighborhood.id} className="overflow-hidden">
                <div className="aspect-[4/3] relative">
                  <Image
                    src={neighborhood.image}
                    alt={neighborhood.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    quality={75}
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2">{neighborhood.name}</h3>
                  <p className="text-muted-foreground mb-4">{neighborhood.description}</p>
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <p className="text-sm font-medium">{translate("properties_available")}</p>
                      <p className="text-2xl font-bold">{neighborhood.properties}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{translate("avg_price")}</p>
                      <p className="text-2xl font-bold">${neighborhood.averagePrice}</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" asChild className="flex-1">
                      <Link href={`/properties?neighborhood=${neighborhood.id}`}>
                        {translate("view_properties")}
                      </Link>
                    </Button>
                    <Button asChild className="flex-1">
                      <Link href={`/neighborhoods/${neighborhood.id}`}>
                        {translate("learn_more")}
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
