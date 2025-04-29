/**
 * Property Cache System
 * Provides in-memory caching and fallback data for properties
 */

import { v4 as uuidv4 } from 'uuid';

// In-memory cache for properties
const PROPERTY_CACHE = new Map();
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

// Sample property templates for fallback
const propertyTemplates = [
  {
    template: 'modern-apartment',
    title: 'Modern {bedroom} Bedroom Apartment in {location}',
    description: 'A stunning modern apartment featuring {bedroom} bedrooms and state-of-the-art amenities.',
    propertyType: 'apartment',
    amenities: ['Air Conditioning', 'Parking', 'Security', 'Swimming Pool'],
    priceRange: { min: 100000, max: 500000 },
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800'
    ]
  },
  {
    template: 'luxury-villa',
    title: 'Luxury Villa with {bedroom} Bedrooms in {location}',
    description: 'An exclusive villa offering premium living with {bedroom} bedrooms and luxury finishes.',
    propertyType: 'house',
    amenities: ['Garden', 'Pool', 'Smart Home', 'Security System'],
    priceRange: { min: 500000, max: 2000000 },
    images: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'
    ]
  }
];

// Locations for random generation
const locations = [
  'Downtown', 'Westlands', 'Riverside', 'Parkview', 'Eastgate',
  'Northridge', 'Southbank', 'Central Business District'
];

/**
 * Generate a fallback property based on ID
 */
function generateFallbackProperty(id) {
  const template = propertyTemplates[id % propertyTemplates.length];
  const bedrooms = Math.floor(Math.random() * 4) + 1;
  const location = locations[id % locations.length];
  
  return {
    id: id.toString(),
    title: template.title.replace('{bedroom}', bedrooms).replace('{location}', location),
    description: template.description.replace('{bedroom}', bedrooms),
    location: location,
    bedrooms: bedrooms.toString(),
    price: (template.priceRange.min + Math.random() * (template.priceRange.max - template.priceRange.min)).toFixed(0),
    currency: 'USD',
    amenities: template.amenities,
    images: template.images,
    propertyType: template.propertyType,
    agents: {
      id: "agent-1",
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "+256 701 234 567",
      company: "An Jia You Xuan Real Estate"
    }
  };
}

/**
 * Save property to cache
 */
export function cacheProperty(property) {
  PROPERTY_CACHE.set(property.id.toString(), {
    timestamp: Date.now(),
    data: property
  });
  console.log(`Property ${property.id} saved to cache`);
}

/**
 * Get property from cache
 */
export function getCachedProperty(id) {
  const cachedEntry = PROPERTY_CACHE.get(id.toString());
  
  if (cachedEntry) {
    // Check if cache is still valid
    if (Date.now() - cachedEntry.timestamp < CACHE_DURATION) {
      console.log(`Cache hit for property ${id}`);
      return cachedEntry.data;
    } else {
      // Remove expired cache entry
      console.log(`Cache expired for property ${id}`);
      PROPERTY_CACHE.delete(id.toString());
    }
  }
  
  return null;
}

/**
 * Get property with fallback
 */
export function getPropertyWithFallback(id) {
  console.log(`Generating fallback property for ID: ${id}`);
  // Generate fallback
  const fallback = generateFallbackProperty(parseInt(id) || Math.floor(Math.random() * 1000));
  // Cache the fallback
  cacheProperty(fallback);
  return fallback;
}
