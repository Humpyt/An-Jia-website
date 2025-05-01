import type { Metadata } from 'next'
import './globals.css'
import './theme-override.css'
import { LanguageProvider } from '@/components/language-switcher'
import { Toaster } from '@/components/ui/toaster'

export const metadata: Metadata = {
  title: 'An Jia You Xuan - Real Estate',
  description: 'Premium properties in Kampala, Uganda',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <LanguageProvider>
          {children}
          <Toaster />
        </LanguageProvider>
      </body>
    </html>
  )
}
