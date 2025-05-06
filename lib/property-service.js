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
 * Get a property by ID - Enhanced version with multiple data sources and robust fallbacks
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
        console.log(`[PROPERTY-SERVICE] Using cached property details for ID: ${id}`);
        return cached.data;
      }
    }

    // Create an array of data sources to try in order
    const dataSources = [
      { name: 'wordpress-api', fn: fetchFromWordPressApi },
      { name: 'static-data', fn: fetchFromStaticData },
      { name: 'fallback-system', fn: fetchFromFallbackSystem }
    ];

    // Try each data source in order until one succeeds
    let lastError = null;
    for (const source of dataSources) {
      try {
        console.log(`[PROPERTY-SERVICE] Trying to fetch property ${id} from ${source.name}...`);
        const property = await source.fn(id);

        if (property) {
          // Add metadata about the source
          property._source = source.name;
          property._fetchedAt = new Date().toISOString();

          // Cache the successful result
          PROPERTY_DETAILS_CACHE.set(cacheKey, {
            timestamp: Date.now(),
            data: property
          });

          console.log(`[PROPERTY-SERVICE] Successfully fetched property ${id} from ${source.name}`);
          return property;
        }
      } catch (error) {
        console.error(`[PROPERTY-SERVICE] Error fetching from ${source.name}:`, error);
        lastError = error;
      }
    }

    // If all data sources failed, throw the last error
    if (lastError) {
      throw lastError;
    }

    // If we get here, all sources returned null but didn't throw
    throw new Error(`Property with ID ${id} not found in any data source`);
  } catch (error) {
    console.error(`[PROPERTY-SERVICE] Error in getPropertyById for ${id}:`, error);

    // Final fallback - return minimal valid property
    const minimalProperty = {
      id: id.toString(),
      title: "Property Information",
      description: "<p>Property details are being updated.</p>",
      location: "An Jia Properties",
      floor: undefined,
      bedrooms: "0",
      bathrooms: "0",
      units: undefined,
      price: "Contact for price",
      currency: "USD",
      paymentTerms: undefined,
      amenities: ["WiFi", "Parking", "Security"],
      ownerName: undefined,
      ownerContact: undefined,
      googlePin: undefined,
      isPremium: false,
      images: ["/images/properties/property-placeholder.jpg"],
      propertyType: "property",
      squareMeters: undefined,
      _source: 'minimal-fallback',
      _fetchedAt: new Date().toISOString()
    };

    return minimalProperty;
  }
}

/**
 * Fetch property from WordPress API
 *
 * @param {string} id - Property ID
 * @returns {Promise<Object|null>} - Property data or null
 */
