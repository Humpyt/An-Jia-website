"use client"

import React from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Phone, Mail, MapPin, MessageSquare } from "lucide-react"
import { LanguageSwitcher, useLanguage } from "@/components/language-switcher"
import { Footer } from "@/components/footer"
import { NavLinks } from "@/components/nav-links"
import { AuthButtons } from "@/components/auth-buttons"
import { PageHeader } from "@/components/page-header"

export default function ContactPage() {
  const { translate } = useLanguage()

  // Use a key to force re-render when language changes
  const renderKey = React.useMemo(() => Math.random().toString(36), []);

  return (
    <div className="flex min-h-screen flex-col" key={renderKey}>
      <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/50">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="An Jia You Xuan" width={150} height={50} priority className="h-10 w-auto" />
          </Link>
          <NavLinks />
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <AuthButtons />
          </div>
        </div>
      </header>

      <PageHeader
        title="CONTACT US"
        description="Get in touch with our professional team for property inquiries"
        height="medium"
        imagePath="/images/headers/modern-office-reception.jpg"
      />

      <main className="flex-1">
        <section className="py-16 bg-neutral-50">
          <div className="container">
            <div className="max-w-5xl mx-auto">
              <h1 className="text-3xl md:text-4xl font-bold text-center mb-12 tracking-tight">
                HOW TO <span className="text-primary">REACH US</span>
              </h1>

              <div className="grid md:grid-cols-5 gap-10">
                {/* Contact Information */}
                <div className="md:col-span-3">
                  <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-neutral-100">
                    <div className="p-8 bg-gradient-to-r from-primary/5 to-primary/10">
                      <h2 className="text-2xl font-bold text-center mb-8 uppercase tracking-wide">{translate("contact_information") || "CONTACT INFORMATION"}</h2>

                      <div className="space-y-6">
                        <div className="flex items-start gap-5 bg-white p-6 rounded-lg shadow-sm">
                          <div className="mt-1 bg-primary/10 p-3 rounded-full">
                            <MapPin className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold mb-2 text-lg uppercase tracking-wide">{translate("address") || "ADDRESS"}</h3>
                            <p className="text-neutral-700 font-medium">
                              Victoria Garden International Apartments
                              <br />
                              Naguru, Kampala, Uganda
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-5 bg-white p-6 rounded-lg shadow-sm">
                          <div className="mt-1 bg-primary/10 p-3 rounded-full">
                            <Phone className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold mb-2 text-lg uppercase tracking-wide">{translate("phone") || "TELEPHONE"}</h3>
                            <p className="text-neutral-700 font-medium">+256 767 199955</p>
                            <p className="text-neutral-700 font-medium">+256 741 668586</p>
                            <p className="text-neutral-700 font-medium">+256 758 765092</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-5 bg-white p-6 rounded-lg shadow-sm">
                          <div className="mt-1 bg-primary/10 p-3 rounded-full">
                            <Mail className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold mb-2 text-lg uppercase tracking-wide">{translate("email") || "EMAIL"}</h3>
                            <p className="text-neutral-700 font-medium">karungistellahmaris120@gmail.com</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-5 bg-white p-6 rounded-lg shadow-sm">
                          <div className="mt-1 bg-primary/10 p-3 rounded-full">
                            <MessageSquare className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold mb-2 text-lg uppercase tracking-wide">{translate("wechat") || "WECHAT"}</h3>
                            <p className="text-neutral-700 font-medium">anjiayouxuan</p>
                            <p className="text-neutral-700 font-medium">wm785436</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-8 bg-white">
                      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                        <Button size="lg" className="gap-2 bg-primary hover:bg-primary/90 text-white font-medium px-6 py-6" asChild>
                          <a href="tel:+256767199955">
                            <Phone className="h-5 w-5" />
                            <span className="tracking-wide">CONTACT BY TELEPHONE</span>
                          </a>
                        </Button>
                        <Button size="lg" className="gap-2 border-primary/20 hover:border-primary/40 font-medium px-6 py-6" variant="outline" asChild>
                          <a href="mailto:karungistellahmaris120@gmail.com">
                            <Mail className="h-5 w-5" />
                            <span className="tracking-wide">SEND EMAIL INQUIRY</span>
                          </a>
                        </Button>
                      </div>

                      <div className="text-center text-sm text-neutral-600 font-medium">
                        <p className="uppercase">{translate("business_hours") || "BUSINESS HOURS"}: 9:00 AM - 6:00 PM (Monday - Saturday)</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Map/Image Section */}
                <div className="md:col-span-2">
                  <div className="bg-white rounded-xl shadow-lg overflow-hidden h-full border border-neutral-100">
                    <div className="relative h-56 md:h-72">
                      <Image
                        src="/images/03/WhatsApp Image 2025-04-09 at 11.36.25 AM (1).jpeg"
                        alt="Naguru, Kampala"
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 40vw"
                      />
                      <div className="absolute inset-0 bg-black/20"></div>
                      <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/80 to-transparent">
                        <h3 className="text-white font-semibold text-lg uppercase tracking-wide">Victoria Garden International</h3>
                        <p className="text-white/90 text-sm font-medium">Naguru, Kampala</p>
                      </div>
                    </div>
                    <div className="p-7">
                      <h3 className="font-semibold text-lg mb-3 uppercase tracking-wide">{translate("about_location") || "ABOUT OUR LOCATION"}</h3>
                      <p className="text-neutral-700 mb-5 leading-relaxed">
                        Victoria Garden International Apartments are located in Naguru, one of Kampala's most prestigious neighborhoods, offering beautiful panoramic views and modern luxury amenities.
                      </p>
                      <div className="mt-5">
                        <h4 className="font-medium text-sm text-neutral-600 mb-3 uppercase tracking-wide">{translate("nearby_amenities") || "NEARBY AMENITIES"}</h4>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div className="flex items-center gap-2 bg-primary/5 p-2 rounded">
                            <div className="w-2 h-2 rounded-full bg-primary"></div>
                            <span className="font-medium">Restaurants</span>
                          </div>
                          <div className="flex items-center gap-2 bg-primary/5 p-2 rounded">
                            <div className="w-2 h-2 rounded-full bg-primary"></div>
                            <span className="font-medium">Shopping</span>
                          </div>
                          <div className="flex items-center gap-2 bg-primary/5 p-2 rounded">
                            <div className="w-2 h-2 rounded-full bg-primary"></div>
                            <span className="font-medium">Hospitals</span>
                          </div>
                          <div className="flex items-center gap-2 bg-primary/5 p-2 rounded">
                            <div className="w-2 h-2 rounded-full bg-primary"></div>
                            <span className="font-medium">Schools</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}