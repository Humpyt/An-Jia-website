/**
 * WordPress API service for fetching property data
 */

// Import Property type for JSDoc
/**
 * @typedef {import('@/app/types/property').Property} Property
 */

// WordPress API proxy URL
const API_PROXY_URL = '/api/wordpress';
const WORDPRESS_API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'http://anjia-wordpress.local/wp-json';

// Default timeout for fetch requests (30 seconds)
const FETCH_TIMEOUT = 30000;

// Removed Deepseek API configuration

// Helper function to build proxy URL
function buildProxyUrl(path) {
  if (typeof window !== 'undefined') {
    const url = new URL(API_PROXY_URL, window.location.origin);
    url.searchParams.set('path', path);
    return url.toString();
  }
  return `${WORDPRESS_API_URL}${path}`;
}

// In-memory cache for API responses
const API_CACHE = new Map();
const DEFAULT_CACHE_DURATION = 1000 * 60 * 5; // 5 minutes default cache

// Helper function to fetch with timeout and caching
export async function fetchWithTimeout(url, options = {}) {
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

    if (!response.ok) {
      let errorMessage;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || `HTTP Error ${response.status}`;
      } catch (e) {
        errorMessage = `HTTP Error ${response.status}`;
      }

      throw new Error(errorMessage);
    }

    // Cache the response if it's a GET request and caching is enabled
    if ((!fetchOptions.method || fetchOptions.method === 'GET') && cache !== 'no-store') {
      API_CACHE.set(cacheKey, {
        timestamp: Date.now(),
        response: response.clone()
      });
    }

    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Request timeout');
    }
    throw error;
  }
}

// Cache for property listings
const PROPERTY_LISTINGS_CACHE = new Map();
const PROPERTY_LISTINGS_CACHE_DURATION = 1000 * 60 * 5; // 5 minutes

/**
 * Fetch properties with filters
 * @param {Object} options - Filter options
 * @returns {Promise<Array>} - Array of properties
 */
export async function getPropertiesWithFilters(options = {}) {
  const { limit = 10, offset = 0, filters = {}, skipCache = false } = options;
  const { location, minPrice, maxPrice, bedrooms, bathrooms, amenities, propertyType } = filters;

  try {
    // Build query parameters
    let queryParams = new URLSearchParams({
      per_page: limit.toString(),
      offset: offset.toString(),
      _embed: 'true', // This ensures we get featured images and other embedded content
      _fields: 'id,title,acf,featured_media,_embedded,_links' // Only get the fields we need
    });

    // Add filters to query params
    if (location) {
      queryParams.append('acf_location', location);
    }

    if (minPrice) {
      queryParams.append('acf_min_price', minPrice.toString());
    }

    if (maxPrice) {
      queryParams.append('acf_max_price', maxPrice.toString());
    }

    if (bedrooms) {
      queryParams.append('acf_bedrooms', bedrooms.toString());
    }

    if (bathrooms) {
      queryParams.append('acf_bathrooms', bathrooms.toString());
    }

    if (amenities && amenities.length > 0) {
      queryParams.append('acf_amenities', amenities.join(','));
    }

    if (propertyType) {
      queryParams.append('acf_property_type', propertyType);
    }

    // Generate a cache key based on the query parameters
    const cacheKey = queryParams.toString();

    // Check if we have a cached result for this query
    if (!skipCache) {
      const cachedResult = PROPERTY_LISTINGS_CACHE.get(cacheKey);
      if (cachedResult && (Date.now() - cachedResult.timestamp < PROPERTY_LISTINGS_CACHE_DURATION)) {
        console.log(`Using cached property listings for query: ${cacheKey}`);
        return cachedResult.data;
      }
    }

    console.log('Fetching properties with filters:', options);
    const url = buildProxyUrl(`/wp/v2/property?${queryParams.toString()}`);

    // Use our robust fetch implementation with caching
    const response = await fetchWithTimeout(url, {
      cache: 'default',
      cacheDuration: PROPERTY_LISTINGS_CACHE_DURATION
    });

    // Get the total count of properties from the headers
    const totalCount = parseInt(response.headers.get('X-WP-Total') || '0');
    const totalPages = parseInt(response.headers.get('X-WP-TotalPages') || '0');

    console.log(`Total properties: ${totalCount}, Total pages: ${totalPages}`);

    const properties = await response.json();
    console.log(`Successfully fetched ${properties.length} properties`);

    // If we received properties but the array is empty, return empty array with metadata
    if (!properties || properties.length === 0) {
      console.log('No properties found');
      return { properties: [], totalCount: 0, totalPages: 0 };
    }

    // Process properties in batches to avoid overwhelming the system
    const BATCH_SIZE = 5;
    const transformedProperties = [];

    for (let i = 0; i < properties.length; i += BATCH_SIZE) {
      const batch = properties.slice(i, i + BATCH_SIZE);
      const batchResults = await Promise.all(
        batch.map(property => transformPropertyData(property, true)) // Skip description enhancement for listing views
      );
      transformedProperties.push(...batchResults);
    }

    // Prepare the result object with properties and metadata
    const result = {
      properties: transformedProperties,
      totalCount,
      totalPages
    };

    // Cache the transformed properties and metadata
    PROPERTY_LISTINGS_CACHE.set(cacheKey, {
      timestamp: Date.now(),
      data: result
    });

    return result;
  } catch (error) {
    console.error('Error fetching properties:', error);

    // If API fails, return empty result with metadata
    return { properties: [], totalCount: 0, totalPages: 0 };
  }
}

