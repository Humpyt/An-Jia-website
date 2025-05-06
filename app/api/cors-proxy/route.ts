import { NextRequest, NextResponse } from 'next/server';
import { GET as createGetHandler } from '@/lib/api-utils';

// In-memory cache for API responses
const API_CACHE = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Using our custom route handler wrapper for correct typing
export const GET = createGetHandler(
  async (request) => {
    try {
      // Get the URL to proxy from the query parameters
      const { searchParams } = new URL(request.url);
      const targetUrl = searchParams.get('url');
      const noCache = searchParams.get('no-cache') === 'true';

      if (!targetUrl) {
        return NextResponse.json(
          { error: 'Missing url parameter' },
          { status: 400 }
        );
      }

      console.log(`CORS Proxy: Proxying request to ${targetUrl}`);

      // Check cache first
      if (!noCache) {
        const cached = API_CACHE.get(targetUrl);
        if (cached && (Date.now() - cached.timestamp < CACHE_DURATION)) {
          console.log(`CORS Proxy: Using cached response for ${targetUrl}`);
          
          // Create a new response with CORS headers
          const response = NextResponse.json(cached.data);
          
          // Add CORS headers
          response.headers.set('Access-Control-Allow-Origin', '*');
          response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
          response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
          
          return response;
        }
      }

      // Try multiple WordPress API URLs
      const apiUrls = [
        targetUrl,
        targetUrl.replace('wp.ajyxn.com', '199.188.200.71'),
        targetUrl.replace('https://', 'http://'),
      ];

      let response = null;
      let error = null;

      // Try each URL until one works
      for (const url of apiUrls) {
        try {
          console.log(`CORS Proxy: Trying ${url}`);
          
          // Fetch with timeout
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 10000);
          
          const fetchResponse = await fetch(url, {
            signal: controller.signal,
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            next: { revalidate: 60 } // Cache for 60 seconds
          });
          
          clearTimeout(timeoutId);
          
          if (!fetchResponse.ok) {
            throw new Error(`API returned ${fetchResponse.status}`);
          }
          
          // Parse the response
          const data = await fetchResponse.json();
          
          // Cache the response
          API_CACHE.set(targetUrl, {
            timestamp: Date.now(),
            data
          });
          
          // Create a new response with CORS headers
          response = NextResponse.json(data);
          
          // Add CORS headers
          response.headers.set('Access-Control-Allow-Origin', '*');
          response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
          response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
          
          console.log(`CORS Proxy: Successfully proxied ${url}`);
          
          // We got a successful response, so break the loop
          break;
        } catch (e) {
          console.error(`CORS Proxy: Error fetching from ${url}:`, e);
          error = e;
        }
      }

      // If we got a response, return it
      if (response) {
        return response;
      }

      // If all URLs failed, return an error
      console.error('CORS Proxy: All URLs failed');
      return NextResponse.json(
        { 
          error: 'Failed to fetch from WordPress API',
          message: error?.message || 'Unknown error',
          targetUrl
        },
        { status: 502 }
      );
    } catch (error: any) {
      console.error('CORS Proxy error:', error);
      return NextResponse.json(
        { error: error.message || 'Internal Server Error' },
        { status: 500 }
      );
    }
  }
);

// Handle OPTIONS requests for CORS preflight
export const OPTIONS = (request: NextRequest) => {
  const response = new NextResponse(null, { status: 204 });
  
  // Add CORS headers
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  
  return response;
};
