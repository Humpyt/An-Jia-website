/**
 * Property Data Service
 *
 * A centralized service for fetching property data with multiple fallback mechanisms
 * to ensure data is always available even when the WordPress API is unavailable.
 */

import { properties as staticProperties } from './property-data';
import { FALLBACK_PROPERTIES, getFallbackProperty } from './property-fallback';

// Cache durations
const PROPERTIES_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const PROPERTY_DETAILS_CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

// In-memory caches
const PROPERTIES_CACHE = new Map();
const PROPERTY_DETAILS_CACHE = new Map();

/**
 * Fetch properties with filters and pagination
 *
 * @param {Object} options - Options for fetching properties
 * @param {number} options.page - Page number (1-based)
 * @param {number} options.limit - Number of properties per page
 * @param {Object} options.filters - Filters to apply
 * @param {string} options.filters.location - Location filter
 * @param {number} options.filters.minPrice - Minimum price filter
 * @param {number} options.filters.maxPrice - Maximum price filter
 * @param {string} options.filters.bedrooms - Bedrooms filter
 * @param {string} options.filters.bathrooms - Bathrooms filter
 * @param {string} options.filters.propertyType - Property type filter
 * @param {boolean} options.skipCache - Whether to skip cache
 * @returns {Promise<Object>} - Properties data with pagination info
 */
export async function getProperties(options = {}) {
  try {
    const {
      page = 1,
      limit = 12,
      filters = {},
      skipCache = false
    } = options;

    // Generate cache key based on options
    const cacheKey = `properties-${page}-${limit}-${JSON.stringify(filters)}`;

    // Check cache first if not skipping
    if (!skipCache) {
      const cached = PROPERTIES_CACHE.get(cacheKey);
      if (cached && (Date.now() - cached.timestamp < PROPERTIES_CACHE_DURATION)) {
        console.log(`Using cached properties for key: ${cacheKey}`);
        return cached.data;
      }
    }

    // Try to fetch from WordPress API using our CORS proxy
    try {
      console.log('Attempting to fetch properties from WordPress API via CORS proxy...');

      // First try with our CORS proxy
      // Build the WordPress API URL
      let wpApiUrl = 'http://wp.ajyxn.com/wp-json/anjia/v1/properties';

      // Add query parameters
      wpApiUrl += `?page=${page}&limit=${limit}`;
      if (filters.location) wpApiUrl += `&location=${encodeURIComponent(filters.location)}`;
      if (filters.minPrice) wpApiUrl += `&min_price=${encodeURIComponent(filters.minPrice)}`;
      if (filters.maxPrice) wpApiUrl += `&max_price=${encodeURIComponent(filters.maxPrice)}`;
      if (filters.bedrooms) wpApiUrl += `&bedrooms=${encodeURIComponent(filters.bedrooms)}`;
      if (filters.bathrooms) wpApiUrl += `&bathrooms=${encodeURIComponent(filters.bathrooms)}`;
      if (filters.propertyType) wpApiUrl += `&property_type=${encodeURIComponent(filters.propertyType)}`;

      // Add cache buster
      wpApiUrl += `&_=${Date.now()}`;

      // Use our CORS proxy
      const corsProxyUrl = `/api/cors-proxy?url=${encodeURIComponent(wpApiUrl)}&no-cache=true`;
      console.log(`Using CORS proxy: ${corsProxyUrl}`);

      // Fetch with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(corsProxyUrl, {
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`WordPress API returned ${response.status}`);
      }

      const data = await response.json();

      // Validate response structure
      if (!data || !Array.isArray(data.properties)) {
        throw new Error('Invalid response structure from WordPress API');
      }

      // Cache the result
      const result = {
        properties: data.properties,
        totalCount: data.totalCount || data.properties.length,
        totalPages: data.totalPages || Math.ceil(data.properties.length / limit),
        currentPage: page
      };

      PROPERTIES_CACHE.set(cacheKey, {
        timestamp: Date.now(),
        data: result
      });

      return result;
    } catch (apiError) {
      console.error('WordPress API error:', apiError);
      console.log('Falling back to static property data...');

      // Use static property data as fallback
      return getStaticProperties(options);
    }
  } catch (error) {
    console.error('Error in getProperties:', error);

    // Final fallback - return minimal valid data
    return {
      properties: FALLBACK_PROPERTIES.slice(0, 5),
      totalCount: FALLBACK_PROPERTIES.length,
      totalPages: Math.ceil(FALLBACK_PROPERTIES.length / 12),
      currentPage: 1
    };
  }
}

