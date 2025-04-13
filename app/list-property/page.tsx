import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Footer } from "@/components/footer"
import { LanguageSwitcher } from "@/components/language-switcher"
import { ListPropertyForm } from "@/components/list-property-form"

export default function ListPropertyPage() {
  return (
    <div className="flex min-h-screen flex-col">
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
            <Button variant="ghost" size="sm" className="hidden md:flex hover:bg-rose-50 text-rose-500" asChild>
              <Link href="/list-property">List your property</Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full border-neutral-200 shadow-sm gap-2 hidden md:flex hover:border-neutral-300"
            >
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
                <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
                <path d="M3 9V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4" />
                <path d="M13 13h4" />
                <path d="M13 17h4" />
                <path d="M9 13h.01" />
                <path d="M9 17h.01" />
              </svg>
              Sign in
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full md:hidden hover:bg-rose-50 hover:text-rose-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </svg>
              <span className="sr-only">Menu</span>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="bg-rose-50 py-12 md:py-20">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">List Your Property with An Jia You Xuan</h1>
              <p className="text-lg text-neutral-600">
                Join thousands of property owners who trust An Jia You Xuan to connect them with quality tenants
              </p>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="container">
            <div className="grid md:grid-cols-2 gap-12 items-start">
              <div>
                <h2 className="text-2xl font-bold mb-6">Why List with An Jia You Xuan?</h2>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 h-12 w-12 rounded-full bg-rose-100 flex items-center justify-center text-rose-500">
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
                        <circle cx="12" cy="12" r="10" />
                        <path d="m9 12 2 2 4-4" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Verified Tenants</h3>
                      <p className="text-neutral-600">
                        We verify all tenant profiles to ensure you're connecting with reliable renters.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 h-12 w-12 rounded-full bg-rose-100 flex items-center justify-center text-rose-500">
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
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                        <path d="m9 12 2 2 4-4" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Secure Platform</h3>
                      <p className="text-neutral-600">
                        Our platform includes secure messaging and payment processing for peace of mind.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 h-12 w-12 rounded-full bg-rose-100 flex items-center justify-center text-rose-500">
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
                        <path d="M5.5 20H8M12 20h2.5M17 20h1.5M17 4H7M17 8H7" />
                        <path d="M12 12H7M12 16H7" />
                        <path d="M19 4v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2Z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Comprehensive Listing Tools</h3>
                      <p className="text-neutral-600">
                        Create detailed listings with photos, virtual tours, and all the information tenants need.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 h-12 w-12 rounded-full bg-rose-100 flex items-center justify-center text-rose-500">
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
                        <path d="M3 3v18h18" />
                        <path d="m19 9-5 5-4-4-3 3" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Performance Analytics</h3>
                      <p className="text-neutral-600">
                        Track views, inquiries, and engagement with your property listings through our detailed
                        analytics.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 p-6 bg-neutral-50 rounded-xl border border-neutral-100">
                  <h3 className="text-lg font-semibold mb-4">Listing Plans</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-4 border-b">
                      <div>
                        <h4 className="font-medium">Basic</h4>
                        <p className="text-sm text-neutral-500">List up to 3 properties</p>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-xl">Free</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pb-4 border-b">
                      <div>
                        <h4 className="font-medium">Premium</h4>
                        <p className="text-sm text-neutral-500">Enhanced visibility, featured listings</p>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-xl">$10</span>
                        <span className="text-sm text-neutral-500">/month</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Agency</h4>
                        <p className="text-sm text-neutral-500">For professional property managers</p>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-xl">$50</span>
                        <span className="text-sm text-neutral-500">/month</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="bg-white rounded-xl border border-neutral-200 shadow-lg overflow-hidden">
                  <div className="p-6 bg-rose-500 text-white">
                    <h2 className="text-xl font-bold">List Your Property</h2>
                    <p className="text-rose-100 mt-1">Fill out the form below to get started</p>
                  </div>
                  <div className="p-6">
                    <ListPropertyForm />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16 bg-neutral-50">
          <div className="container">
            <h2 className="text-2xl font-bold text-center mb-12">What Our Hosts Say</h2>
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
