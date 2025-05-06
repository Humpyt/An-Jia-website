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
      // Always prioritize HTTPS
      const apiUrls = [
        // If the URL is already HTTPS, use it first
        targetUrl.startsWith('https://') ? targetUrl : targetUrl.replace('http://', 'https://'),
        // If the URL is HTTP, try it as a fallback
        targetUrl.startsWith('http://') ? targetUrl : null,
      ].filter(Boolean) as string[];

      console.log(`[CORS-DIAGNOSTIC] Will try the following URLs:`, apiUrls);

      let response = null;
      let error = null;

      // Try each URL until one works
      for (const url of apiUrls) {
        try {
          console.log(`[CORS-DIAGNOSTIC] Trying ${url}`);

          // Fetch with timeout
          const controller = new AbortController();
          const timeoutId = setTimeout(() => {
            console.log(`[CORS-DIAGNOSTIC] Request to ${url} timed out after 15 seconds`);
            controller.abort();
          }, 15000); // Increased timeout to 15 seconds

          const startTime = Date.now();
          console.log(`[CORS-DIAGNOSTIC] Starting fetch at ${new Date().toISOString()}`);

          // Use more reliable fetch options
          const fetchResponse = await fetch(url, {
            signal: controller.signal,
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            cache: 'no-store', // Don't cache this request
            next: { revalidate: 0 } // Don't revalidate
          });

          const responseTime = Date.now() - startTime;
          clearTimeout(timeoutId);

          console.log(`[CORS-DIAGNOSTIC] Response received in ${responseTime}ms with status: ${fetchResponse.status}`);

          // Log headers for debugging
          const headers = Object.fromEntries([...fetchResponse.headers.entries()]);
          console.log(`[CORS-DIAGNOSTIC] Response headers:`, headers);

          if (!fetchResponse.ok) {
            console.error(`[CORS-DIAGNOSTIC] Response not OK: ${fetchResponse.status} ${fetchResponse.statusText}`);

            // For 404 errors, we want to return a proper error response
            if (fetchResponse.status === 404) {
              return NextResponse.json(
                { error: 'Resource not found', status: 404 },
                { status: 404 }
              );
            }

            // For other errors, throw to try the next URL
            throw new Error(`API returned ${fetchResponse.status}: ${fetchResponse.statusText}`);
          }

          // Parse the response
          console.log(`[CORS-DIAGNOSTIC] Parsing response body...`);
          const data = await fetchResponse.json();
          console.log(`[CORS-DIAGNOSTIC] Response parsed successfully. Data structure:`, Object.keys(data));

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