/**
 * Get a property by ID
 *
 * @param {string} id - Property ID
 * @param {boolean} skipCache - Whether to skip cache
 * @returns {Promise<Object|null>} - Property data or null
 */
export async function getPropertyById(id, skipCache = false) {
  try {
    if (!id) {
      throw new Error('Property ID is required');
    }

    // Generate cache key
    const cacheKey = `property-${id}`;

    // Check cache first if not skipping
    if (!skipCache) {
      const cached = PROPERTY_DETAILS_CACHE.get(cacheKey);
      if (cached && (Date.now() - cached.timestamp < PROPERTY_DETAILS_CACHE_DURATION)) {
        console.log(`Using cached property details for ID: ${id}`);
        return cached.data;
      }
    }

    // Try to fetch from WordPress API using our CORS proxy
    try {
      console.log(`Attempting to fetch property with ID ${id} from WordPress API via CORS proxy...`);

      // Build WordPress API URL
      const wpApiUrl = `http://wp.ajyxn.com/wp-json/wp/v2/property/${id}?_embed&_=${Date.now()}`;

      // Use our CORS proxy
      const corsProxyUrl = `/api/cors-proxy?url=${encodeURIComponent(wpApiUrl)}&no-cache=true`;
      console.log(`Using CORS proxy: ${corsProxyUrl}`);

      // Fetch with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(corsProxyUrl, {
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`WordPress API returned ${response.status}`);
      }

      const data = await response.json();

      // Validate response
      if (!data || !data.id) {
        throw new Error('Invalid property data from WordPress API');
      }

      // Transform the data to match our expected format
      const property = transformPropertyData(data);

      // Cache the result
      PROPERTY_DETAILS_CACHE.set(cacheKey, {
        timestamp: Date.now(),
        data: property
      });

      return property;
    } catch (apiError) {
      console.error(`WordPress API error for property ${id}:`, apiError);
      console.log('Falling back to static property data...');

      // Try to find in static data first
      const staticProperty = staticProperties.find(p => p.id === id);
      if (staticProperty) {
        console.log(`Found property ${id} in static data`);

        // Cache the result
        PROPERTY_DETAILS_CACHE.set(cacheKey, {
          timestamp: Date.now(),
          data: staticProperty
        });

        return staticProperty;
      }

      // If not found in static data, use fallback
      console.log(`Using fallback property for ID: ${id}`);
      const fallbackProperty = getFallbackProperty(id);

      // Cache the result
      PROPERTY_DETAILS_CACHE.set(cacheKey, {
        timestamp: Date.now(),
        data: fallbackProperty
      });

      return fallbackProperty;
    }
  } catch (error) {
    console.error(`Error in getPropertyById for ${id}:`, error);

    // Final fallback - return minimal valid property
    return {
      id: id.toString(),
      title: "Property Information",
      description: "<p>Property details are being updated.</p>",
      location: "An Jia Properties",
      bedrooms: "0",
      bathrooms: "0",
      price: "Contact for price",
      currency: "USD",
      amenities: ["WiFi", "Parking", "Security"],
      images: ["/images/properties/property-placeholder.svg"],
      propertyType: "property"
    };
  }
}

/**
 * Get properties from static data with filtering and pagination
 *
 * @param {Object} options - Options for fetching properties
 * @returns {Promise<Object>} - Properties data with pagination info
 */
