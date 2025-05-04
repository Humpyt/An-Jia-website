import Image from "next/image"

export function Footer() {
  return (
    <footer className="border-t py-12 md:py-16 bg-white">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-12">
          <div className="max-w-xs">
            <div className="inline-block mb-4">
              <Image src="/logo.png" alt="An Jia You Xuan" width={150} height={50} className="h-10 w-auto" />
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
              <h3 className="font-semibold mb-4">Hosting</h3>
              <ul className="space-y-3 text-sm text-neutral-600">
                <li>
                  <div className="cursor-not-allowed text-neutral-400">
                    List Your Property
                  </div>
                </li>
                <li>
                  <div className="cursor-not-allowed text-neutral-400">
                    Responsible Hosting
                  </div>
                </li>
                <li>
                  <div className="cursor-not-allowed text-neutral-400">
                    Host Resources
                  </div>
                </li>
                <li>
                  <div className="cursor-not-allowed text-neutral-400">
                    Success Stories
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
                    Cancellation Options
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
          <div className="flex gap-4">
            <div className="cursor-not-allowed text-neutral-400">
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
            </div>
            <div className="cursor-not-allowed text-neutral-400">
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
            </div>
            <div className="cursor-not-allowed text-neutral-400">
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
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
