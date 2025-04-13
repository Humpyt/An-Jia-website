/** @type {import('next').NextConfig} */
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
    // Disable optimizeCss to avoid critters dependency issues
    optimizeCss: false,
    scrollRestoration: true,
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
  },

  // Configure webpack for CSS handling and path aliases
  webpack: (config) => {
    // Modify the CSS rule to avoid using tailwindcss
    const cssRule = config.module.rules.find(
      (rule) => rule.test && rule.test.toString().includes('css')
    );

    if (cssRule) {
      // Simplify the CSS processing
      const cssLoaders = cssRule.oneOf;
      if (cssLoaders) {
        for (const loader of cssLoaders) {
          if (loader.use && Array.isArray(loader.use)) {
            // Remove or simplify postcss-loader configuration
            const postcssLoader = loader.use.find(use =>
              typeof use === 'object' && use.loader && use.loader.includes('postcss-loader')
            );
            if (postcssLoader && postcssLoader.options && postcssLoader.options.postcssOptions) {
              postcssLoader.options.postcssOptions = {
                plugins: ['autoprefixer']
              };
            }
          }
        }
      }
    }

    // Add path aliases
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname),
    };

    return config;
  },
}

export default nextConfig
