/**
 * Property Fallback System
 * Provides fallback properties when the WordPress API is unavailable
 */

// Sample fallback properties - Updated with correct WordPress property IDs
export const FALLBACK_PROPERTIES = [
  {
    id: '224',
    title: 'Bugolobi Apartments',
    description: '<p>A stunning modern apartment featuring 2 bedrooms and state-of-the-art amenities including a spacious living area, modern kitchen, and private balcony with city views.</p>',
    location: 'Bugolobi',
    floor: '5',
    bedrooms: '2',
    bathrooms: '1',
    price: '1300',
    currency: 'USD',
    paymentTerms: 'Monthly',
    amenities: ['Air Conditioning', 'Parking', 'Security', 'Swimming Pool'],
    ownerName: 'Todo Humphrey',
    ownerContact: '+256 787 022 105',
    isPremium: true,
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800'
    ],
    propertyType: 'apartment',
    squareMeters: '120',
    agents: {
      id: "agent-1",
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "+256 701 234 567",
      company: "An Jia You Xuan Real Estate"
    }
  },
  {
    id: '212',
    title: 'Lime Trees Residences',
    description: '<p>An exclusive residence offering premium living with luxury finishes. Features include a swimming pool, garden, modern kitchen, and spacious living areas.</p>',
    location: 'Kololo',
    floor: '0',
    bedrooms: '3',
    bathrooms: '2',
    price: '2000',
    currency: 'USD',
    paymentTerms: 'Yearly',
    amenities: ['Garden', 'Pool', 'Smart Home', 'Security System'],
    ownerName: 'Robert Johnson',
    ownerContact: '+256 702 345 678',
    isPremium: true,
    images: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'
    ],
    propertyType: 'house',
    squareMeters: '350',
    agents: {
      id: "agent-2",
      name: "Jane Smith",
      email: "jane.smith@example.com",
      phone: "+256 703 456 789",
      company: "An Jia You Xuan Real Estate"
    }
  },
  {
    id: '193',
    title: 'Lime Trees Residences Studio',
    description: '<p>Cozy studio apartment perfect for singles or couples. Located in Lime Trees Residences with easy access to public transportation and shopping centers.</p>',
    location: 'Kololo',
    floor: '2',
    bedrooms: '1',
    bathrooms: '1',
    price: '500',
    currency: 'USD',
    paymentTerms: 'Monthly',
    amenities: ['Parking', 'Security', 'Elevator', 'Air Conditioning'],
    ownerName: 'Commercial Properties Ltd',
    ownerContact: '+256 704 567 890',
    isPremium: false,
    images: [
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800',
      'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800'
    ],
    propertyType: 'apartment',
    squareMeters: '45',
    agents: {
      id: "agent-3",
      name: "Michael Brown",
      email: "michael.brown@example.com",
      phone: "+256 705 678 901",
      company: "An Jia You Xuan Real Estate"
    }
  },
  {
    id: '182',
    title: 'Kololo Residences',
    description: '<p>A beautifully designed residence located in the prestigious Kololo area. Features include a modern kitchen, spacious living room, and excellent amenities.</p>',
    location: 'Kololo',
    floor: '3',
    bedrooms: '2',
    bathrooms: '2',
    price: '1200',
    currency: 'USD',
    paymentTerms: 'Monthly',
    amenities: ['Parking', 'Security', 'Garden', 'Modern Kitchen'],
    ownerName: 'Sarah Johnson',
    ownerContact: '+256 706 789 012',
    isPremium: false,
    images: [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'
    ],
    propertyType: 'apartment',
    squareMeters: '85',
    agents: {
      id: "agent-1",
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "+256 701 234 567",
      company: "An Jia You Xuan Real Estate"
    }
  },
  {
    id: '164',
    title: 'Melinium Apartments',
    description: '<p>Modern apartments in the Melinium complex offering contemporary living spaces with excellent amenities and convenient location.</p>',
    location: 'Kololo',
    bedrooms: '3',
    bathrooms: '3',
    price: '2500',
    currency: 'USD',
    paymentTerms: 'Monthly',
    amenities: ['Swimming Pool', 'Gym', 'Security', 'Parking'],
    ownerName: 'Development Properties Inc',
    ownerContact: '+256 707 890 123',
    isPremium: true,
    images: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800',
      'https://images.unsplash.com/photo-1500076656116-558758c991c1?w=800'
    ],
    propertyType: 'apartment',
    squareMeters: '120',
    agents: {
      id: "agent-2",
      name: "Jane Smith",
      email: "jane.smith@example.com",
      phone: "+256 703 456 789",
      company: "An Jia You Xuan Real Estate"
    }
  }
];

/**
 * Get fallback property by ID
 * Updated to handle WordPress property IDs
 */
export function getFallbackProperty(id) {
  console.log(`[FALLBACK] Looking for property with ID: ${id}`);

  // Try to find by exact ID match
  const exactMatch = FALLBACK_PROPERTIES.find(p => p.id === id.toString());
  if (exactMatch) {
    console.log(`[FALLBACK] Found exact match for ID: ${id}`);
    return exactMatch;
  }

  // List of known WordPress property IDs
  const knownIds = ['224', '212', '193', '182', '164', '159', '154', '143', '141'];

  // If the requested ID is a small number (like 1, 2, 3), map it to a known WordPress ID
  if (parseInt(id) >= 0 && parseInt(id) < 10) {
    const mappedId = knownIds[parseInt(id) % knownIds.length];
    console.log(`[FALLBACK] Mapping small ID ${id} to WordPress ID: ${mappedId}`);

    const mappedProperty = FALLBACK_PROPERTIES.find(p => p.id === mappedId);
    if (mappedProperty) {
      // Create a copy with the requested ID
      const propertyWithRequestedId = {
        ...mappedProperty,
        id: id.toString()
      };
      return propertyWithRequestedId;
    }
  }

  // Otherwise return property based on ID modulo
  const index = (parseInt(id) || 0) % FALLBACK_PROPERTIES.length;
  console.log(`[FALLBACK] Using fallback at index ${index} for ID: ${id}`);

  // Create a copy with the requested ID
  const fallbackProperty = {
    ...FALLBACK_PROPERTIES[index],
    id: id.toString()
  };

  return fallbackProperty;
}

/**
 * Get all fallback properties
 */
export function getAllFallbackProperties() {
  return FALLBACK_PROPERTIES;
}
