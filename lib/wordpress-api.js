/**
 * WordPress API service for fetching neighborhood data
 */

// WordPress API proxy URL
const API_PROXY_URL = '/api/wordpress';
const WORDPRESS_API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'http://anjia-wordpress.local/wp-json';
// Fallback to a direct path if needed
const FALLBACK_API_URL = process.env.WORDPRESS_FALLBACK_API_URL || 'http://localhost/anjia-wordpress/wp-json';
const FETCH_TIMEOUT = 30000; // 30 seconds

// Debug WordPress API URLs
console.log('WordPress API URLs:');
console.log('- Primary URL:', WORDPRESS_API_URL);
console.log('- Fallback URL:', FALLBACK_API_URL);

// Helper function to build proxy URL
function buildProxyUrl(path) {
  // Log the path being requested for debugging
  console.log(`Building URL for path: ${path}`);

  if (typeof window !== 'undefined') {
    // In browser environment, use the API proxy
    try {
      const url = new URL(API_PROXY_URL, window.location.origin);
      url.searchParams.set('path', path);
      const urlString = url.toString();
      console.log(`Browser environment - Using proxy URL: ${urlString}`);
      return urlString;
    } catch (error) {
      console.error('Error building proxy URL:', error);
      // Fallback to direct API URL if there's an error
      const fallbackUrl = `${WORDPRESS_API_URL}${path}`;
      console.log(`Browser environment - Fallback to direct URL: ${fallbackUrl}`);
      return fallbackUrl;
    }
  }

  // In server environment, try the main URL first
  try {
    const serverUrl = `${WORDPRESS_API_URL}${path}`;
    console.log(`Server environment - Using direct URL: ${serverUrl}`);
    return serverUrl;
  } catch (error) {
    console.error('Error with primary WordPress API URL:', error);
    // Fallback to alternative URL if there's an error
    const fallbackUrl = `${FALLBACK_API_URL}${path}`;
    console.log(`Server environment - Fallback URL: ${fallbackUrl}`);
    return fallbackUrl;
  }
}

// In-memory cache for API responses
const API_CACHE = new Map();
const DEFAULT_CACHE_DURATION = 1000 * 60 * 5; // 5 minutes default cache

// Helper function to fetch with timeout and caching
async function fetchWithTimeout(url, options = {}) {
  // Extract cache options
  const {
    cache = 'default',
    cacheDuration = DEFAULT_CACHE_DURATION,
    revalidate = false,
    ...fetchOptions
  } = options;

  // Generate a cache key based on URL and any body content
  const cacheKey = `${url}-${JSON.stringify(fetchOptions.body || '')}`;

  // Check if we should use cache
  if (cache !== 'no-store' && !revalidate) {
    const cachedResponse = API_CACHE.get(cacheKey);
    if (cachedResponse && (Date.now() - cachedResponse.timestamp < cacheDuration)) {
      console.log('Using cached response for:', url);
      // Return cached response if it's still valid
      return cachedResponse.response.clone();
    }
  }

  // If not in cache or cache invalid, make the actual request
  console.log('Fetching from API:', url);
  const controller = new AbortController();
  const { signal } = controller;
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

  try {
    console.log('Request options:', {
      method: fetchOptions.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(fetchOptions.headers || {})
      },
      mode: 'cors'
    });

    const response = await fetch(url, {
      ...fetchOptions,
      signal,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(fetchOptions.headers || {})
      },
      mode: 'cors'
    });

    clearTimeout(timeoutId);

    console.log('Response status:', response.status, response.statusText);
    console.log('Response headers:', Object.fromEntries([...response.headers.entries()]));

    if (!response.ok) {
      let errorMessage;
      let errorDetails = '';

      try {
        const errorText = await response.text();
        console.error('Error response body:', errorText);

        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || `HTTP Error ${response.status}`;
          errorDetails = JSON.stringify(errorData, null, 2);
        } catch (jsonError) {
          errorMessage = `HTTP Error ${response.status}: ${response.statusText}`;
          errorDetails = errorText;
        }
      } catch (e) {
        errorMessage = `HTTP Error ${response.status}: ${response.statusText}`;
      }

      console.error(`API Error (${response.status}): ${errorMessage}`);
      if (errorDetails) console.error('Error details:', errorDetails);

      throw new Error(`${errorMessage} - URL: ${url}`);
    }

    // Cache the response if it's a GET request and caching is enabled
    if ((!fetchOptions.method || fetchOptions.method === 'GET') && cache !== 'no-store') {
      console.log('Caching response for:', url);
      API_CACHE.set(cacheKey, {
        timestamp: Date.now(),
        response: response.clone()
      });
    }

    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    console.error('Fetch error:', error.name, error.message);

    if (error.name === 'AbortError') {
      throw new Error(`Request timeout after ${FETCH_TIMEOUT}ms: ${url}`);
    }

    // Try to provide a more helpful error message
    if (error.message.includes('Failed to fetch') || error.message.includes('Network request failed')) {
      throw new Error(`Network error when fetching ${url} - Is the WordPress server running and accessible?`);
    }

    throw error;
  }
}