async function fetchFromWordPressApi(id) {
  // Try both HTTPS and HTTP versions of the API
  const apiUrls = [
    `https://wp.ajyxn.com/wp-json/wp/v2/property/${id}?_embed`,
    `http://wp.ajyxn.com/wp-json/wp/v2/property/${id}?_embed`
  ];

  // Add cache buster
  const cacheBuster = `_=${Date.now()}`;

  // Try each URL
  for (const baseUrl of apiUrls) {
    try {
      const wpApiUrl = `${baseUrl}&${cacheBuster}`;

      // Use our CORS proxy
      const corsProxyUrl = `/api/cors-proxy?url=${encodeURIComponent(wpApiUrl)}&no-cache=true`;
      console.log(`[PROPERTY-SERVICE] Using CORS proxy: ${corsProxyUrl}`);

      // Fetch with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

      const response = await fetch(corsProxyUrl, {
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        console.log(`[PROPERTY-SERVICE] WordPress API returned ${response.status} for ${wpApiUrl}`);
        continue; // Try next URL
      }

      const data = await response.json();

      // Validate response
      if (!data || !data.id) {
        console.log(`[PROPERTY-SERVICE] Invalid property data from WordPress API for ${wpApiUrl}`);
        continue; // Try next URL
      }

      // Transform the data to match our expected format
      return transformPropertyData(data);
    } catch (error) {
      console.error(`[PROPERTY-SERVICE] Error fetching from WordPress API URL:`, error);
      // Continue to next URL
    }
  }

  // If we get here, all URLs failed
  throw new Error('All WordPress API URLs failed');
}

/**
 * Fetch property from static data
 *
 * @param {string} id - Property ID
 * @returns {Promise<Object|null>} - Property data or null
 */
async function fetchFromStaticData(id) {
  // Try to find in static data
  const staticProperty = staticProperties.find(p => p.id === id);

  if (staticProperty) {
    console.log(`[PROPERTY-SERVICE] Found property ${id} in static data`);
    return staticProperty;
  }

  // Not found
  return null;
}

/**
 * Fetch property from fallback system
 *
 * @param {string} id - Property ID
 * @returns {Promise<Object|null>} - Property data or null
 */
async function fetchFromFallbackSystem(id) {
  try {
    console.log(`[PROPERTY-SERVICE] Using fallback property for ID: ${id}`);
    const fallbackProperty = getFallbackProperty(id);
    return fallbackProperty;
  } catch (error) {
    console.error(`[PROPERTY-SERVICE] Error in fallback system:`, error);
    return null;
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
 * Enhanced version with better field extraction and validation
 *
 * @param {Object} wpProperty - WordPress property data
 * @returns {Object} - Transformed property data
 */
function transformPropertyData(wpProperty) {
  try {
    console.log(`[PROPERTY-SERVICE] Transforming property data for ID: ${wpProperty.id}`);

    // Log the raw property data for debugging
    console.log(`[PROPERTY-SERVICE] Raw property data structure:`,
      Object.keys(wpProperty).join(', '));

    // Log ACF fields if available
    if (wpProperty.acf) {
      console.log(`[PROPERTY-SERVICE] ACF fields:`,
        Object.keys(wpProperty.acf).join(', '));
    }

    // Extract ACF fields with more robust fallback handling
    const acf = wpProperty.acf || wpProperty.meta || {};

    // Process amenities with better fallback handling
    let amenities = [];
    if (Array.isArray(acf.amenities) && acf.amenities.length > 0) {
      amenities = acf.amenities;
      console.log(`[PROPERTY-SERVICE] Using amenities from acf.amenities array:`, amenities);
    } else if (typeof acf.amenities === 'string' && acf.amenities.trim() !== '') {
      amenities = acf.amenities.split(',').map(a => a.trim());
      console.log(`[PROPERTY-SERVICE] Using amenities from acf.amenities string:`, amenities);
    } else if (Array.isArray(acf.property_amenities) && acf.property_amenities.length > 0) {
      amenities = acf.property_amenities;
      console.log(`[PROPERTY-SERVICE] Using amenities from acf.property_amenities:`, amenities);
    } else if (Array.isArray(wpProperty.amenities)) {
      amenities = wpProperty.amenities;
      console.log(`[PROPERTY-SERVICE] Using amenities from wpProperty.amenities:`, amenities);
    } else {
      amenities = ["WiFi", "Parking", "Security", "Air Conditioning"];
      console.log(`[PROPERTY-SERVICE] Using default amenities:`, amenities);
    }

    // Handle price with special logging
    let price = '0';
    let priceSource = 'default';

    if (acf.price !== undefined) {
      price = acf.price.toString();
      priceSource = 'acf.price';
    } else if (wpProperty.price !== undefined) {
      price = wpProperty.price.toString();
      priceSource = 'wpProperty.price';
    }

    console.log(`[PROPERTY-SERVICE] Price: ${price} (source: ${priceSource})`);

    // Get all possible images with enhanced logging
    const images = getPropertyImages(wpProperty);
    console.log(`[PROPERTY-SERVICE] Final images array:`, images);

    // Create the transformed property object with all required fields
    const transformedProperty = {
      id: wpProperty.id?.toString() || '',
      title: wpProperty.title?.rendered || wpProperty.title || 'Property Listing',
      description: wpProperty.content?.rendered || wpProperty.description || '<p>No description available</p>',
      location: acf.location || wpProperty.location || 'Location not specified',
      floor: acf.floor?.toString() || wpProperty.floor?.toString() || undefined,
      bedrooms: acf.bedrooms?.toString() || wpProperty.bedrooms?.toString() || '0',
      bathrooms: acf.bathrooms?.toString() || wpProperty.bathrooms?.toString() || '0',
      units: acf.units?.toString() || wpProperty.units?.toString() || undefined,
      price: price,
      currency: acf.currency || wpProperty.currency || 'USD',
      paymentTerms: acf.payment_terms || acf.paymentTerms || wpProperty.paymentTerms || undefined,
      amenities: amenities,
      ownerName: acf.owner_name || acf.ownerName || wpProperty.ownerName || undefined,
      ownerContact: acf.owner_contact || acf.ownerContact || wpProperty.ownerContact || undefined,
      googlePin: acf.google_pin || acf.googlePin || wpProperty.googlePin || undefined,
      isPremium: acf.is_premium || acf.isPremium || wpProperty.isPremium || false,
      images: images,
      propertyType: acf.property_type || acf.propertyType || wpProperty.propertyType || 'property',
      squareMeters: acf.square_meters?.toString() || acf.squareMeters?.toString() || wpProperty.squareMeters?.toString() || undefined,
      agents: wpProperty.agents || {
        id: "agent-1",
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "+256 701 234 567",
        company: "An Jia You Xuan Real Estate"
      },
      // Add debug info
      _debug: {
        priceSource,
        imageCount: images.length,
        hasAcf: !!wpProperty.acf,
        acfFields: wpProperty.acf ? Object.keys(wpProperty.acf) : []
      }
    };

    console.log(`[PROPERTY-SERVICE] Transformed property:`, {
      id: transformedProperty.id,
      title: transformedProperty.title,
      price: transformedProperty.price,
      imageCount: transformedProperty.images.length
    });

    return transformedProperty;
  } catch (error) {
    console.error('[PROPERTY-SERVICE] Error transforming property data:', error);

    // Return a minimal valid property object if transformation fails
    return {
      id: wpProperty?.id?.toString() || 'unknown',
      title: wpProperty?.title?.rendered || 'Error Loading Property',
      description: '<p>Error loading property details. Please try again later.</p>',
      location: 'An Jia Properties',
      bedrooms: '0',
      bathrooms: '0',
      price: 'Contact agent',
      currency: 'USD',
      amenities: ["WiFi", "Parking", "Security"],
      images: ["/images/properties/property-placeholder.jpg"],
      propertyType: 'property'
    };
  }
}

/**
 * Extract images from WordPress property data
 * Enhanced version that checks multiple possible image locations
 * with improved debugging and fallback mechanisms
 *
 * @param {Object} wpProperty - WordPress property data
 * @returns {Array<string>} - Array of image URLs
 */
function getPropertyImages(wpProperty) {
  const images = [];
  const acf = wpProperty.acf || wpProperty.meta || {};

  console.log(`[PROPERTY-SERVICE] Extracting images for property ID: ${wpProperty.id}`);

  // Try to get featured image from _embedded.wp:featuredmedia
  if (wpProperty._embedded && wpProperty._embedded['wp:featuredmedia']) {
    const media = wpProperty._embedded['wp:featuredmedia'];
    console.log(`[PROPERTY-SERVICE] Found wp:featuredmedia with ${media.length} items`);

    if (Array.isArray(media) && media.length > 0) {
      // Log the structure of the first media item to help debug
      if (media[0]) {
        console.log(`[PROPERTY-SERVICE] First media item structure:`,
          Object.keys(media[0]).join(', '));
      }

      const featuredImages = media
        .filter(m => m && (m.media_type === 'image' || !m.media_type))
        .map(m => {
          // Try different possible image URL fields
          const url = m.source_url || m.link || m.guid?.rendered;
          console.log(`[PROPERTY-SERVICE] Found featured image URL: ${url}`);
          return url;
        })
        .filter(Boolean);

      images.push(...featuredImages);
      console.log(`[PROPERTY-SERVICE] Found ${featuredImages.length} featured images`);
    }
  } else {
    console.log(`[PROPERTY-SERVICE] No wp:featuredmedia found in _embedded`);
  }

  // Check for ACF fields
  if (acf) {
    console.log(`[PROPERTY-SERVICE] Checking ACF fields for images:`, Object.keys(acf).join(', '));
  }

  // Check all possible ACF image fields
  const possibleImageFields = [
    'images',
    'property_images',
    'gallery',
    'image_gallery',
    'property_gallery'
  ];

  for (const field of possibleImageFields) {
    if (acf[field]) {
      console.log(`[PROPERTY-SERVICE] Found ACF field: ${field}, type:`, typeof acf[field]);

      if (Array.isArray(acf[field])) {
        console.log(`[PROPERTY-SERVICE] ACF field ${field} is an array with ${acf[field].length} items`);

        // If first item exists, log its structure
        if (acf[field][0]) {
          console.log(`[PROPERTY-SERVICE] First item in ${field} structure:`,
            typeof acf[field][0] === 'object' ? Object.keys(acf[field][0]).join(', ') : typeof acf[field][0]);
        }

        // Handle array of image objects
        const fieldImages = acf[field]
          .map(img => {
            if (typeof img === 'string') {
              console.log(`[PROPERTY-SERVICE] Found string image URL in ${field}: ${img}`);
              return img;
            }

            // For object type, try all possible fields
            if (typeof img === 'object' && img !== null) {
              const url = img.url || img.source_url || img.link ||
                     img.large || img.medium || img.thumbnail ||
                     (img.sizes && (img.sizes.large || img.sizes.medium || img.sizes.thumbnail));

              if (url) {
                console.log(`[PROPERTY-SERVICE] Found object image URL in ${field}: ${url}`);
              }
              return url;
            }

            return null;
          })
          .filter(Boolean);

        images.push(...fieldImages);
        console.log(`[PROPERTY-SERVICE] Found ${fieldImages.length} images in acf.${field}`);
      } else if (typeof acf[field] === 'string') {
        // Handle single image URL
        console.log(`[PROPERTY-SERVICE] Found string image URL in acf.${field}: ${acf[field]}`);
        images.push(acf[field]);
      } else if (typeof acf[field] === 'object' && acf[field] !== null) {
        // Handle single image object
        console.log(`[PROPERTY-SERVICE] Found object in acf.${field}:`, Object.keys(acf[field]).join(', '));

        const url = acf[field].url || acf[field].source_url || acf[field].link;
        if (url) {
          console.log(`[PROPERTY-SERVICE] Extracted URL from object in acf.${field}: ${url}`);
          images.push(url);
        }
      }
    }
  }

  // If we already have images array in the property, use that too
  if (Array.isArray(wpProperty.images) && wpProperty.images.length > 0) {
    console.log(`[PROPERTY-SERVICE] Found ${wpProperty.images.length} images in property.images`);
    images.push(...wpProperty.images);
  }

  // Check for featured_image field
  if (wpProperty.featured_image) {
    console.log(`[PROPERTY-SERVICE] Found featured_image: ${wpProperty.featured_image}`);
    images.push(wpProperty.featured_image);
  }

  // Check for featured_media_url field (sometimes used in WordPress)
  if (wpProperty.featured_media_url) {
    console.log(`[PROPERTY-SERVICE] Found featured_media_url: ${wpProperty.featured_media_url}`);
    images.push(wpProperty.featured_media_url);
  }

  // Remove duplicates and filter out any invalid URLs
  const uniqueImages = [...new Set(images)]
    .filter(url => {
      const isValid = url && typeof url === 'string' && url.length > 0;
      if (!isValid) {
        console.log(`[PROPERTY-SERVICE] Filtering out invalid image URL: ${url}`);
      }
      return isValid;
    })
    .map(url => {
      // Ensure URLs are absolute
      if (url.startsWith('/')) {
        // Convert relative URL to absolute using the WordPress domain
        const absoluteUrl = `https://wp.ajyxn.com${url}`;
        console.log(`[PROPERTY-SERVICE] Converting relative URL to absolute: ${url} -> ${absoluteUrl}`);
        return absoluteUrl;
      }
      return url;
    });

  console.log(`[PROPERTY-SERVICE] Total unique images found: ${uniqueImages.length}`);

  // If no images found, use placeholder
  if (uniqueImages.length === 0) {
    console.log(`[PROPERTY-SERVICE] No images found, using placeholder`);
    return ['/images/properties/property-placeholder.jpg'];
  }

  // Add fallback image at the end in case the other images fail to load
  uniqueImages.push('/images/properties/property-placeholder.jpg');

  return uniqueImages;
}
