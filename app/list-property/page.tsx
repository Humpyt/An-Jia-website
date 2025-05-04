"use client"

import Link from "next/link"
import Image from "next/image"
import { Button, type ButtonProps } from "@/components/ui/button"
import { Footer } from "@/components/footer"
import { LanguageSwitcher, useLanguage } from "@/components/language-switcher"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ListPropertyForm } from "@/components/list-property-form"
import { PageHeader } from "@/components/page-header"

export default function ListPropertyPage() {
  const { translate } = useLanguage()

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/50">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="An Jia You Xuan" width={150} height={50} priority className="h-10 w-auto" />
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link href="/properties" className="text-sm font-medium hover:text-rose-500 transition-colors">
              {translate("properties")}
            </Link>
            <span className="text-sm font-medium text-neutral-400 opacity-50 cursor-not-allowed">
              {translate("neighborhoods")}
            </span>
            <Link href="/about" className="text-sm font-medium hover:text-rose-500 transition-colors">
              {translate("about")}
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <Button
              variant="outline"
              size="sm"
              className="hidden md:flex hover:bg-rose-50 text-rose-500"
              asChild
            >
              <Link href="/list-property">{translate("list_property")}</Link>
            </Button>
          </div>
        </div>
      </header>
      <PageHeader
        title="List Your Property"
        description="Join thousands of property owners who trust An Jia You Xuan"
        height="medium"
      />

      <main className="flex-1">

        <section className="py-12 md:py-16">
          <div className="container">
            <div className="grid md:grid-cols-2 gap-12 items-start">
              <div>
                <h2 className="text-2xl font-bold mb-6">{translate("why_list_with_us")}</h2>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 h-12 w-12 rounded-full bg-rose-100 flex items-center justify-center text-rose-500">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                        <circle cx="12" cy="12" r="10" />
                        <path d="m9 12 2 2 4-4" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">{translate("verified_tenants")}</h3>
                      <p className="text-neutral-600">
                        {translate("verified_tenants_description")}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 h-12 w-12 rounded-full bg-rose-100 flex items-center justify-center text-rose-500">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                        <path d="m9 12 2 2 4-4" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">{translate("secure_platform")}</h3>
                      <p className="text-neutral-600">
                        {translate("secure_platform_description")}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 h-12 w-12 rounded-full bg-rose-100 flex items-center justify-center text-rose-500">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                        <path d="M19 4v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1-2-2h10a2 2 0 0 1-2 2Z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">{translate("comprehensive_tools")}</h3>
                      <p className="text-neutral-600">
                        {translate("comprehensive_tools_description")}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 h-12 w-12 rounded-full bg-rose-100 flex items-center justify-center text-rose-500">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                        <path d="M3 3v18h18" />
                        <path d="m19 9-5 5-4-4-3 3" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">{translate("performance_analytics")}</h3>
                      <p className="text-neutral-600">
                        {translate("performance_analytics_description")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="bg-white rounded-xl border border-neutral-200 shadow-lg overflow-hidden">
                  <div className="p-6 bg-rose-500 text-white">
                    <h2 className="text-xl font-bold">{translate("list_property")}</h2>
                    <p className="text-rose-100 mt-1">{translate("get_started")}</p>
                  </div>
                  <div className="p-6">
                    <div className="w-full max-w-[800px]">
                      <Tabs defaultValue="form" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-8">
                          <TabsTrigger value="form">{translate("property_form")}</TabsTrigger>
                          <TabsTrigger value="bulk">{translate("bulk_upload")}</TabsTrigger>
                        </TabsList>
                        <TabsContent value="form">
                          <ListPropertyForm />
                        </TabsContent>
                        <TabsContent value="bulk" className="space-y-4">
                          <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-8 text-center space-y-4">
                            <Image
                              src="/images/upload-template.png"
                              alt="Bulk upload template"
                              width={200}
                              height={200}
                              className="mx-auto"
                            />
                            <div className="space-y-2">
                              <h3 className="font-semibold">{translate("download_template")}</h3>
                              <p className="text-sm text-muted-foreground max-w-[400px]">
                                {translate("download_template_description")}
                              </p>
                            </div>
                            <div className="flex gap-3">
                              <Button
                                variant="outline"
                                type="button"
                                onClick={() => {
                                  // Add download logic
                                }}
                              >
                                {translate("download_template_button")}
                              </Button>
                              <Button
                                type="button"
                                onClick={() => {
                                  // Add upload logic
                                }}
                              >
                                {translate("upload_file_button")}
                              </Button>
                            </div>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16 bg-neutral-50">
          <div className="container">
            <h2 className="text-2xl font-bold text-center mb-12">{translate("what_hosts_say")}</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-12 w-12 rounded-full bg-neutral-200 flex items-center justify-center text-neutral-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-6 w-6"
                    >
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold">Sarah Johnson</h3>
                    <p className="text-sm text-neutral-500">Property Owner in Kololo</p>
                  </div>
                </div>
                <p className="text-neutral-600">
                  "I've been listing my properties with An Jia You Xuan for over a year now. The platform is easy to use
                  and I've found quality tenants quickly. The support team is always responsive."
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-12 w-12 rounded-full bg-neutral-200 flex items-center justify-center text-neutral-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-6 w-6"
                    >
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold">Michael Okello</h3>
                    <p className="text-sm text-neutral-500">Agency Owner</p>
                  </div>
                </div>
                <p className="text-neutral-600">
                  "As a property management agency, we need reliable tools. An Jia You Xuan's bulk upload feature and
                  analytics dashboard have streamlined our operations significantly."
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-12 w-12 rounded-full bg-neutral-200 flex items-center justify-center text-neutral-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-6 w-6"
                    >
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold">Lisa Nakato</h3>
                    <p className="text-sm text-neutral-500">First-time Landlord</p>
                  </div>
                </div>
                <p className="text-neutral-600">
                  "As a first-time landlord, I was nervous about finding good tenants. The An Jia You Xuan team guided
                  me through the entire process and I found a great tenant within two weeks!"
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