// Cache for neighborhoods
const NEIGHBORHOODS_CACHE = new Map();
const NEIGHBORHOODS_CACHE_DURATION = 1000 * 60 * 30; // 30 minutes

/**
 * Fetch all neighborhoods
 * @returns {Promise<Array>} - Array of neighborhoods
 */
export async function getNeighborhoods() {
  try {
    // Check if we have neighborhoods in cache
    const cacheKey = 'neighborhoods';
    const cachedNeighborhoods = NEIGHBORHOODS_CACHE.get(cacheKey);
    if (cachedNeighborhoods && (Date.now() - cachedNeighborhoods.timestamp < NEIGHBORHOODS_CACHE_DURATION)) {
      console.log('Using cached neighborhoods');
      return cachedNeighborhoods.data;
    }

    console.log('Fetching neighborhoods from WordPress');

    // Try to fetch from WordPress API
    try {
      // First try with _embed parameter to get featured media
      const url = buildProxyUrl('/wp/v2/neighborhood?per_page=20&_embed');
      console.log('Neighborhood API URL:', url);

      const response = await fetchWithTimeout(url, {
        cache: 'default',
        cacheDuration: NEIGHBORHOODS_CACHE_DURATION
      });

      const neighborhoods = await response.json();
      console.log(`Successfully fetched ${neighborhoods.length} neighborhoods`);

      // Transform the neighborhoods data
      const transformedNeighborhoods = neighborhoods.map(neighborhood => ({
        id: neighborhood.id.toString(),
        name: neighborhood.title?.rendered || '',
        description: neighborhood.content?.rendered || '',
        image: neighborhood._embedded?.['wp:featuredmedia']?.[0]?.source_url || '/placeholder.svg',
        properties: 0, // Will be populated by the server action
        averagePrice: neighborhood.acf?.average_price || 0,
        stats: {
          safetyRating: neighborhood.acf?.safety_rating || 4.5,
          nearbyAmenities: neighborhood.acf?.nearby_amenities || [],
          transportation: neighborhood.acf?.transportation || [],
          schoolsFacilities: neighborhood.acf?.schools_facilities || []
        }
      }));

      // Cache the transformed neighborhoods
      NEIGHBORHOODS_CACHE.set(cacheKey, {
        timestamp: Date.now(),
        data: transformedNeighborhoods
      });

      return transformedNeighborhoods;
    } catch (apiError) {
      console.error('Error fetching from WordPress API:', apiError);

      // Try again without _embed parameter as a fallback
      try {
        console.log('Trying fallback API request without _embed parameter');
        const fallbackUrl = buildProxyUrl('/wp/v2/neighborhood?per_page=20');

        const fallbackResponse = await fetchWithTimeout(fallbackUrl, {
          cache: 'default',
          cacheDuration: NEIGHBORHOODS_CACHE_DURATION
        });

        const fallbackNeighborhoods = await fallbackResponse.json();
        console.log(`Successfully fetched ${fallbackNeighborhoods.length} neighborhoods with fallback method`);

        // Transform the neighborhoods data without embedded media
        const transformedNeighborhoods = fallbackNeighborhoods.map(neighborhood => ({
          id: neighborhood.id.toString(),
          name: neighborhood.title?.rendered || '',
          description: neighborhood.content?.rendered || '',
          image: '/placeholder.svg', // Use placeholder since we don't have featured media
          properties: 0,
          averagePrice: neighborhood.acf?.average_price || 0,
          stats: {
            safetyRating: neighborhood.acf?.safety_rating || 4.5,
            nearbyAmenities: neighborhood.acf?.nearby_amenities || [],
            transportation: neighborhood.acf?.transportation || [],
            schoolsFacilities: neighborhood.acf?.schools_facilities || []
          }
        }));

        // Cache the transformed neighborhoods
        NEIGHBORHOODS_CACHE.set(cacheKey, {
          timestamp: Date.now(),
          data: transformedNeighborhoods
        });

        return transformedNeighborhoods;
      } catch (fallbackError) {
        console.error('Error fetching from fallback WordPress API:', fallbackError);

        // Return fallback data
        console.log('Using fallback neighborhood data');
        const fallbackNeighborhoods = [
          {
            id: "kololo",
            name: "Kololo",
            description: "Kololo is an upscale residential area known for embassies, luxury homes, and proximity to the city center.",
            image: "/images/03/WhatsApp Image 2025-04-09 at 11.36.23 AM.jpeg",
            properties: 24,
            averagePrice: 1200,
            stats: {
              safetyRating: 4.5,
              nearbyAmenities: [],
              transportation: [],
              schoolsFacilities: []
            }
          },
          {
            id: "naguru",
            name: "Naguru",
            description: "Naguru is a prestigious neighborhood with beautiful views, modern apartments, and a growing expat community.",
            image: "/images/03/WhatsApp Image 2025-04-09 at 11.36.25 AM (1).jpeg",
            properties: 18,
            averagePrice: 950,
            stats: {
              safetyRating: 4.3,
              nearbyAmenities: [],
              transportation: [],
              schoolsFacilities: []
            }
          },
          {
            id: "bukoto",
            name: "Bukoto",
            description: "Bukoto is a vibrant area with a mix of residential and commercial properties, popular among young professionals.",
            image: "/images/03/WhatsApp Image 2025-04-09 at 11.36.26 AM.jpeg",
            properties: 15,
            averagePrice: 800,
            stats: {
              safetyRating: 4.0,
              nearbyAmenities: [],
              transportation: [],
              schoolsFacilities: []
            }
          },
          {
            id: "muyenga",
            name: "Muyenga",
            description: "Muyenga, known as 'Tank Hill', offers breathtaking views of Lake Victoria and upscale housing options.",
            image: "/images/04/WhatsApp Image 2025-04-09 at 11.37.57 AM.jpeg",
            properties: 20,
            averagePrice: 1100,
            stats: {
              safetyRating: 4.4,
              nearbyAmenities: [],
              transportation: [],
              schoolsFacilities: []
            }
          },
          {
            id: "ntinda",
            name: "Ntinda",
            description: "Ntinda is a rapidly developing suburb that offers a perfect blend of residential comfort and urban convenience.",
            image: "/images/04/WhatsApp Image 2025-04-09 at 11.37.58 AM (1).jpeg",
            properties: 22,
            averagePrice: 700,
            stats: {
              safetyRating: 3.9,
              nearbyAmenities: [],
              transportation: [],
              schoolsFacilities: []
            }
          },
          {
            id: "bugolobi",
            name: "Bugolobi",
            description: "Bugolobi is a quiet, upscale residential area that offers a perfect balance of comfort and convenience.",
            image: "/images/05/WhatsApp Image 2025-04-09 at 11.40.23 AM.jpeg",
            properties: 16,
            averagePrice: 900,
            stats: {
              safetyRating: 4.2,
              nearbyAmenities: [],
              transportation: [],
              schoolsFacilities: []
            }
          }
        ];

        // Cache the fallback neighborhoods
        NEIGHBORHOODS_CACHE.set(cacheKey, {
          timestamp: Date.now(),
          data: fallbackNeighborhoods
        });

        return fallbackNeighborhoods;
    }
  } catch (error) {
    console.error('Error in getNeighborhoods:', error);
    return [];
  }
}

/**
 * Get properties by neighborhood
 * @param {Object} options - Filter options
 * @returns {Promise<Object>} - Properties and metadata
 */
export async function getPropertiesByNeighborhood(neighborhoodName, options = {}) {
  try {
    const { limit = 12, offset = 0, filters = {} } = options;

    // Build query parameters
    let queryParams = new URLSearchParams({
      per_page: limit.toString(),
      offset: offset.toString(),
      _embed: 'true',
      _fields: 'id,title,acf,featured_media,_embedded,_links'
    });

    // Add location filter
    queryParams.append('acf_location', neighborhoodName);

    // Add other filters
    if (filters.minPrice) {
      queryParams.append('acf_min_price', filters.minPrice.toString());
    }

    if (filters.maxPrice) {
      queryParams.append('acf_max_price', filters.maxPrice.toString());
    }

    if (filters.bedrooms) {
      queryParams.append('acf_bedrooms', filters.bedrooms.toString());
    }

    if (filters.bathrooms) {
      queryParams.append('acf_bathrooms', filters.bathrooms.toString());
    }

    if (filters.propertyType) {
      queryParams.append('acf_property_type', filters.propertyType);
    }

    console.log(`Fetching properties for neighborhood: ${neighborhoodName}`);

    try {
      const url = buildProxyUrl(`/wp/v2/property?${queryParams.toString()}`);
      console.log('Properties API URL:', url);

      const response = await fetchWithTimeout(url, {
        cache: 'default',
        cacheDuration: 1000 * 60 * 5 // 5 minutes
      });

      // Get the total count of properties from the headers
      const totalCount = parseInt(response.headers.get('X-WP-Total') || '0');
      const totalPages = parseInt(response.headers.get('X-WP-TotalPages') || '0');

      console.log(`Total properties in ${neighborhoodName}: ${totalCount}, Total pages: ${totalPages}`);

      const properties = await response.json();
      console.log(`Successfully fetched ${properties.length} properties for ${neighborhoodName}`);

      // Transform properties (simplified version)
      const transformedProperties = properties.map(property => ({
        id: property.id.toString(),
        title: property.title?.rendered || '',
        location: property.acf?.location || '',
        price: property.acf?.price?.toString() || '0',
        currency: property.acf?.currency || 'USD',
        bedrooms: property.acf?.bedrooms?.toString() || '0',
        bathrooms: property.acf?.bathrooms?.toString() || '0',
        propertyType: property.acf?.property_type || 'apartment',
        images: property._embedded?.['wp:featuredmedia']
          ? [property._embedded['wp:featuredmedia'][0].source_url]
          : ['/placeholder.svg'],
        amenities: Array.isArray(property.acf?.amenities)
          ? property.acf.amenities
          : ['wifi', 'parking', 'security']
      }));

      return {
        properties: transformedProperties,
        totalCount,
        totalPages
      };
    } catch (apiError) {
      console.error(`Error fetching properties for neighborhood from API:`, apiError);

      // Return fallback data for the specific neighborhood
      console.log(`Using fallback properties data for ${neighborhoodName}`);

      // Generate some fallback properties based on the neighborhood
      const fallbackProperties = Array.from({ length: 6 }, (_, i) => ({
        id: `fallback-${neighborhoodName}-${i + 1}`,
        title: `${neighborhoodName} Property ${i + 1}`,
        location: neighborhoodName,
        price: `${800 + (i * 100)}`,
        currency: 'USD',
        bedrooms: `${1 + (i % 4)}`,
        bathrooms: `${1 + (i % 3)}`,
        propertyType: ['apartment', 'house', 'villa', 'condo'][i % 4],
        images: ['/images/04/WhatsApp Image 2025-04-09 at 11.37.58 AM.jpeg'],
        amenities: ['wifi', 'parking', 'security']
      }));

      return {
        properties: fallbackProperties,
        totalCount: fallbackProperties.length,
        totalPages: 1
      };
    }
  } catch (error) {
    console.error(`Error in getPropertiesByNeighborhood:`, error);
    return { properties: [], totalCount: 0, totalPages: 0 };
  }
}