// Cache for individual property details
const PROPERTY_DETAILS_CACHE = new Map();
const PROPERTY_DETAILS_CACHE_DURATION = 1000 * 60 * 10; // 10 minutes

/**
 * Fetch a single property by ID
 * @param {string} id - Property ID
 * @param {boolean} skipCache - Whether to skip cache and force a fresh fetch
 * @returns {Promise<Property|null>} - Property data or null
 */
export async function getPropertyById(id, skipCache = false) {
  try {
    // Check if id is valid
    if (!id || id === 'undefined' || id === 'null') {
      throw new Error(`Invalid property ID: ${id}`);
    }

    // Check if we have this property in cache
    const cacheKey = `property-detail-${id}`;
    if (!skipCache) {
      const cachedProperty = PROPERTY_DETAILS_CACHE.get(cacheKey);
      if (cachedProperty && (Date.now() - cachedProperty.timestamp < PROPERTY_DETAILS_CACHE_DURATION)) {
        console.log(`Using cached property details for ID: ${id}`);
        return cachedProperty.data;
      }
    }

    // Import the property fallback system - this is a direct import which is safer for Next.js
    const { getFallbackProperty } = await import('./property-fallback.js');

    // First try with WordPress API
    try {
      console.log(`Fetching WordPress property with ID: ${id}`);
      const url = buildProxyUrl(`/wp/v2/property/${id}?_embed`);

      // Time the request for debugging
      const startTime = Date.now();
      const response = await fetchWithTimeout(url, {
        cache: skipCache ? 'no-store' : 'default',
        cacheDuration: PROPERTY_DETAILS_CACHE_DURATION,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      });
      console.log(`WordPress API response time: ${Date.now() - startTime}ms`);

      // Check for valid response
      if (!response.ok) {
        throw new Error(`API returned ${response.status}: ${response.statusText}`);
      }

      const property = await response.json();

      if (!property || !property.id) {
        throw new Error(`Invalid property data received for ID: ${id}`);
      }

      // Transform the property data
      const transformedProperty = await transformPropertyData(property, false); // Don't skip enhancement for detail view

      // Add agent information
      const propertyWithAgent = {
        ...transformedProperty,
        agents: {
          id: "agent-1",
          name: "John Doe",
          email: "john.doe@example.com",
          phone: "+256 701 234 567",
          company: "An Jia You Xuan Real Estate"
        }
      };

      // Cache the property details
      PROPERTY_DETAILS_CACHE.set(cacheKey, {
        timestamp: Date.now(),
        data: propertyWithAgent
      });

      return propertyWithAgent;
    } catch (apiError) {
      console.error(`WordPress API error for property ${id}:`, apiError.message);
      console.log('Falling back to pre-defined property data');

      // Use the fallback property if WordPress API fails
      const fallbackProperty = getFallbackProperty(id);

      // Cache the fallback property
      PROPERTY_DETAILS_CACHE.set(cacheKey, {
        timestamp: Date.now(),
        data: fallbackProperty
      });

      return fallbackProperty;
    }
  } catch (error) {
    console.error(`Error in getPropertyById for ${id}:`, error.message);

    // Even if our fallback mechanism fails, return a minimal valid property
    const minimalProperty = {
      id: id.toString(),
      title: "Property Information",
      description: "<p>Property details are being updated.</p>",
      location: "An Jia Properties",
      price: "Contact agent",
      currency: "USD",
      // Ensure bedrooms and bathrooms are included
      bedrooms: "0",
      bathrooms: "0",
      // Include a standard set of amenities
      amenities: ["WiFi", "Parking", "Security", "Swimming Pool", "Gym"],
      images: [
        "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800"
      ],
      propertyType: "property",
      agents: {
        id: "agent-1",
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "+256 701 234 567",
        company: "An Jia You Xuan Real Estate"
      }
    };

    return minimalProperty;
  }
}

