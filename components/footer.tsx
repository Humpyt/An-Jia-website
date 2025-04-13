import Link from "next/link"
import Image from "next/image"

export function Footer() {
  return (
    <footer className="border-t py-12 md:py-16 bg-white">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-12">
          <div className="max-w-xs">
            <Link href="/" className="inline-block mb-4">
              <Image src="/logo.png" alt="An Jia You Xuan" width={150} height={50} className="h-10 w-auto" />
            </Link>
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
                  <Link href="/about" className="hover:text-rose-500 transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/how-it-works" className="hover:text-rose-500 transition-colors">
                    How it Works
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="hover:text-rose-500 transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="/press" className="hover:text-rose-500 transition-colors">
                    Press
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Discover</h3>
              <ul className="space-y-3 text-sm text-neutral-600">
                <li>
                  <Link href="/properties" className="hover:text-rose-500 transition-colors">
                    Properties
                  </Link>
                </li>
                <li>
                  <Link href="/neighborhoods" className="hover:text-rose-500 transition-colors">
                    Neighborhoods
                  </Link>
                </li>
                <li>
                  <Link href="/moving-guide" className="hover:text-rose-500 transition-colors">
                    Moving Guide
                  </Link>
                </li>
                <li>
                  <Link href="/kampala-living" className="hover:text-rose-500 transition-colors">
                    Kampala Living
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Hosting</h3>
              <ul className="space-y-3 text-sm text-neutral-600">
                <li>
                  <Link href="/list-property" className="hover:text-rose-500 transition-colors">
                    List Your Property
                  </Link>
                </li>
                <li>
                  <Link href="/responsible-hosting" className="hover:text-rose-500 transition-colors">
                    Responsible Hosting
                  </Link>
                </li>
                <li>
                  <Link href="/host-resources" className="hover:text-rose-500 transition-colors">
                    Host Resources
                  </Link>
                </li>
                <li>
                  <Link href="/success-stories" className="hover:text-rose-500 transition-colors">
                    Success Stories
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-3 text-sm text-neutral-600">
                <li>
                  <Link href="/help" className="hover:text-rose-500 transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/safety" className="hover:text-rose-500 transition-colors">
                    Safety Information
                  </Link>
                </li>
                <li>
                  <Link href="/cancellation" className="hover:text-rose-500 transition-colors">
                    Cancellation Options
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-rose-500 transition-colors">
                    Contact Us
                  </Link>
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
          <div className="flex gap-4">
            <Link href="#" className="text-neutral-600 hover:text-rose-500 transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </Link>
            <Link href="#" className="text-neutral-600 hover:text-rose-500 transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
            </Link>
            <Link href="#" className="text-neutral-600 hover:text-rose-500 transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
