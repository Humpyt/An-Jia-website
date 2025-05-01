import { NextRequest, NextResponse } from 'next/server'

const WORDPRESS_API_URL = process.env.WORDPRESS_API_URL || 'http://anjia.local/wp-json'
const ALLOWED_METHODS = ['GET', 'POST', 'PUT', 'DELETE']

// In-memory cache for API responses
const API_CACHE = new Map();
const CACHE_DURATION = 1000 * 60 * 5; // 5 minutes default cache

export async function GET(request: NextRequest) {
  return handleRequest(request)
}

export async function POST(request: NextRequest) {
  return handleRequest(request)
}

export async function PUT(request: NextRequest) {
  return handleRequest(request)
}

export async function DELETE(request: NextRequest) {
  return handleRequest(request)
}

async function handleRequest(request: NextRequest) {
  try {
    // Get the path parameters from the URL
    const searchParams = request.nextUrl.searchParams
    const path = searchParams.get('path') || ''
    const noCache = searchParams.get('no-cache') === 'true'

    // Build the WordPress API URL
    const wpUrl = `${WORDPRESS_API_URL}${path}`

    // For GET requests, check the cache first
    if (request.method === 'GET' && !noCache) {
      const cacheKey = wpUrl;
      const cachedResponse = API_CACHE.get(cacheKey);

      if (cachedResponse && (Date.now() - cachedResponse.timestamp < CACHE_DURATION)) {
        // Return cached response
        return NextResponse.json(cachedResponse.data);
      }
    }

    console.log('Proxying request to:', wpUrl)

    // Forward the request to WordPress
    const response = await fetch(wpUrl, {
      method: request.method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: request.method !== 'GET' ? await request.text() : undefined,
      next: { revalidate: 60 } // Use Next.js built-in cache for 60 seconds
    })

    // Check if response is successful
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`WordPress API error (${response.status}):`, errorText);
      return NextResponse.json({
        error: `WordPress API returned ${response.status}: ${response.statusText}`,
        details: errorText,
        path: path
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
      API_CACHE.set(wpUrl, {
        timestamp: Date.now(),
        data: transformedData
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