// No description enhancement - removed Deepseek API integration

// Cache for transformed property data
const PROPERTY_CACHE = new Map();
const PROPERTY_CACHE_DURATION = 1000 * 60 * 15; // 15 minutes

/**
 * Transform WordPress property data to match our existing frontend structure
 * @param {Object} wpProperty - Raw WordPress property data
 * @param {boolean} skipEnhancement - Whether to skip description enhancement
 * @returns {Promise<Property>} - Transformed property data
 */
export async function transformPropertyData(wpProperty, skipEnhancement = false) {
  try {
    // Check if we have this property in cache
    const cacheKey = `property-${wpProperty.id}`;
    const cachedProperty = PROPERTY_CACHE.get(cacheKey);
    if (cachedProperty && (Date.now() - cachedProperty.timestamp < PROPERTY_CACHE_DURATION)) {
      console.log(`Using cached property data for ID: ${wpProperty.id}`);
      return cachedProperty.data;
    }

    // Extract featured image URL - optimized to avoid deep nesting
    let featuredImageUrl = '';
    const featuredMedia = wpProperty._embedded?.['wp:featuredmedia']?.[0];
    if (featuredMedia?.source_url) {
      featuredImageUrl = featuredMedia.source_url;
    } else if (wpProperty.featured_media) {
      // We have a featured media ID but no embedded data
      featuredImageUrl = `/wp-content/uploads/default-image.jpg`; // Fallback image
    }

    // Extract ACF fields or use meta fields as fallback
    const acf = wpProperty.acf || wpProperty.meta || {};

    // Extract gallery images from the new gallery field
    const galleryImages = Array.isArray(wpProperty.gallery_images)
      ? wpProperty.gallery_images.map(img => img.url || img.large || '')
      : [];

    // Get the original description - no enhancement
    const description = wpProperty.content?.rendered || '';

    // Log the ACF fields for debugging
    console.log('ACF fields for property:', wpProperty.id, {
      bedrooms: acf.bedrooms,
      bathrooms: acf.bathrooms,
      amenities: acf.amenities
    });

    // Create the transformed property object
    const transformedProperty = {
      id: wpProperty.id?.toString() || '',
      title: wpProperty.title?.rendered || '',
      location: acf.location || '',
      floor: acf.floor?.toString() || undefined,
      // Ensure bedrooms and bathrooms are always fetched from backend
      bedrooms: acf.bedrooms?.toString() || '0',
      bathrooms: acf.bathrooms?.toString() || '0',
      units: acf.units?.toString() || undefined,
      price: acf.price?.toString() || '0',
      currency: acf.currency || 'USD',
      paymentTerms: acf.payment_terms || 'Monthly',
      // Ensure amenities are always fetched from backend with special handling for Alma Residences
      amenities: (() => {
        // First check if we have direct amenities data from the API
        if (Array.isArray(wpProperty.amenities) && wpProperty.amenities.length > 0) {
          console.log('Using direct amenities from API:', wpProperty.amenities);
          return wpProperty.amenities;
        }
        // Then check ACF fields
        else if (Array.isArray(acf.amenities) && acf.amenities.length > 0) {
          console.log('Using amenities from ACF:', acf.amenities);
          return acf.amenities;
        }
        // Handle string format (comma separated)
        else if (typeof acf.amenities === 'string' && acf.amenities.trim() !== '') {
          const parsed = acf.amenities.split(',').map(a => a.trim());
          console.log('Using parsed amenities from string:', parsed);
          return parsed;
        }
        // Check if amenities are stored in property_amenities field (common ACF pattern)
        else if (Array.isArray(acf.property_amenities) && acf.property_amenities.length > 0) {
          console.log('Using amenities from property_amenities field:', acf.property_amenities);
          return acf.property_amenities;
        }
        // Check if we have the special Alma Residences property
        else if (wpProperty.title?.rendered?.includes('Alma Residences')) {
          console.log('Using special amenities for Alma Residences');
          return ['parking', 'security', 'furnished', 'balcony'];
        }
        // Default fallback
        else {
          console.log('Using default amenities fallback');
          return ["wifi", "parking", "security", "swimming_pool", "gym"];
        }
      })(),
      ownerName: acf.owner_name || '',
      ownerContact: acf.owner_contact || '',
      googlePin: acf.google_pin || undefined,
      isPremium: acf.is_premium || false,
      images: galleryImages.length > 0 ? galleryImages : (featuredImageUrl ? [featuredImageUrl] : []),
      description: description,
      propertyType: acf.property_type || 'apartment',
      squareMeters: acf.square_meters?.toString() || undefined
    };

    // Cache the transformed property
    PROPERTY_CACHE.set(cacheKey, {
      timestamp: Date.now(),
      data: transformedProperty
    });

    return transformedProperty;
  } catch (error) {
    console.error('Error transforming property data:', error);
    // Return a minimal valid property object if transformation fails
    return {
      id: wpProperty.id?.toString() || 'unknown',
      title: wpProperty.title?.rendered || 'Error Loading Property',
      description: 'Error loading property details',
      location: '',
      price: '0',
      currency: 'USD',
      // Ensure bedrooms and bathrooms are included
      bedrooms: '0',
      bathrooms: '0',
      // Include a standard set of amenities
      amenities: ["WiFi", "Parking", "Security", "Swimming Pool", "Gym"],
      images: [],
      propertyType: 'unknown'
    };
  }
}

