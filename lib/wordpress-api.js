/**
 * WordPress API service for fetching neighborhood data
 * @module wordpress-api
 */

'use strict';

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

/**
 * Fetches neighborhoods from WordPress API
 * @returns {Promise<Array>} - List of neighborhoods
 */
export async function getNeighborhoods() {
  try {
    const url = buildProxyUrl('/wp/v2/neighborhood?_embed&per_page=100');
    console.log('Fetching neighborhoods from:', url);

    const response = await fetchWithTimeout(url);
    const neighborhoods = await response.json();

    console.log(`Fetched ${neighborhoods.length} neighborhoods`);
    return neighborhoods.map(neighborhood => ({
      id: neighborhood.id,
      slug: neighborhood.slug,
      title: neighborhood.title.rendered,
      content: neighborhood.content.rendered,
      excerpt: neighborhood.excerpt?.rendered || '',
      featured_image: neighborhood._embedded?.['wp:featuredmedia']?.[0]?.source_url || null,
      meta: neighborhood.meta || {},
      acf: neighborhood.acf || {}
    }));
  } catch (error) {
    console.error('Error fetching neighborhoods:', error);

    // Try fallback data if available
    try {
      console.log('Attempting to fetch fallback neighborhoods data...');
      const fallbackUrl = `${FALLBACK_API_URL}/wp/v2/neighborhood?_embed&per_page=100`;
      console.log('Fallback URL:', fallbackUrl);

      const fallbackResponse = await fetchWithTimeout(fallbackUrl, { cache: 'no-store' });
      const fallbackNeighborhoods = await fallbackResponse.json();

      console.log(`Fetched ${fallbackNeighborhoods.length} neighborhoods from fallback`);
      return fallbackNeighborhoods.map(neighborhood => ({
        id: neighborhood.id,
        slug: neighborhood.slug,
        title: neighborhood.title.rendered,
        content: neighborhood.content.rendered,
        excerpt: neighborhood.excerpt?.rendered || '',
        featured_image: neighborhood._embedded?.['wp:featuredmedia']?.[0]?.source_url || null,
        meta: neighborhood.meta || {},
        acf: neighborhood.acf || {}
      }));
    } catch (fallbackError) {
      console.error('Error fetching fallback neighborhoods:', fallbackError);
      return [];
    }
  }
}

/**
 * Fetches properties by neighborhood
 * @param {string} neighborhoodName - Neighborhood slug
 * @param {Object} options - Filter options
 * @returns {Promise<Object>} - Properties and metadata
 */
export async function getPropertiesByNeighborhood(neighborhoodName, options = {}) {
  try {
    const { limit = 12, offset = 0, filters = {} } = options;

    // Build the API URL with filters
    let apiPath = `/wp/v2/property?_embed&per_page=${limit}&offset=${offset}`;

    // Add neighborhood filter
    if (neighborhoodName && neighborhoodName !== 'all') {
      apiPath += `&filter[meta_query][0][key]=neighborhood&filter[meta_query][0][value]=${neighborhoodName}`;
    }

    // Add price range filter if provided
    if (filters.minPrice || filters.maxPrice) {
      if (filters.minPrice) {
        apiPath += `&filter[meta_query][1][key]=price&filter[meta_query][1][value]=${filters.minPrice}&filter[meta_query][1][compare]=>=&filter[meta_query][1][type]=NUMERIC`;
      }

      if (filters.maxPrice) {
        const index = filters.minPrice ? 2 : 1;
        apiPath += `&filter[meta_query][${index}][key]=price&filter[meta_query][${index}][value]=${filters.maxPrice}&filter[meta_query][${index}][compare]=<=&filter[meta_query][${index}][type]=NUMERIC`;
      }

      // Add relation if both min and max price are provided
      if (filters.minPrice && filters.maxPrice) {
        apiPath += `&filter[meta_query][relation]=AND`;
      }
    }

    // Add bedrooms filter if provided
    if (filters.bedrooms) {
      const index = (filters.minPrice || filters.maxPrice) ? 3 : 1;
      apiPath += `&filter[meta_query][${index}][key]=bedrooms&filter[meta_query][${index}][value]=${filters.bedrooms}&filter[meta_query][${index}][compare]=>=&filter[meta_query][${index}][type]=NUMERIC`;
    }

    console.log('API Path with filters:', apiPath);
    const url = buildProxyUrl(apiPath);

    // Fetch properties
    const response = await fetchWithTimeout(url);
    const properties = await response.json();

    // Get total count from headers
    const totalProperties = parseInt(response.headers.get('X-WP-Total') || '0', 10);
    const totalPages = parseInt(response.headers.get('X-WP-TotalPages') || '0', 10);

    console.log(`Fetched ${properties.length} properties (total: ${totalProperties})`);

    // Format the properties
    const formattedProperties = properties.map(property => ({
      id: property.id,
      slug: property.slug,
      title: property.title.rendered,
      content: property.content.rendered,
      excerpt: property.excerpt?.rendered || '',
      featured_image: property._embedded?.['wp:featuredmedia']?.[0]?.source_url || null,
      meta: property.meta || {},
      acf: property.acf || {},
      // Extract specific fields for easier access
      price: property.acf?.price || property.meta?.price || 0,
      bedrooms: property.acf?.bedrooms || property.meta?.bedrooms || 0,
      bathrooms: property.acf?.bathrooms || property.meta?.bathrooms || 0,
      location: property.acf?.location || property.meta?.location || '',
      property_type: property.acf?.property_type || property.meta?.property_type || '',
      square_footage: property.acf?.square_footage || property.meta?.square_footage || 0,
      features: property.acf?.features || property.meta?.features || [],
      images: property.acf?.property_images || []
    }));

    return {
      properties: formattedProperties,
      total: totalProperties,
      totalPages,
      page: Math.floor(offset / limit) + 1,
      limit
    };
  } catch (error) {
    console.error('Error fetching properties by neighborhood:', error);
    return { properties: [], total: 0, totalPages: 0, page: 1, limit: options.limit || 12 };
  }
}

