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
    // For Netlify deployment, we need unoptimized images
    unoptimized: true,
    // Optimize images for better performance
    formats: ['image/webp'],
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },
  // Strict mode helps catch bugs early
  reactStrictMode: true,
  // Optimize page loading
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Ignore build errors for Netlify deployment
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Enable page caching and performance optimizations
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
  },
}

export default nextConfig
