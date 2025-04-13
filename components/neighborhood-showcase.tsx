"use client"

import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"
import { neighborhoods } from "@/lib/property-data"
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

export function NeighborhoodShowcase() {
  const { translate } = useLanguage();
  
  return (
    <section className="py-12 bg-white">
      <div className="container">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight">{translate("explore_kampala_neighborhoods")}</h2>
          <p className="mt-2 text-muted-foreground">{translate("find_ideal_home")}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {neighborhoods.map((neighborhood, index) => (
            <Link key={neighborhood.id} href={`/neighborhoods/${neighborhood.id}`}>
              <Card className="overflow-hidden border-0 shadow-lg rounded-xl h-full transition-transform hover:scale-[1.02]">
                <div className="aspect-[4/3] relative">
                  <Image
                    src={propertyImages[index % propertyImages.length]}
                    alt={neighborhood.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    quality={75}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-4 text-white">
                    <h3 className="text-xl font-bold">{neighborhood.name}</h3>
                    <p className="text-sm text-white/80">{neighborhood.count} {translate("properties")}</p>
                  </div>
                </div>
                <CardContent className="p-4">
                  <p className="text-sm text-neutral-600">
                    {neighborhood.id === "naguru" && translate("naguru_description")}
                    {neighborhood.id === "kololo" && translate("kololo_description")}
                    {neighborhood.id === "bukoto" && translate("bukoto_description")}
                    {neighborhood.id === "bugolobi" && translate("bugolobi_description")}
                    {neighborhood.id === "ntinda" && translate("ntinda_description")}
                    {neighborhood.id === "mutungo" && translate("mutungo_description")}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
