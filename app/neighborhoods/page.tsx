import { Neighborhood } from "@/app/types/neighborhood"
import Image from "next/image"
import Link from "next/link"
// import { getNeighborhoods } from "@/app/actions/wordpress-neighborhoods"

// Static neighborhood data to use until WordPress API is fixed
const staticNeighborhoods: Neighborhood[] = [
  {
    id: "kololo",
    name: "Kololo",
    description: "Kololo is an upscale residential area known for embassies, luxury homes, and proximity to the city center. It's one of Kampala's most prestigious neighborhoods, offering stunning views, excellent security, and a range of high-end amenities.",
    image: "/images/03/WhatsApp Image 2025-04-09 at 11.36.23 AM.jpeg",
    properties: 24,
    averagePrice: 1200,
    stats: {
      safetyRating: 4.5,
      nearbyAmenities: [],
      transportation: [],
      schoolsFacilities: []
    },
    featuredImage: "/images/03/WhatsApp Image 2025-04-09 at 11.36.23 AM.jpeg",
    propertyCount: 24
  },
  {
    id: "naguru",
    name: "Naguru",
    description: "Naguru is a prestigious neighborhood with beautiful views, modern apartments, and a growing expat community. Located on one of Kampala's hills, it offers a balance of residential tranquility and urban convenience.",
    image: "/images/03/WhatsApp Image 2025-04-09 at 11.36.25 AM (1).jpeg",
    properties: 18,
    averagePrice: 950,
    stats: {
      safetyRating: 4.3,
      nearbyAmenities: [],
      transportation: [],
      schoolsFacilities: []
    },
    featuredImage: "/images/03/WhatsApp Image 2025-04-09 at 11.36.25 AM (1).jpeg",
    propertyCount: 18
  },
  {
    id: "bukoto",
    name: "Bukoto",
    description: "Bukoto is a vibrant area with a mix of residential and commercial properties, popular among young professionals. It offers a more affordable alternative to Kololo while still providing good amenities and accessibility.",
    image: "/images/03/WhatsApp Image 2025-04-09 at 11.36.26 AM.jpeg",
    properties: 15,
    averagePrice: 800,
    stats: {
      safetyRating: 4.0,
      nearbyAmenities: [],
      transportation: [],
      schoolsFacilities: []
    },
    featuredImage: "/images/03/WhatsApp Image 2025-04-09 at 11.36.26 AM.jpeg",
    propertyCount: 15
  },
  {
    id: "muyenga",
    name: "Muyenga",
    description: "Muyenga, known as 'Tank Hill', offers breathtaking views of Lake Victoria and upscale housing options. This prestigious area combines luxury living with a serene environment, making it popular among both local and international residents.",
    image: "/images/04/WhatsApp Image 2025-04-09 at 11.37.57 AM.jpeg",
    properties: 20,
    averagePrice: 1100,
    stats: {
      safetyRating: 4.4,
      nearbyAmenities: [],
      transportation: [],
      schoolsFacilities: []
    },
    featuredImage: "/images/04/WhatsApp Image 2025-04-09 at 11.37.57 AM.jpeg",
    propertyCount: 20
  },
  {
    id: "ntinda",
    name: "Ntinda",
    description: "Ntinda is a rapidly developing suburb that offers a perfect blend of residential comfort and urban convenience. The area features numerous shopping centers, schools, and recreational facilities.",
    image: "/images/04/WhatsApp Image 2025-04-09 at 11.37.58 AM (1).jpeg",
    properties: 22,
    averagePrice: 700,
    stats: {
      safetyRating: 3.9,
      nearbyAmenities: [],
      transportation: [],
      schoolsFacilities: []
    },
    featuredImage: "/images/04/WhatsApp Image 2025-04-09 at 11.37.58 AM (1).jpeg",
    propertyCount: 22
  },
  {
    id: "bugolobi",
    name: "Bugolobi",
    description: "Bugolobi is a quiet, upscale residential area that offers a perfect balance of comfort and convenience. Close to both the industrial area and city center, it provides excellent amenities while maintaining a peaceful atmosphere.",
    image: "/images/05/WhatsApp Image 2025-04-09 at 11.40.23 AM.jpeg",
    properties: 16,
    averagePrice: 900,
    stats: {
      safetyRating: 4.2,
      nearbyAmenities: [],
      transportation: [],
      schoolsFacilities: []
    },
    featuredImage: "/images/05/WhatsApp Image 2025-04-09 at 11.40.23 AM.jpeg",
    propertyCount: 16
  }
];

