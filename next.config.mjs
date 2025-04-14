/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static image imports
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    unoptimized: true, // Enable static exports
  },
  // Strict mode helps catch bugs early
  reactStrictMode: true,
  // Optimize page loading
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Ignore build errors during deployment
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Enable static exports
  output: 'export',
}

export default nextConfig
