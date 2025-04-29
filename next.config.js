/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow all domains for images during development
  experimental: {
    allowedRevalidateHeaderKeys: ['x-wordpress-update'],
  },
  assetPrefix: process.env.NODE_ENV === 'production' ? undefined : '',
  env: {
    NEXT_PUBLIC_WORDPRESS_API_URL: process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'http://anjia-wordpress.local/wp-json',
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '**',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Fix for CSS loading issues
  compiler: {
    styledComponents: true,
  },
  // Add rewrites for WordPress API
  async rewrites() {
    return [
      {
        source: '/wp-json/:path*',
        destination: 'http://anjia-wordpress.local/wp-json/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
