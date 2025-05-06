import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Array of fallback image paths
const FALLBACK_IMAGES = [
  '/images/properties/fallback-1.svg',
  '/images/properties/fallback-2.svg',
  '/images/properties/fallback-3.svg',
  '/images/properties/property-placeholder.svg',
];

// Get a random fallback image
const getRandomFallback = () => {
  return FALLBACK_IMAGES[Math.floor(Math.random() * FALLBACK_IMAGES.length)];
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Handle image optimization requests that might fail
  if (pathname.startsWith('/_next/image')) {
    const url = new URL(request.url);
    const imageUrl = url.searchParams.get('url');

    // If the URL parameter contains problematic patterns, redirect to a fallback
    if (imageUrl && (
      imageUrl.includes('unsplash.com') ||
      (imageUrl.includes('/images/properties/property-') && !imageUrl.includes('placeholder') && !imageUrl.includes('fallback'))
    )) {
      // Create a new URL with a fallback image
      const fallbackUrl = new URL(request.url);
      const fallback = getRandomFallback();

      // Replace the URL parameter with our fallback
      fallbackUrl.searchParams.set('url', fallback);

      // Return a redirect response to the new URL
      return NextResponse.redirect(fallbackUrl);
    }
  }

  // For API routes, add CORS headers
  if (pathname.startsWith('/api')) {
    // Get the response
    const response = NextResponse.next();

    // Add CORS headers
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    return response;
  }

  // Continue with the request for all other paths
  return NextResponse.next();
}

// Configure the middleware to run for API routes and image optimization
export const config = {
  matcher: [
    '/api/:path*',
    '/_next/image',
  ],
};