/**
 * Save property (for user favorites)
 * @param {string} propertyId - Property ID
 * @param {string} userId - User ID
 * @returns {Promise<Object>} - Result object
 */
export async function saveProperty(propertyId, userId) {
  console.log(`Property ${propertyId} saved by user ${userId}`);
  return { success: true, message: "Property saved successfully" };
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
    const url = buildProxyUrl('/wp/v2/neighborhood?per_page=20&_embed');

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
  } catch (error) {
    console.error('Error fetching neighborhoods:', error);
    return [];
  }
}

/**
 * Unsave property (remove from favorites)
 * @param {string} propertyId - Property ID
 * @param {string} userId - User ID
 * @returns {Promise<Object>} - Result object
 */
export async function unsaveProperty(propertyId, userId) {
  console.log(`Property ${propertyId} unsaved by user ${userId}`);
  return { success: true, message: "Property unsaved successfully" };
}

/**
 * Submit property inquiry
 * @param {Object} data - Inquiry data
 * @returns {Promise<Object>} - Result object
 */
export async function submitInquiry(data) {
  console.log(`Inquiry submitted for property ${data.propertyId}:`, data);
  return { success: true, message: "Inquiry submitted successfully" };
}

/**
 * Increment property views
 * @param {string} propertyId - Property ID
 * @param {string} userId - User ID (optional)
 * @returns {Promise<Object>} - Result object
 */
export async function incrementPropertyViews(propertyId, userId) {
  console.log(`Property ${propertyId} viewed by user ${userId || 'anonymous'}`);
  return { success: true };
}

/**
 * Create a new property in WordPress
 * @param {Object} data - Property data
 * @returns {Promise<Object>} - Created property data
 */
/**
 * Clear all caches or specific cache types
 * @param {string} cacheType - Type of cache to clear ('all', 'api', 'properties', 'descriptions')
 * @returns {Object} - Result with counts of cleared items
 */
