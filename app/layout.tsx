import type { Metadata } from 'next'
import './globals.css'
import './theme-override.css'
import './fonts.css'
import './fixes.css'
import { LanguageProvider } from '@/components/language-switcher'
import { Toaster } from '@/components/ui/toaster'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'An Jia You Xuan - Real Estate',
  description: 'Premium properties in Kampala, Uganda',
  generator: 'v0.dev',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=5',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: '#171717' },
  ],
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16' },
      { url: '/favicon-32x32.png', sizes: '32x32' }
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
    other: [
      { url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' }
    ]
  },
  manifest: '/site.webmanifest',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://anjiayouxuan.com/',
    title: 'An Jia You Xuan - Real Estate',
    description: 'Premium properties in Kampala, Uganda',
    siteName: 'An Jia You Xuan',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'An Jia You Xuan - Real Estate',
    description: 'Premium properties in Kampala, Uganda',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        {/* Content Security Policy */}
        <meta
          httpEquiv="Content-Security-Policy"
          content="default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; connect-src 'self' https://*.supabase.co https://wp.ajyxn.com https://ajyxn.com https://an-jia-website-gr9b2nwk0-cavemos-projects.vercel.app; img-src 'self' data: https://* http://*; style-src 'self' 'unsafe-inline'; font-src 'self' data:; frame-src 'self';"
        />

        {/* Preload critical fonts */}
        <link
          rel="preload"
          href="/fonts/inter-var.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />

        {/* Preload critical images */}
        <link
          rel="preload"
          href="/images/headers/modern-building-exterior.jpg"
          as="image"
          type="image/jpeg"
        />

        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://wp.ajyxn.com" />
        <link rel="dns-prefetch" href="https://wp.ajyxn.com" />

        {/* Emergency fix for stray checkmarks */}
        <style dangerouslySetInnerHTML={{ __html: `
          body > svg.lucide-check {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            position: absolute !important;
            z-index: -9999 !important;
          }
        `}} />
      </head>
      <body suppressHydrationWarning className="fix-stray-checkmarks">
        <LanguageProvider>
          {children}
          <Toaster />
        </LanguageProvider>

        {/* Defer non-critical JavaScript */}
        <Script
          src="/scripts/analytics.js"
          strategy="lazyOnload"
        />

        {/* Fix for stray checkmarks */}
        <Script
          src="/scripts/fix-checkmarks.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  )
}