// Server component to display neighborhoods
export default async function NeighborhoodsPage() {
  // Use static data instead of API call
  console.log('Using static neighborhood data');
  const neighborhoods = staticNeighborhoods;

  // Uncomment this when WordPress API is fixed
  // console.log('Fetching neighborhoods for the page');
  // const neighborhoods = await getNeighborhoods();

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/50">
        <div className="container flex h-16 items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="An Jia You Xuan" className="h-10 w-auto" />
          </a>
          <div className="hidden md:flex items-center gap-6">
            <a href="/properties" className="text-sm font-medium hover:text-rose-500 transition-colors">
              Properties
            </a>
            <a href="/neighborhoods" className="text-sm font-medium text-rose-500">
              Neighborhoods
            </a>
            <a href="/about" className="text-sm font-medium hover:text-rose-500 transition-colors">
              About
            </a>
          </div>
          <div className="flex items-center gap-4">
            {/* Removed list property and sign in buttons */}
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="bg-rose-50 py-10 md:py-16">
          <div className="container">
            <div className="max-w-3xl">
              <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                Discover Kampala's Neighborhoods
              </h1>
              <p className="mt-4 text-neutral-600">
                Explore the diverse neighborhoods of Kampala and find the perfect area for your next home.
              </p>
            </div>
          </div>
        </section>
        <section className="py-10">
          <div className="container">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {neighborhoods.map((neighborhood) => (
                <div key={neighborhood.id} className="overflow-hidden border-0 shadow-lg rounded-xl bg-white">
                  <div className="aspect-[16/9] relative">
                    <Image
                      src={neighborhood.featuredImage || neighborhood.image || "/placeholder.svg"}
                      alt={neighborhood.name}
                      width={600}
                      height={338}
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 p-4 text-white">
                      <h3 className="text-xl font-bold">{neighborhood.name}</h3>
                      <p className="text-sm text-white/80">{neighborhood.propertyCount || 0} properties</p>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-neutral-500">Average Price</span>
                      <span className="font-semibold">${neighborhood.averagePrice}/mo</span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm text-neutral-500">Safety Rating</span>
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            className={`w-4 h-4 ${star <= (neighborhood.stats?.safetyRating || 4.5) ? 'text-yellow-400' : 'text-gray-300'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                    <div className="text-sm text-neutral-600 mb-4"
                      dangerouslySetInnerHTML={{ __html: neighborhood.description.substring(0, 150) + '...' }}
                    />
                    <Link
                      href={`/neighborhoods/${neighborhood.id}`}
                      className="block w-full py-2 px-4 bg-rose-500 hover:bg-rose-600 text-white text-center font-medium rounded-md transition-colors"
                    >
                      View Neighborhood
                    </Link>
                  </div>
                </div>
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
                  Not sure which neighborhood suits you best? Our local experts can help you find the perfect location based on your preferences and budget.
                </p>
                <div className="mt-6 flex flex-col sm:flex-row gap-4">
                  <a
                    href="#"
                    className="inline-flex items-center justify-center rounded-md bg-rose-500 px-4 py-2 text-sm font-medium text-white hover:bg-rose-600"
                  >
                    Contact an Expert
                  </a>
                  <a
                    href="#"
                    className="inline-flex items-center justify-center rounded-md border border-neutral-200 bg-white px-4 py-2 text-sm font-medium shadow-sm hover:bg-neutral-50"
                  >
                    Compare Neighborhoods
                  </a>
                </div>
              </div>
              <div className="relative aspect-video rounded-lg overflow-hidden">
                <img
                  src="/images/04/WhatsApp Image 2025-04-09 at 11.37.58 AM (2).jpeg"
                  alt="Kampala skyline"
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-12 md:py-16 bg-white">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-12">
            <div className="max-w-xs">
              <div className="inline-block mb-4">
                <img src="/logo.png" alt="An Jia You Xuan" className="h-10 w-auto" />
              </div>
              <p className="text-sm text-neutral-600 mb-4">
                An Jia You Xuan is your trusted platform for finding the perfect rental property in Kampala, connecting
                tenants with quality homes and landlords with reliable tenants.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
              <div>
                <h3 className="font-semibold mb-4">An Jia You Xuan</h3>
                <ul className="space-y-3 text-sm text-neutral-600">
                  <li>
                    <div className="cursor-not-allowed text-neutral-400">
                      About Us
                    </div>
                  </li>
                  <li>
                    <div className="cursor-not-allowed text-neutral-400">
                      How it Works
                    </div>
                  </li>
                  <li>
                    <div className="cursor-not-allowed text-neutral-400">
                      Careers
                    </div>
                  </li>
                  <li>
                    <div className="cursor-not-allowed text-neutral-400">
                      Press
                    </div>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Discover</h3>
                <ul className="space-y-3 text-sm text-neutral-600">
                  <li>
                    <div className="cursor-not-allowed text-neutral-400">
                      Properties
                    </div>
                  </li>
                  <li>
                    <div className="cursor-not-allowed text-neutral-400">
                      Neighborhoods
                    </div>
                  </li>
                  <li>
                    <div className="cursor-not-allowed text-neutral-400">
                      Moving Guide
                    </div>
                  </li>
                  <li>
                    <div className="cursor-not-allowed text-neutral-400">
                      Kampala Living
                    </div>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Support</h3>
                <ul className="space-y-3 text-sm text-neutral-600">
                  <li>
                    <div className="cursor-not-allowed text-neutral-400">
                      Help Center
                    </div>
                  </li>
                  <li>
                    <div className="cursor-not-allowed text-neutral-400">
                      Safety Information
                    </div>
                  </li>
                  <li>
                    <div className="cursor-not-allowed text-neutral-400">
                      Contact Us
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="font-semibold">An Jia You Xuan</span>
            </div>
            <div className="text-sm text-neutral-500">© 2025 An Jia You Xuan. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
