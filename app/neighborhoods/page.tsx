import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { LanguageSwitcher } from "@/components/language-switcher"
import { Footer } from "@/components/footer"

const neighborhoods = [
  {
    id: "kololo",
    name: "Kololo",
    description: "An upscale residential area known for embassies, luxury homes, and proximity to the city center.",
    image: "/placeholder.svg?height=300&width=500",
    properties: 24,
    averagePrice: 1200,
  },
  {
    id: "naguru",
    name: "Naguru",
    description: "A prestigious neighborhood with beautiful views, modern apartments, and a growing expat community.",
    image: "/placeholder.svg?height=300&width=500",
    properties: 18,
    averagePrice: 950,
  },
  {
    id: "bukoto",
    name: "Bukoto",
    description:
      "A vibrant area with a mix of residential and commercial properties, popular among young professionals.",
    image: "/placeholder.svg?height=300&width=500",
    properties: 15,
    averagePrice: 800,
  },
  {
    id: "muyenga",
    name: "Muyenga",
    description: "Known as 'Tank Hill', offering panoramic views of Lake Victoria and upscale housing options.",
    image: "/placeholder.svg?height=300&width=500",
    properties: 20,
    averagePrice: 1100,
  },
  {
    id: "ntinda",
    name: "Ntinda",
    description: "A rapidly developing suburb with good amenities, shopping centers, and affordable housing.",
    image: "/placeholder.svg?height=300&width=500",
    properties: 22,
    averagePrice: 700,
  },
  {
    id: "bugolobi",
    name: "Bugolobi",
    description: "A quiet, upscale residential area with good security, close to the industrial area.",
    image: "/placeholder.svg?height=300&width=500",
    properties: 16,
    averagePrice: 900,
  },
]

export default function NeighborhoodsPage() {
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
            <Link href="/neighborhoods" className="text-sm font-medium text-rose-500">
              Neighborhoods
            </Link>
            <Link href="/about" className="text-sm font-medium hover:text-rose-500 transition-colors">
              About
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <Button variant="ghost" size="sm" className="hidden md:flex hover:bg-rose-50 hover:text-rose-500" asChild>
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
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="bg-rose-50 py-10 md:py-16">
          <div className="container">
            <div className="max-w-3xl">
              <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Kampala Neighborhoods</h1>
              <p className="mt-4 text-neutral-600">
                Explore Kampala's diverse neighborhoods and find the perfect area for your next home. Each neighborhood
                has its own unique character, amenities, and rental options.
              </p>
            </div>
          </div>
        </section>
        <section className="py-10">
          <div className="container">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {neighborhoods.map((neighborhood) => (
                <Card key={neighborhood.id} className="overflow-hidden border-0 shadow-lg rounded-xl">
                  <div className="aspect-[16/9] relative">
                    <img
                      src={neighborhood.image || "/placeholder.svg"}
                      alt={neighborhood.name}
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 p-4 text-white">
                      <h3 className="text-xl font-bold">{neighborhood.name}</h3>
                      <p className="text-sm text-white/80">{neighborhood.properties} properties</p>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-neutral-500">Average price</span>
                      <span className="font-semibold">${neighborhood.averagePrice}/mo</span>
                    </div>
                    <p className="text-sm text-neutral-600 mb-4">{neighborhood.description}</p>
                    <Button asChild className="w-full bg-rose-500 hover:bg-rose-600 text-white">
                      <Link href={`/neighborhoods/${neighborhood.id}`}>View Properties</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        <section className="py-10 bg-neutral-50">
          <div className="container">
            <div className="grid gap-8 md:grid-cols-2 items-center">
              <div>
                <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Find Your Perfect Location</h2>
                <p className="mt-4 text-neutral-600">
                  Not sure which neighborhood is right for you? Our local experts can help you find the perfect location
                  based on your preferences, budget, and lifestyle.
                </p>
                <div className="mt-6 flex flex-col sm:flex-row gap-4">
                  <Button className="bg-rose-500 hover:bg-rose-600 text-white">Contact an Expert</Button>
                  <Button variant="outline">Compare Neighborhoods</Button>
                </div>
              </div>
              <div className="relative aspect-video rounded-lg overflow-hidden">
                <img
                  src="/placeholder.svg?height=400&width=600"
                  alt="Kampala skyline"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
