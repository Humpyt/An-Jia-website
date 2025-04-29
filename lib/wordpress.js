/**
 * WordPress API service for fetching property data
 */

// WordPress site URL - Direct connection to WordPress
const WORDPRESS_API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 
  (typeof window === 'undefined' ? 'http://anjia-wordpress.local/wp-json' : '/wp-json');

// Default timeout for fetch requests (30 seconds)
const FETCH_TIMEOUT = 30000;

// Helper function to fetch with timeout
async function fetchWithTimeout(url, options = {}) {
  console.log('Attempting to fetch:', url);
  const controller = new AbortController();
  const { signal } = controller;
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(options.headers || {})
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
    
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Request timeout');
    }
    throw error;
  }
}

/**
 * Fetch properties with filters
 * @param {Object} options - Filter options
 * @returns {Promise<Array>} - Array of properties
 */
export async function getPropertiesWithFilters(options = {}) {
  const { limit = 10, offset = 0, filters = {} } = options;
  const { location, minPrice, maxPrice, bedrooms, bathrooms, amenities } = filters;
  
  try {
    console.log('Fetching properties with filters:', options);
    
    // Build query parameters
    let queryParams = new URLSearchParams({
      per_page: limit.toString(),
      offset: offset.toString(),
      _embed: 'true' // This ensures we get featured images and other embedded content
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
    
    const url = `${WORDPRESS_API_URL}/wp/v2/property?${queryParams.toString()}`;
    console.log('Fetching from URL:', url);
    
    // Use our robust fetch implementation
    const response = await fetchWithTimeout(url, {
      next: { revalidate: 60 }
    });
    
    const properties = await response.json();
    console.log(`Successfully fetched ${properties.length} properties`);
    
    // If we received properties but the array is empty, return empty array
    if (!properties || properties.length === 0) {
      console.log('No properties found');
      return [];
    }
    
    // Map the properties to our frontend structure
    const transformedProperties = properties.map(property => {
      try {
        return transformPropertyData(property);
      } catch (transformError) {
        console.error('Error transforming property data:', transformError, property);
        // Return a minimal valid property object if transformation fails
        return {
          id: property.id?.toString() || 'unknown',
          title: property.title?.rendered || 'Unknown Property',
          description: property.content?.rendered || '',
          location: '',
          price: '0',
          currency: 'USD',
          bedrooms: '0',
          amenities: [],
          images: [],
          propertyType: 'unknown'
        };
      }
    });
    
    return transformedProperties;
  } catch (error) {
    console.error('Error fetching properties:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack
    });
    
    // If API fails, return empty array
    return [];
  }
}

/**
 * Fetch a single property by ID
 * @param {string} id - Property ID
 * @returns {Promise<Object|null>} - Property data or null
 */
export async function getPropertyById(id) {
  try {
    // Check if id is valid
    if (!id || id === 'undefined' || id === 'null') {
      throw new Error(`Invalid property ID: ${id}`);
    }
    
    // Import the property fallback system - this is a direct import which is safer for Next.js
    const { getFallbackProperty } = await import('./property-fallback.js');
    
    // First try with WordPress API
    try {
      console.log(`Attempting to fetch WordPress property with ID: ${id}`);
      const url = `${WORDPRESS_API_URL}/wp/v2/property/${id}?_embed`;
      
      // Time the request for debugging
      const startTime = Date.now();
      const response = await fetch(url, {
        next: { revalidate: 60 },
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        cache: 'no-store' // Disable caching to ensure fresh response
      });
      console.log(`WordPress API response time: ${Date.now() - startTime}ms`);
      
      // Check for valid response
      if (!response.ok) {
        throw new Error(`API returned ${response.status}: ${response.statusText}`);
      }
      
      const property = await response.json();
      console.log('WordPress API response received, transforming data...');
      
      if (!property || !property.id) {
        throw new Error(`Invalid property data received for ID: ${id}`);
      }
      
      const transformedProperty = transformPropertyData(property);
      return {
        ...transformedProperty,
        agents: {
          id: "agent-1",
          name: "John Doe",
          email: "john.doe@example.com",
          phone: "+256 701 234 567",
          company: "An Jia You Xuan Real Estate"
        }
      };
    } catch (apiError) {
      console.error(`WordPress API error for property ${id}:`, apiError.message);
      console.log('Falling back to pre-defined property data');
      
      // Use the fallback property if WordPress API fails
      return getFallbackProperty(id);
    }
  } catch (error) {
    console.error(`Error in getPropertyById for ${id}:`, error.message);
    
    // Even if our fallback mechanism fails, return a minimal valid property
    return {
      id: id.toString(),
      title: "Property Information",
      description: "<p>Property details are being updated.</p>",
      location: "An Jia Properties",
      price: "Contact agent",
      currency: "USD",
      bedrooms: "0",
      amenities: [],
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
  }
}

/**
 * Transform WordPress property data to match our existing frontend structure
 * @param {Object} wpProperty - Raw WordPress property data
 * @returns {Object} - Transformed property data
 */
function transformPropertyData(wpProperty) {
  // Log the raw property data for debugging
  console.log('Raw WordPress property data:', JSON.stringify(wpProperty, null, 2));
  
  // Extract featured image URL
  let featuredImageUrl = '';
  if (wpProperty._embedded && wpProperty._embedded['wp:featuredmedia'] && 
      wpProperty._embedded['wp:featuredmedia'][0] && 
      wpProperty._embedded['wp:featuredmedia'][0].source_url) {
    featuredImageUrl = wpProperty._embedded['wp:featuredmedia'][0].source_url;
  } else if (wpProperty.featured_media) {
    // We have a featured media ID but no embedded data
    featuredImageUrl = `/wp-content/uploads/default-image.jpg`; // Fallback image
  }
  
  // Extract ACF fields or use meta fields as fallback
  const acf = wpProperty.acf || wpProperty.meta || {};
  
  // Extract gallery images from the new gallery field
  let galleryImages = [];
  if (wpProperty.gallery_images && Array.isArray(wpProperty.gallery_images)) {
    galleryImages = wpProperty.gallery_images.map(img => img.url || img.large || '');
  }
  
  // Convert amenities from ACF to array format
  let amenities = [];
  if (acf.amenities) {
    if (Array.isArray(acf.amenities)) {
      amenities = acf.amenities;
    } else if (typeof acf.amenities === 'string') {
      amenities = [acf.amenities];
    }
  }
  
  // Handle title which could be an object with rendered property
  const title = typeof wpProperty.title === 'object' ? 
    wpProperty.title.rendered : 
    (typeof wpProperty.title === 'string' ? wpProperty.title : '');
  
  // Handle content which could be an object with rendered property
  const description = typeof wpProperty.content === 'object' ? 
    wpProperty.content.rendered : 
    (typeof wpProperty.content === 'string' ? wpProperty.content : '');
  
  return {
    id: wpProperty.id.toString(),
    title: title,
    location: acf.location || '',
    floor: acf.floor?.toString() || '',
    bedrooms: acf.bedrooms?.toString() || '0',
    units: acf.units?.toString() || undefined,
    price: acf.price?.toString() || '0',
    currency: acf.currency || 'USD',
    paymentTerms: acf.payment_terms || 'Monthly',
    amenities: amenities,
    ownerName: acf.owner_name || '',
    ownerContact: acf.owner_contact || '',
    googlePin: acf.google_pin || undefined,
    isPremium: acf.is_premium || false,
    images: galleryImages.length > 0 ? galleryImages : (featuredImageUrl ? [featuredImageUrl] : []),
    description: description,
    propertyType: acf.property_type || 'apartment',
    squareMeters: acf.square_meters?.toString() || undefined
  };
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
export async function createProperty(data) {
  try {
    console.log('Creating property with data:', data);
    
    // First, create the property post
    const createPostResponse = await fetchWithTimeout(`${WORDPRESS_API_URL}/wp/v2/property`, {
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
        meta: {
          property_type: data.propertyType,
          bedrooms: data.bedrooms,
          location: data.location,
          floor: data.floor,
          units: data.units,
          price: data.price,
          currency: data.currency,
          payment_terms: data.paymentTerms,
          amenities: data.amenities,
          owner_name: data.ownerName,
          owner_contact: data.ownerContact,
          google_pin: data.googlePin,
          is_premium: data.isPremium,
          square_meters: data.squareMeters
        }
      })
    });

    const createdPost = await createPostResponse.json();
    console.log('Property post created:', createdPost);

    // Then, upload images if provided
    if (data.images && data.images.length > 0) {
      const imagePromises = data.images.map(async (image, index) => {
        const formData = new FormData();
        formData.append('file', image);
        formData.append('title', `${data.title} - Image ${index + 1}`);
        
        const uploadResponse = await fetchWithTimeout(`${WORDPRESS_API_URL}/wp/v2/media`, {
          method: 'POST',
          headers: {
            // Add authorization header here when ready
            // 'Authorization': `Bearer ${token}`
          },
          body: formData
        });

        const uploadedImage = await uploadResponse.json();
        console.log(`Image ${index + 1} uploaded:`, uploadedImage);

        // If this is the first image, set it as the featured image
        if (index === 0) {
          await fetchWithTimeout(`${WORDPRESS_API_URL}/wp/v2/property/${createdPost.id}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              // Add authorization header here when ready
              // 'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              featured_media: uploadedImage.id
            })
          });
        }

        return uploadedImage;
      });

      const uploadedImages = await Promise.all(imagePromises);
      console.log('All images uploaded:', uploadedImages);

      // Update the property with the gallery images
      await fetchWithTimeout(`${WORDPRESS_API_URL}/wp/v2/property/${createdPost.id}`, {
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
        })
      });
    }

    // Return the created property data
    return transformPropertyData(createdPost);
  } catch (error) {
    console.error('Error creating property:', error);
    throw error;
  }
}
