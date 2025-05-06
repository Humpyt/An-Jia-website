// Static property data for use when WordPress API is unavailable
export const properties = [
  {
    id: "1",
    title: "Modern 3 Bedroom Apartment in Downtown",
    description: "<p>A stunning modern apartment featuring 3 bedrooms and state-of-the-art amenities including a spacious living area, modern kitchen, and private balcony with city views.</p>",
    location: "Beijing",
    bedrooms: "3",
    bathrooms: "2",
    price: "350000",
    currency: "CNY",
    amenities: ["Air Conditioning", "Parking", "Security", "Swimming Pool"],
    images: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800"
    ],
    propertyType: "apartment"
  },
  {
    id: "2",
    title: "Luxury Villa with 5 Bedrooms in Westlands",
    description: "<p>An exclusive villa offering premium living with 5 bedrooms and luxury finishes. Features include a swimming pool, garden, modern kitchen, and spacious living areas.</p>",
    location: "Shanghai",
    bedrooms: "5",
    bathrooms: "3",
    price: "750000",
    currency: "CNY",
    amenities: ["Garden", "Pool", "Smart Home", "Security System"],
    images: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800"
    ],
    propertyType: "house"
  },
  {
    id: "3",
    title: "Commercial Space in Business District",
    description: "<p>Prime commercial space in the heart of the business district. Perfect for office or retail with high foot traffic and excellent visibility.</p>",
    location: "Guangzhou",
    bedrooms: "0",
    bathrooms: "2",
    price: "500000",
    currency: "CNY",
    amenities: ["Parking", "Security", "Elevator", "Air Conditioning"],
    images: [
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800",
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800"
    ],
    propertyType: "commercial"
  },
  {
    id: "4",
    title: "Cozy 2 Bedroom Apartment near Park",
    description: "<p>A beautifully designed 2 bedroom apartment located near the central park. Features include a modern kitchen, cozy living room, and balcony with park views.</p>",
    location: "Shenzhen",
    bedrooms: "2",
    bathrooms: "1",
    price: "250000",
    currency: "CNY",
    amenities: ["Parking", "Security", "Near Park", "Public Transport"],
    images: [
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800"
    ],
    propertyType: "apartment"
  },
  {
    id: "5",
    title: "Vacant Land for Development",
    description: "<p>Prime vacant land perfect for residential or commercial development. Located in a growing area with excellent investment potential.</p>",
    location: "Chengdu",
    bedrooms: "0",
    bathrooms: "0",
    price: "200000",
    currency: "CNY",
    amenities: ["Road Access", "Utilities Available", "Flat Terrain"],
    images: [
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800",
      "https://images.unsplash.com/photo-1500076656116-558758c991c1?w=800"
    ],
    propertyType: "land"
  },
  {
    id: "6",
    title: "Modern Office Space in Tech Hub",
    description: "<p>Contemporary office space in the heart of the tech district. Open floor plan with meeting rooms, kitchen area, and high-speed internet connectivity.</p>",
    location: "Hangzhou",
    bedrooms: "0",
    bathrooms: "2",
    price: "450000",
    currency: "CNY",
    amenities: ["High-Speed Internet", "Meeting Rooms", "Security", "Parking"],
    images: [
      "https://images.unsplash.com/photo-1497215842964-222b430dc094?w=800",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800"
    ],
    propertyType: "commercial"
  },
  {
    id: "7",
    title: "Luxury Penthouse with City Views",
    description: "<p>Stunning penthouse apartment with panoramic city views. Features include a private terrace, high-end finishes, and exclusive amenities.</p>",
    location: "Nanjing",
    bedrooms: "4",
    bathrooms: "3",
    price: "900000",
    currency: "CNY",
    amenities: ["Private Terrace", "Concierge", "Gym", "Spa"],
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800"
    ],
    propertyType: "apartment"
  },
  {
    id: "8",
    title: "Family Home in Suburban Area",
    description: "<p>Spacious family home in a quiet suburban neighborhood. Features include a large garden, modern kitchen, and family-friendly layout.</p>",
    location: "Wuhan",
    bedrooms: "4",
    bathrooms: "2",
    price: "380000",
    currency: "CNY",
    amenities: ["Garden", "Garage", "Family Room", "Quiet Neighborhood"],
    images: [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800",
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800"
    ],
    propertyType: "house"
  }
];

// Function to get a property by ID
export function getPropertyById(id) {
  return properties.find(property => property.id === id) || null;
}

// Function to get all properties
export function getAllProperties() {
  return [...properties];
}

// Function to get properties by location
export function getPropertiesByLocation(location) {
  if (!location) return [...properties];
  return properties.filter(property =>
    property.location.toLowerCase().includes(location.toLowerCase())
  );
}

// Function to get properties by price range
export function getPropertiesByPriceRange(minPrice, maxPrice) {
  let filtered = [...properties];

  if (minPrice) {
    const min = parseInt(minPrice);
    filtered = filtered.filter(p => parseInt(p.price) >= min);
  }

  if (maxPrice) {
    const max = parseInt(maxPrice);
    filtered = filtered.filter(p => parseInt(p.price) <= max);
  }

  return filtered;
}

// Function to get properties by type
export function getPropertiesByType(propertyType) {
  if (!propertyType || propertyType === 'any') return [...properties];
  return properties.filter(property => property.propertyType === propertyType);
}

// Function to get properties by bedrooms
export function getPropertiesByBedrooms(bedrooms) {
  if (!bedrooms || bedrooms === 'any') return [...properties];
  return properties.filter(property => property.bedrooms === bedrooms);
}

// Function to get properties by bathrooms
export function getPropertiesByBathrooms(bathrooms) {
  if (!bathrooms || bathrooms === 'any') return [...properties];
  return properties.filter(property => property.bathrooms === bathrooms);
}

// Function to get properties with filters
export function getPropertiesWithFilters(filters) {
  let filtered = [...properties];

  if (filters.location) {
    filtered = filtered.filter(p =>
      p.location.toLowerCase().includes(filters.location.toLowerCase())
    );
  }

  if (filters.minPrice) {
    const min = parseInt(filters.minPrice);
    filtered = filtered.filter(p => parseInt(p.price) >= min);
  }

  if (filters.maxPrice) {
    const max = parseInt(filters.maxPrice);
    filtered = filtered.filter(p => parseInt(p.price) <= max);
  }

  if (filters.bedrooms && filters.bedrooms !== 'any') {
    filtered = filtered.filter(p => p.bedrooms === filters.bedrooms);
  }

  if (filters.bathrooms && filters.bathrooms !== 'any') {
    filtered = filtered.filter(p => p.bathrooms === filters.bathrooms);
  }

  if (filters.propertyType && filters.propertyType !== 'any') {
    filtered = filtered.filter(p => p.propertyType === filters.propertyType);
  }

  return filtered;
}