export function clearCache(cacheType = 'all') {
  const result = {
    apiCache: 0,
    propertyListingsCache: 0,
    propertyDetailsCache: 0,
    propertyCache: 0,
    descriptionCache: 0,
    total: 0
  };

  if (cacheType === 'all' || cacheType === 'api') {
    result.apiCache = API_CACHE.size;
    API_CACHE.clear();
  }

  if (cacheType === 'all' || cacheType === 'properties' || cacheType === 'listings') {
    result.propertyListingsCache = PROPERTY_LISTINGS_CACHE.size;
    PROPERTY_LISTINGS_CACHE.clear();
  }

  if (cacheType === 'all' || cacheType === 'properties' || cacheType === 'details') {
    result.propertyDetailsCache = PROPERTY_DETAILS_CACHE.size;
    PROPERTY_DETAILS_CACHE.clear();
  }

  if (cacheType === 'all' || cacheType === 'properties') {
    result.propertyCache = PROPERTY_CACHE.size;
    PROPERTY_CACHE.clear();
  }

  if (cacheType === 'all' || cacheType === 'descriptions') {
    result.descriptionCache = DESCRIPTION_CACHE.size;
    DESCRIPTION_CACHE.clear();
  }

  result.total = result.apiCache + result.propertyListingsCache +
                result.propertyDetailsCache + result.propertyCache +
                result.descriptionCache;

  console.log(`Cleared ${result.total} cached items:`, result);
  return result;
}

/**
 * Get cache statistics
 * @returns {Object} - Cache statistics
 */
export function getCacheStats() {
  return {
    apiCache: API_CACHE.size,
    propertyListingsCache: PROPERTY_LISTINGS_CACHE.size,
    propertyDetailsCache: PROPERTY_DETAILS_CACHE.size,
    propertyCache: PROPERTY_CACHE.size,
    descriptionCache: DESCRIPTION_CACHE.size,
    total: API_CACHE.size + PROPERTY_LISTINGS_CACHE.size +
           PROPERTY_DETAILS_CACHE.size + PROPERTY_CACHE.size +
           DESCRIPTION_CACHE.size
  };
}

export async function createProperty(data) {
  try {
    console.log('Creating property with data:', data);

    // First, create the property post
    const createPostResponse = await fetchWithTimeout(buildProxyUrl('/wp/v2/property'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add authorization header here when ready
        // 'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        title: data.title,
        content: data.description,
        status: 'publish',
        acf: {
          property_type: data.propertyType,
          bedrooms: data.bedrooms,
          location: data.location,
          floor: data.floor,
          units: data.units,
          price: data.price,
          currency: data.currency,
          payment_terms: data.paymentTerms,
          amenities: Array.isArray(data.amenities) ? data.amenities : [],
          owner_name: data.ownerName,
          owner_contact: data.ownerContact,
          google_pin: data.googlePin,
          is_premium: data.isPremium,
          square_meters: data.squareMeters,
          description: data.description
        }
      }),
      cache: 'no-store' // Ensure we don't use cache for POST requests
    });

    const createdPost = await createPostResponse.json();
    console.log('Property post created:', createdPost);

    // Then, upload images if provided
    if (data.images && data.images.length > 0) {
      const imagePromises = data.images.map(async (image, index) => {
        const formData = new FormData();
        formData.append('file', image);
        formData.append('title', `${data.title} - Image ${index + 1}`);

        const uploadResponse = await fetchWithTimeout(buildProxyUrl('/wp/v2/media'), {
          method: 'POST',
          headers: {
            // Add authorization header here when ready
            // 'Authorization': `Bearer ${token}`
          },
          body: formData,
          cache: 'no-store' // Ensure we don't use cache for POST requests
        });

        const uploadedImage = await uploadResponse.json();
        console.log(`Image ${index + 1} uploaded:`, uploadedImage);

        // If this is the first image, set it as the featured image
        if (index === 0) {
          await fetchWithTimeout(buildProxyUrl(`/wp/v2/property/${createdPost.id}`), {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              // Add authorization header here when ready
              // 'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              featured_media: uploadedImage.id
            }),
            cache: 'no-store' // Ensure we don't use cache for POST requests
          });
        }

        return uploadedImage;
      });

      const uploadedImages = await Promise.all(imagePromises);
      console.log('All images uploaded:', uploadedImages);

      // Update the property with the gallery images
      const response = await fetchWithTimeout(buildProxyUrl(`/wp/v2/property/${createdPost.id}?_embed=true`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add authorization header here when ready
          // 'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          meta: {
            gallery_images: uploadedImages.map(img => img.source_url)
          }
        }),
        cache: 'no-store' // Ensure we don't use cache for POST requests
      });
    }

    // Clear property listings cache since we've added a new property
    clearCache('listings');

    // Return the created property data
    return await transformPropertyData(createdPost, false);
  } catch (error) {
    console.error('Error creating property:', error);
    throw error;
  }
}
