/**
 * Property Fallback System
 * Provides fallback properties when the WordPress API is unavailable
 */

// Sample fallback properties
export const FALLBACK_PROPERTIES = [
  {
    id: '1',
    title: 'Modern 3 Bedroom Apartment in Downtown',
    description: '<p>A stunning modern apartment featuring 3 bedrooms and state-of-the-art amenities including a spacious living area, modern kitchen, and private balcony with city views.</p>',
    location: 'Downtown',
    floor: '5',
    bedrooms: '3',
    price: '350000',
    currency: 'USD',
    paymentTerms: 'Monthly',
    amenities: ['Air Conditioning', 'Parking', 'Security', 'Swimming Pool'],
    ownerName: 'John Smith',
    ownerContact: '+256 701 234 567',
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
    id: '2',
    title: 'Luxury Villa with 5 Bedrooms in Westlands',
    description: '<p>An exclusive villa offering premium living with 5 bedrooms and luxury finishes. Features include a swimming pool, garden, modern kitchen, and spacious living areas.</p>',
    location: 'Westlands',
    floor: '0',
    bedrooms: '5',
    price: '750000',
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
    id: '3',
    title: 'Commercial Space in Business District',
    description: '<p>Prime commercial space in the heart of the business district. Perfect for office or retail with high foot traffic and excellent visibility.</p>',
    location: 'Business District',
    floor: '2',
    units: '5',
    price: '500000',
    currency: 'USD',
    paymentTerms: 'Yearly',
    amenities: ['Parking', 'Security', 'Elevator', 'Air Conditioning'],
    ownerName: 'Commercial Properties Ltd',
    ownerContact: '+256 704 567 890',
    isPremium: false,
    images: [
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800',
      'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800'
    ],
    propertyType: 'commercial',
    squareMeters: '200',
    agents: {
      id: "agent-3",
      name: "Michael Brown",
      email: "michael.brown@example.com",
      phone: "+256 705 678 901",
      company: "An Jia You Xuan Real Estate"
    }
  },
  {
    id: '4',
    title: 'Cozy 2 Bedroom Apartment near Park',
    description: '<p>A beautifully designed 2 bedroom apartment located near the central park. Features include a modern kitchen, cozy living room, and balcony with park views.</p>',
    location: 'Parkview',
    floor: '3',
    bedrooms: '2',
    price: '250000',
    currency: 'USD',
    paymentTerms: 'Monthly',
    amenities: ['Parking', 'Security', 'Near Park', 'Public Transport'],
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
    id: '5',
    title: 'Vacant Land for Development',
    description: '<p>Prime vacant land perfect for residential or commercial development. Located in a growing area with excellent investment potential.</p>',
    location: 'Eastgate',
    price: '200000',
    currency: 'USD',
    paymentTerms: 'Full Payment',
    amenities: ['Road Access', 'Utilities Available', 'Flat Terrain'],
    ownerName: 'Development Properties Inc',
    ownerContact: '+256 707 890 123',
    isPremium: true,
    images: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800',
      'https://images.unsplash.com/photo-1500076656116-558758c991c1?w=800'
    ],
    propertyType: 'land',
    squareMeters: '1000',
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
 */
export function getFallbackProperty(id) {
  // Try to find by exact ID match
  const exactMatch = FALLBACK_PROPERTIES.find(p => p.id === id.toString());
  if (exactMatch) {
    return exactMatch;
  }
  
  // Otherwise return property based on ID modulo
  const index = (parseInt(id) || 0) % FALLBACK_PROPERTIES.length;
  return FALLBACK_PROPERTIES[index];
}

/**
 * Get all fallback properties
 */
export function getAllFallbackProperties() {
  return FALLBACK_PROPERTIES;
}
