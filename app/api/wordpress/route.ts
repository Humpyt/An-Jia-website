import { NextRequest, NextResponse } from 'next/server'
import { GET as createGetHandler, POST as createPostHandler, PUT as createPutHandler, DELETE as createDeleteHandler } from '@/lib/api-utils'

const WORDPRESS_API_URL = process.env.WORDPRESS_API_URL || process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'http://anjia-wordpress.local/wp-json'
const FALLBACK_API_URL = process.env.WORDPRESS_FALLBACK_API_URL || 'http://localhost/anjia-wordpress/wp-json'

// Debug WordPress API URLs
console.log('WordPress API Proxy URLs:');
console.log('- Primary URL:', WORDPRESS_API_URL);
console.log('- Fallback URL:', FALLBACK_API_URL);
const ALLOWED_METHODS = ['GET', 'POST', 'PUT', 'DELETE']

// In-memory cache for API responses
const API_CACHE = new Map();
const CACHE_DURATION = 1000 * 60 * 15; // 15 minutes default cache
const STALE_WHILE_REVALIDATE = 1000 * 60 * 60; // 1 hour stale-while-revalidate

// Using our custom route handler wrapper for correct typing
export const GET = createGetHandler(
  (request) => handleRequest(request)
);

export const POST = createPostHandler(
  (request) => handleRequest(request)
);

export const PUT = createPutHandler(
  (request) => handleRequest(request)
);

export const DELETE = createDeleteHandler(
  (request) => handleRequest(request)
);

// Function to refresh cache in background
async function refreshCache(url: string, method: string) {
  try {
    console.log('Refreshing cache for:', url);

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      next: { revalidate: 300 }
    });

    if (!response.ok) {
      console.error(`Cache refresh failed with status ${response.status}:`, response.statusText);
      return;
    }

    const data = await response.json();
    const transformedData = Array.isArray(data)
      ? data.map(transformWordPressData)
      : transformWordPressData(data);

    console.log('Cache refreshed successfully for:', url);

    API_CACHE.set(url, {
      timestamp: Date.now(),
      data: transformedData,
      source: 'refresh'
    });
  } catch (error) {
    console.error('Cache refresh failed:', error);
  }
}

async function handleRequest(request: NextRequest) {
  try {
    // Get the path parameters from the URL
    const searchParams = request.nextUrl.searchParams
    const path = searchParams.get('path') || ''
    const noCache = searchParams.get('no-cache') === 'true'

    // Build the WordPress API URL
    const primaryUrl = `${WORDPRESS_API_URL}${path}`
    const fallbackUrl = `${FALLBACK_API_URL}${path}`

    console.log('Attempting to proxy request to:', primaryUrl)

    // For GET requests, check the cache first
    if (request.method === 'GET' && !noCache) {
      const cacheKey = primaryUrl;
      const cachedResponse = API_CACHE.get(cacheKey);

      if (cachedResponse) {
        const age = Date.now() - cachedResponse.timestamp;

        // If cache is fresh, return it immediately
        if (age < CACHE_DURATION) {
          console.log('Using fresh cache for:', primaryUrl);
          return NextResponse.json(cachedResponse.data);
        }

        // If cache is stale but within SWR window, return stale data and refresh in background
        if (age < STALE_WHILE_REVALIDATE) {
          console.log('Using stale cache and refreshing in background for:', primaryUrl);
          // Trigger background refresh
          refreshCache(primaryUrl, request.method).catch(console.error);
          return NextResponse.json(cachedResponse.data);
        }
      }
    }

    // Forward the request to WordPress - try primary URL first
    let response;
    let usedFallback = false;

    try {
      console.log('Proxying request to primary URL:', primaryUrl);
      response = await fetch(primaryUrl, {
        method: request.method,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: request.method !== 'GET' ? await request.text() : undefined,
        next: { revalidate: 300 } // Use Next.js built-in cache for 5 minutes
      });

      // If primary URL fails, try fallback URL
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Primary WordPress API error (${response.status}):`, errorText);
        console.log('Trying fallback URL:', fallbackUrl);

        // Try the fallback URL
        usedFallback = true;
        response = await fetch(fallbackUrl, {
          method: request.method,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: request.method !== 'GET' ? await request.text() : undefined,
          next: { revalidate: 300 }
        });
      }
    } catch (fetchError) {
      console.error('Error fetching from primary URL:', fetchError);

      // Try the fallback URL
      try {
        console.log('Trying fallback URL after fetch error:', fallbackUrl);
        usedFallback = true;
        response = await fetch(fallbackUrl, {
          method: request.method,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: request.method !== 'GET' ? await request.text() : undefined,
          next: { revalidate: 300 }
        });
      } catch (fallbackError) {
        console.error('Error fetching from fallback URL:', fallbackError);
        return NextResponse.json({
          error: 'Failed to connect to WordPress API',
          details: fallbackError.message,
          path: path
        }, { status: 503 });
      }
    }

    // Check if response is successful
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`WordPress API error (${response.status}):`, errorText);
      return NextResponse.json({
        error: `WordPress API returned ${response.status}: ${response.statusText}`,
        details: errorText,
        path: path,
        usedFallback
      }, { status: response.status });
    }

    // Get the response data
    const data = await response.json()

    // Transform ACF fields if they exist
    const transformedData = Array.isArray(data)
      ? data.map(transformWordPressData)
      : transformWordPressData(data)

    // Cache the response for GET requests
    if (request.method === 'GET' && !noCache) {
      const cacheKey = usedFallback ? fallbackUrl : primaryUrl;
      console.log(`Caching response from ${usedFallback ? 'fallback' : 'primary'} URL:`, cacheKey);

      API_CACHE.set(cacheKey, {
        timestamp: Date.now(),
        data: transformedData,
        source: usedFallback ? 'fallback' : 'primary'
      });
    }

    return NextResponse.json(transformedData)
  } catch (error: any) {
    console.error('WordPress API proxy error:', error)
    return NextResponse.json(
      {
        error: error.message || 'Internal Server Error',
        status: 'error',
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}

function transformWordPressData(item: any) {
  if (!item) return item

  // Transform ACF fields to be more accessible
  if (item.acf) {
    Object.keys(item.acf).forEach(key => {
      item[key] = item.acf[key]
    })
    delete item.acf
  }

  // Clean up rendered content
  if (item.title?.rendered) {
    item.title = item.title.rendered
  }
  if (item.content?.rendered) {
    item.content = item.content.rendered
  }

  // Ensure amenities is always an array
  if (item.amenities) {
    item.amenities = Array.isArray(item.amenities)
      ? item.amenities
      : (typeof item.amenities === 'string'
        ? item.amenities.split(',').map((a: string) => a.trim())
        : [])
  }

  // Format price with thousand separator
  if (item.price) {
    const price = parseInt(item.price)
    if (!isNaN(price)) {
      item.formatted_price = item.currency === 'UGX'
        ? `UGX ${price.toLocaleString()}`
        : `$${price.toLocaleString()}`
    }
  }

  return item
}