/**
 * Fetches a single property by slug
 * @param {string} slug - Property slug
 * @returns {Promise<Object>} - Property data
 */
export async function getPropertyBySlug(slug) {
  try {
    const url = buildProxyUrl(`/wp/v2/property?slug=${slug}&_embed`);
    console.log('Fetching property by slug:', url);

    const response = await fetchWithTimeout(url);
    const properties = await response.json();

    if (!properties.length) {
      console.log(`No property found with slug: ${slug}`);
      return null;
    }

    const property = properties[0];
    console.log(`Found property: ${property.title.rendered}`);

    return {
      id: property.id,
      slug: property.slug,
      title: property.title.rendered,
      content: property.content.rendered,
      excerpt: property.excerpt?.rendered || '',
      featured_image: property._embedded?.['wp:featuredmedia']?.[0]?.source_url || null,
      meta: property.meta || {},
      acf: property.acf || {},
      // Extract specific fields for easier access
      price: property.acf?.price || property.meta?.price || 0,
      bedrooms: property.acf?.bedrooms || property.meta?.bedrooms || 0,
      bathrooms: property.acf?.bathrooms || property.meta?.bathrooms || 0,
      location: property.acf?.location || property.meta?.location || '',
      property_type: property.acf?.property_type || property.meta?.property_type || '',
      square_footage: property.acf?.square_footage || property.meta?.square_footage || 0,
      features: property.acf?.features || property.meta?.features || [],
      images: property.acf?.property_images || []
    };
  } catch (error) {
    console.error(`Error fetching property with slug ${slug}:`, error);
    return null;
  }
}

/**
 * Fetches all properties with pagination
 * @param {Object} options - Filter options
 * @returns {Promise<Object>} - Properties and metadata
 */