function getStaticProperties(options = {}) {
  const {
    page = 1,
    limit = 12,
    filters = {}
  } = options;

  // Apply filters to static properties
  let filteredProperties = [...staticProperties];

  if (filters.location) {
    filteredProperties = filteredProperties.filter(p =>
      p.location.toLowerCase().includes(filters.location.toLowerCase())
    );
  }

  if (filters.minPrice) {
    const min = parseInt(filters.minPrice);
    filteredProperties = filteredProperties.filter(p => parseInt(p.price) >= min);
  }

  if (filters.maxPrice) {
    const max = parseInt(filters.maxPrice);
    filteredProperties = filteredProperties.filter(p => parseInt(p.price) <= max);
  }

  if (filters.bedrooms && filters.bedrooms !== 'any') {
    filteredProperties = filteredProperties.filter(p => p.bedrooms === filters.bedrooms.toString());
  }

  if (filters.bathrooms && filters.bathrooms !== 'any') {
    filteredProperties = filteredProperties.filter(p => p.bathrooms === filters.bathrooms.toString());
  }

  if (filters.propertyType && filters.propertyType !== 'any') {
    filteredProperties = filteredProperties.filter(p => p.propertyType === filters.propertyType);
  }

  // Apply pagination
  const offset = (page - 1) * limit;
  const paginatedProperties = filteredProperties.slice(offset, offset + limit);

  return {
    properties: paginatedProperties,
    totalCount: filteredProperties.length,
    totalPages: Math.ceil(filteredProperties.length / limit),
    currentPage: page
  };
}

/**
 * Transform WordPress property data to match our expected format
 *
 * @param {Object} wpProperty - WordPress property data
 * @returns {Object} - Transformed property data
 */
function transformPropertyData(wpProperty) {
  // This is a simplified transformation - expand as needed
  return {
    id: wpProperty.id.toString(),
    title: wpProperty.title?.rendered || wpProperty.title || 'Property Listing',
    description: wpProperty.content?.rendered || wpProperty.description || '<p>No description available</p>',
    location: wpProperty.acf?.location || wpProperty.location || 'Location not specified',
    bedrooms: wpProperty.acf?.bedrooms || wpProperty.bedrooms || '0',
    bathrooms: wpProperty.acf?.bathrooms || wpProperty.bathrooms || '0',
    price: wpProperty.acf?.price || wpProperty.price || '0',
    currency: wpProperty.acf?.currency || wpProperty.currency || 'USD',
    amenities: wpProperty.acf?.amenities || wpProperty.amenities || [],
    images: getPropertyImages(wpProperty),
    propertyType: wpProperty.acf?.property_type || wpProperty.propertyType || 'property',
    isPremium: wpProperty.acf?.is_premium || wpProperty.isPremium || false
  };
}

/**
 * Extract images from WordPress property data
 *
 * @param {Object} wpProperty - WordPress property data
 * @returns {Array<string>} - Array of image URLs
 */
function getPropertyImages(wpProperty) {
  // Try to get images from _embedded.wp:featuredmedia
  if (wpProperty._embedded && wpProperty._embedded['wp:featuredmedia']) {
    const media = wpProperty._embedded['wp:featuredmedia'];
    if (Array.isArray(media) && media.length > 0) {
      const images = media
        .filter(m => m.media_type === 'image')
        .map(m => m.source_url || m.link);

      if (images.length > 0) {
        return images;
      }
    }
  }

  // Try to get images from acf.images
  if (wpProperty.acf && wpProperty.acf.images) {
    if (Array.isArray(wpProperty.acf.images) && wpProperty.acf.images.length > 0) {
      return wpProperty.acf.images;
    }
  }

  // If we already have images array, use that
  if (Array.isArray(wpProperty.images) && wpProperty.images.length > 0) {
    return wpProperty.images;
  }

  // Fallback to placeholder
  return ['/images/properties/property-placeholder.svg'];
}
