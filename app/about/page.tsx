import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building, CheckCircle2, CreditCard, Globe, Home, MapPin, Search, Shield, Users } from "lucide-react"
import { LanguageSwitcher } from "@/components/language-switcher"
import { Footer } from "@/components/footer"

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="An Jia You Xuan" width={150} height={50} priority className="h-10 w-auto" />
          </Link>
          <div className="hidden md:flex items-center gap-4">
            <Link href="/properties" className="text-sm font-medium hover:text-rose-500 transition-colors">
              Properties
            </Link>
            <Link href="/neighborhoods" className="text-sm font-medium hover:text-rose-500 transition-colors">
              Neighborhoods
            </Link>
            <Link href="/about" className="text-sm font-medium text-rose-500">
              About
            </Link>
            <LanguageSwitcher />
            <Button variant="ghost" size="sm" asChild>
              <Link href="/list-property">List your property</Link>
            </Button>
            <Button variant="outline" size="sm">
              Sign In
            </Button>
          </div>
          <Button variant="outline" size="icon" className="md:hidden">
            <Search className="h-4 w-4" />
            <span className="sr-only">Menu</span>
          </Button>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero section */}
        <section className="relative py-20 md:py-28 bg-primary/5">
          <div className="container">
            <div className="max-w-3xl">
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
                Connecting Kampala's Renters with Their Perfect Home
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                An Jia You Xuan is an Airbnb-inspired rental platform focused exclusively on Kampala's housing market,
                where property owners can list available units and potential tenants can find their ideal home.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild>
                  <Link href="/properties">Browse Properties</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/neighborhoods">Explore Neighborhoods</Link>
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
                <h2 className="text-3xl font-bold tracking-tight mb-6">Our Mission</h2>
                <p className="text-lg text-muted-foreground mb-6">
                  An Jia You Xuan was founded with a simple mission: to make finding and renting properties in Kampala
                  simple, transparent, and enjoyable. We believe that everyone deserves a place they can call home, and
                  we're committed to connecting renters with their perfect match.
                </p>
                <p className="text-lg text-muted-foreground mb-6">
                  Our platform brings together property owners, agents, and tenants in one place, creating a vibrant
                  marketplace that serves the unique needs of Kampala's housing market.
                </p>
                <div className="flex items-center gap-2 text-primary font-medium">
                  <CheckCircle2 className="h-5 w-5" />
                  <span>Trusted by hundreds of property owners and tenants</span>
                </div>
              </div>
              <div className="relative aspect-video rounded-lg overflow-hidden">
                <Image
                  src="/placeholder.svg?height=400&width=600"
                  alt="Kampala skyline"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Target users section */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold tracking-tight mb-4">Who We Serve</h2>
              <p className="text-lg text-muted-foreground">
                An Jia You Xuan is designed to meet the needs of everyone involved in Kampala's rental market.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <Users className="h-10 w-10 text-primary mb-2" />
                  <CardTitle>Property Seekers</CardTitle>
                  <CardDescription>Individuals and families looking for their next home in Kampala</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5" />
                      <span>Easy search with advanced filters</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5" />
                      <span>Detailed property information</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5" />
                      <span>Neighborhood guides</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5" />
                      <span>Direct contact with owners/agents</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Home className="h-10 w-10 text-primary mb-2" />
                  <CardTitle>Property Owners</CardTitle>
                  <CardDescription>Individuals who own residential properties in Kampala</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5" />
                      <span>Free basic listings</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5" />
                      <span>Property management dashboard</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5" />
                      <span>Inquiry management</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5" />
                      <span>Performance analytics</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Building className="h-10 w-10 text-primary mb-2" />
                  <CardTitle>Real Estate Agencies</CardTitle>
                  <CardDescription>Professional agencies managing multiple properties</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5" />
                      <span>Bulk property uploads</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5" />
                      <span>Team management</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5" />
                      <span>Advanced analytics</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5" />
                      <span>Agency profile page</span>
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
              <h2 className="text-3xl font-bold tracking-tight mb-4">Key Features</h2>
              <p className="text-lg text-muted-foreground">
                An Jia You Xuan offers a comprehensive set of features designed to make property rental in Kampala
                seamless and efficient.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Search className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Advanced Search & Filters</h3>
                    <p className="text-muted-foreground">
                      Find exactly what you're looking for with our powerful search tools. Filter by location, price,
                      bedrooms, amenities, and more.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Neighborhood Guides</h3>
                    <p className="text-muted-foreground">
                      Detailed information about Kampala's neighborhoods to help you make informed decisions about where
                      to live.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Globe className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Google Maps Integration</h3>
                    <p className="text-muted-foreground">
                      See exactly where properties are located and explore the surrounding area with integrated maps.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <CreditCard className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Currency Flexibility</h3>
                    <p className="text-muted-foreground">
                      Toggle between UGX and USD to view prices in your preferred currency.
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
                    <h3 className="text-xl font-semibold mb-2">Verified Listings</h3>
                    <p className="text-muted-foreground">
                      All properties undergo a verification process to ensure accuracy and reliability of information.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Building className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Rich Property Details</h3>
                    <p className="text-muted-foreground">
                      Comprehensive information about each property, including high-quality photos, amenities, and
                      detailed descriptions.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Direct Contact</h3>
                    <p className="text-muted-foreground">
                      Connect directly with property owners or agents through WhatsApp or phone calls for quick
                      responses.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Home className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Owner Dashboard</h3>
                    <p className="text-muted-foreground">
                      Property owners get access to a powerful dashboard to manage listings and track performance.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Business model section */}
        <section className="py-16 md:py-24 bg-primary/5">
          <div className="container">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold tracking-tight mb-4">Our Business Model</h2>
              <p className="text-lg text-muted-foreground">
                An Jia You Xuan offers flexible options to meet the needs of different users.
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Free Listings</CardTitle>
                  <CardDescription>Basic tier</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold mb-6">$0</p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5" />
                      <span>List up to 3 properties</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5" />
                      <span>Basic analytics</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5" />
                      <span>Standard visibility</span>
                    </li>
                  </ul>
                  <Button className="w-full mt-6" variant="outline">
                    Get Started
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-primary">
                <CardHeader>
                  <CardTitle>Premium Listings</CardTitle>
                  <CardDescription>Enhanced visibility</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold mb-6">
                    $10<span className="text-sm font-normal">/month</span>
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5" />
                      <span>Top placement in search results</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5" />
                      <span>Featured on homepage</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5" />
                      <span>Detailed analytics</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5" />
                      <span>Premium badge</span>
                    </li>
                  </ul>
                  <Button className="w-full mt-6">Upgrade Now</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Agency Package</CardTitle>
                  <CardDescription>For professional agencies</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold mb-6">
                    $50<span className="text-sm font-normal">/month</span>
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5" />
                      <span>List 20+ properties</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5" />
                      <span>Bulk upload tool</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5" />
                      <span>Team management</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5" />
                      <span>Advanced analytics</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5" />
                      <span>Agency profile page</span>
                    </li>
                  </ul>
                  <Button className="w-full mt-6" variant="outline">
                    Contact Sales
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA section */}
        <section className="py-16 md:py-24">
          <div className="container">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold tracking-tight mb-4">Ready to Find Your Perfect Home?</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Join An Jia You Xuan today and discover the best rental properties Kampala has to offer.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button size="lg" asChild>
                  <Link href="/properties">Browse Properties</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/list-property">List Your Property</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