export async function getAllProperties(options = {}) {
  try {
    const { limit = 12, offset = 0, filters = {} } = options;

    // Build the API URL with filters
    let apiPath = `/wp/v2/property?_embed&per_page=${limit}&offset=${offset}`;

    // Add price range filter if provided
    if (filters.minPrice || filters.maxPrice) {
      if (filters.minPrice) {
        apiPath += `&filter[meta_query][0][key]=price&filter[meta_query][0][value]=${filters.minPrice}&filter[meta_query][0][compare]=>=&filter[meta_query][0][type]=NUMERIC`;
      }

      if (filters.maxPrice) {
        const index = filters.minPrice ? 1 : 0;
        apiPath += `&filter[meta_query][${index}][key]=price&filter[meta_query][${index}][value]=${filters.maxPrice}&filter[meta_query][${index}][compare]=<=&filter[meta_query][${index}][type]=NUMERIC`;
      }

      // Add relation if both min and max price are provided
      if (filters.minPrice && filters.maxPrice) {
        apiPath += `&filter[meta_query][relation]=AND`;
      }
    }

    // Add location filter if provided
    if (filters.location) {
      const index = (filters.minPrice || filters.maxPrice) ? 2 : 0;
      apiPath += `&filter[meta_query][${index}][key]=location&filter[meta_query][${index}][value]=${filters.location}&filter[meta_query][${index}][compare]=LIKE`;
    }

    // Add bedrooms filter if provided
    if (filters.bedrooms) {
      const index = (filters.minPrice || filters.maxPrice || filters.location) ? 3 : 0;
      apiPath += `&filter[meta_query][${index}][key]=bedrooms&filter[meta_query][${index}][value]=${filters.bedrooms}&filter[meta_query][${index}][compare]=>=&filter[meta_query][${index}][type]=NUMERIC`;
    }

    console.log('API Path with filters:', apiPath);
    const url = buildProxyUrl(apiPath);

    // Fetch properties
    const response = await fetchWithTimeout(url);
    const properties = await response.json();

    // Get total count from headers
    const totalProperties = parseInt(response.headers.get('X-WP-Total') || '0', 10);
    const totalPages = parseInt(response.headers.get('X-WP-TotalPages') || '0', 10);

    console.log(`Fetched ${properties.length} properties (total: ${totalProperties})`);

    // Format the properties
    const formattedProperties = properties.map(property => ({
      id: property.id,
      slug: property.slug,
      title: property.title.rendered,
      content: property.content.rendered,
      excerpt: property.excerpt?.rendered || '',
      featured_image: property._embedded?.['wp:featuredmedia']?.[0]?.source_url || null,
      meta: property.meta || {},
      acf: property.acf || {},
      // Extract specific fields for easier access
      price: property.acf?.price || property.meta?.price || 0,
      bedrooms: property.acf?.bedrooms || property.meta?.bedrooms || 0,
      bathrooms: property.acf?.bathrooms || property.meta?.bathrooms || 0,
      location: property.acf?.location || property.meta?.location || '',
      property_type: property.acf?.property_type || property.meta?.property_type || '',
      square_footage: property.acf?.square_footage || property.meta?.square_footage || 0,
      features: property.acf?.features || property.meta?.features || [],
      images: property.acf?.property_images || []
    }));

    return {
      properties: formattedProperties,
      total: totalProperties,
      totalPages,
      page: Math.floor(offset / limit) + 1,
      limit
    };
  } catch (error) {
    console.error('Error fetching all properties:', error);
    return { properties: [], total: 0, totalPages: 0, page: 1, limit: options.limit || 12 };
  }
}

/**
 * Fetches featured properties
 * @param {number} limit - Number of properties to fetch
 * @returns {Promise<Array>} - List of featured properties
 */
export async function getFeaturedProperties(limit = 6) {
  try {
    const url = buildProxyUrl(`/wp/v2/property?_embed&per_page=${limit}&filter[meta_query][0][key]=featured&filter[meta_query][0][value]=1`);
    console.log('Fetching featured properties from:', url);

    const response = await fetchWithTimeout(url);
    const properties = await response.json();

    console.log(`Fetched ${properties.length} featured properties`);

    return properties.map(property => ({
      id: property.id,
      slug: property.slug,
      title: property.title.rendered,
      content: property.content.rendered,
      excerpt: property.excerpt?.rendered || '',
      featured_image: property._embedded?.['wp:featuredmedia']?.[0]?.source_url || null,
      meta: property.meta || {},
      acf: property.acf || {},
      // Extract specific fields for easier access
      price: property.acf?.price || property.meta?.price || 0,
      bedrooms: property.acf?.bedrooms || property.meta?.bedrooms || 0,
      bathrooms: property.acf?.bathrooms || property.meta?.bathrooms || 0,
      location: property.acf?.location || property.meta?.location || '',
      property_type: property.acf?.property_type || property.meta?.property_type || '',
      square_footage: property.acf?.square_footage || property.meta?.square_footage || 0,
      features: property.acf?.features || property.meta?.features || [],
      images: property.acf?.property_images || []
    }));
  } catch (error) {
    console.error('Error fetching featured properties:', error);
    return [];
  }
}

/**
 * Fetches property categories
 * @returns {Promise<Array>} - List of property categories
 */
export async function getPropertyCategories() {
  try {
    const url = buildProxyUrl('/wp/v2/property_category?_embed&per_page=100');
    console.log('Fetching property categories from:', url);

    const response = await fetchWithTimeout(url);
    const categories = await response.json();

    console.log(`Fetched ${categories.length} property categories`);

    return categories.map(category => ({
      id: category.id,
      slug: category.slug,
      name: category.name,
      description: category.description,
      count: category.count,
      image: category.acf?.category_image || null
    }));
  } catch (error) {
    console.error('Error fetching property categories:', error);
    return [];
  }
}