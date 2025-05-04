"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building, CheckCircle2, CreditCard, Globe, Home, MapPin, Search, Shield, Users } from "lucide-react"
import { useLanguage } from "@/components/language-switcher"

export function AboutContent() {
  const { translate } = useLanguage()

  return (
    <main className="flex-1">
      {/* Hero section */}
      <section className="relative py-20 md:py-28 bg-primary/5">
        <div className="container">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
              {translate("about_hero_title")}
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              {translate("about_hero_description")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild>
                <Link href="/properties">{translate("browse_properties")}</Link>
              </Button>
              <Button size="lg" variant="outline" disabled className="opacity-50 cursor-not-allowed">
                {translate("explore_neighborhoods")}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Mission section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-6">{translate("our_mission")}</h2>
              <p className="text-lg text-muted-foreground mb-6">
                {translate("mission_description_1")}
              </p>
              <p className="text-lg text-muted-foreground mb-6">
                {translate("mission_description_2")}
              </p>
              <div className="flex items-center gap-2 text-primary font-medium">
                <CheckCircle2 className="h-5 w-5" />
                <span>{translate("trusted_by_many")}</span>
              </div>
            </div>
            <div className="relative aspect-video rounded-lg overflow-hidden shadow-lg">
              <Image
                src="/images/04/WhatsApp Image 2025-04-09 at 11.37.57 AM (2).jpeg"
                alt="Beautiful house interior"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Target users section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">{translate("who_we_serve")}</h2>
            <p className="text-lg text-muted-foreground">
              {translate("who_we_serve_description")}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Users className="h-10 w-10 text-primary mb-2" />
                <CardTitle>{translate("property_seekers")}</CardTitle>
                <CardDescription>{translate("property_seekers_description")}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <span>{translate("easy_search")}</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <span>{translate("detailed_property_info")}</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <span>{translate("neighborhood_guides")}</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <span>{translate("direct_contact")}</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Home className="h-10 w-10 text-primary mb-2" />
                <CardTitle>{translate("property_owners")}</CardTitle>
                <CardDescription>{translate("property_owners_description")}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <span>{translate("free_listings")}</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <span>{translate("property_management")}</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <span>{translate("inquiry_management")}</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <span>{translate("performance_analytics")}</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Building className="h-10 w-10 text-primary mb-2" />
                <CardTitle>{translate("real_estate_agencies")}</CardTitle>
                <CardDescription>{translate("agencies_description")}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <span>{translate("bulk_uploads")}</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <span>{translate("team_management")}</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <span>{translate("advanced_analytics")}</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <span>{translate("agency_profile")}</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Key features section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">{translate("key_features")}</h2>
            <p className="text-lg text-muted-foreground">
              {translate("key_features_description")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="flex-shrink-0 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Search className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{translate("advanced_search")}</h3>
                  <p className="text-muted-foreground">
                    {translate("advanced_search_description")}
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{translate("neighborhood_guides_feature")}</h3>
                  <p className="text-muted-foreground">
                    {translate("neighborhood_guides_description")}
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Globe className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{translate("maps_integration")}</h3>
                  <p className="text-muted-foreground">
                    {translate("maps_integration_description")}
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <CreditCard className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{translate("currency_flexibility")}</h3>
                  <p className="text-muted-foreground">
                    {translate("currency_flexibility_description")}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="flex-shrink-0 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{translate("verified_listings")}</h3>
                  <p className="text-muted-foreground">
                    {translate("verified_listings_description")}
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Building className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{translate("rich_property_details")}</h3>
                  <p className="text-muted-foreground">
                    {translate("rich_property_details_description")}
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{translate("direct_contact_feature")}</h3>
                  <p className="text-muted-foreground">
                    {translate("direct_contact_description")}
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Home className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{translate("owner_dashboard")}</h3>
                  <p className="text-muted-foreground">
                    {translate("owner_dashboard_description")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight mb-4">{translate("ready_to_find_home")}</h2>
            <p className="text-lg text-muted-foreground mb-8">
              {translate("join_today")}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/properties">{translate("browse_properties")}</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/list-property">{translate("list_your_property")}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
