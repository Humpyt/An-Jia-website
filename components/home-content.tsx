"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PropertyCategories } from "@/components/property-categories"
import { FeaturedProperties } from "@/components/featured-properties"
import { SearchBar } from "@/components/search-bar"
import { NeighborhoodShowcase } from "@/components/neighborhood-showcase"
import { useLanguage } from "@/components/language-switcher"
import { ImportedPropertiesShowcase } from "@/components/imported-properties-showcase"
import Image from 'next/image';

export function HomeContent() {
  const { translate } = useLanguage()
  
  return (
    <>
      <section className="relative py-20 text-white">
        {/* Background image with overlay */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/images/04/WhatsApp Image 2025-04-09 at 11.37.58 AM (2).jpeg" 
            alt="Kampala Skyline" 
            fill 
            className="object-cover"
            priority
            sizes="100vw"
            quality={80}
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="mb-6 text-4xl font-bold md:text-5xl lg:text-6xl">{translate("find_your_perfect_home")}</h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-slate-300">
            {translate("discover_best_properties")}
          </p>
          <div className="mx-auto max-w-4xl">
            <SearchBar />
          </div>
        </div>
      </section>

      <PropertyCategories />
      <FeaturedProperties />
      <ImportedPropertiesShowcase />
      <NeighborhoodShowcase />

      <section className="py-16 md:py-24 bg-rose-50">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-6">{translate("become_host")}</h2>
              <p className="text-lg text-neutral-600 mb-6">
                {translate("list_your_property")}
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3">
                  <div className="h-6 w-6 rounded-full bg-rose-100 flex items-center justify-center text-rose-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                    >
                      <path d="m5 12 5 5L20 7" />
                    </svg>
                  </div>
                  <span>{translate("free_listing_creation")}</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="h-6 w-6 rounded-full bg-rose-100 flex items-center justify-center text-rose-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                    >
                      <path d="m5 12 5 5L20 7" />
                    </svg>
                  </div>
                  <span>{translate("powerful_property_management_dashboard")}</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="h-6 w-6 rounded-full bg-rose-100 flex items-center justify-center text-rose-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                    >
                      <path d="m5 12 5 5L20 7" />
                    </svg>
                  </div>
                  <span>{translate("direct_connection_with_potential_tenants")}</span>
                </li>
              </ul>
              <Button size="lg" className="bg-rose-500 hover:bg-rose-600 text-white" asChild>
                <Link href="/list-property">{translate("start_hosting")}</Link>
              </Button>
            </div>
            <div className="relative">
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-yellow-400 rounded-lg opacity-20"></div>
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-rose-400 rounded-lg opacity-20"></div>
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/05/WhatsApp Image 2025-04-09 at 11.40.25 AM.jpeg"
                  alt="Kampala apartment"
                  width={600}
                  height={450}
                  className="w-full h-auto object-cover aspect-[4/3]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
