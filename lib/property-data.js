// Static property data for use when WordPress API is unavailable
// Updated with correct WordPress property IDs
export const properties = [
  {
    id: "224",
    title: "Bugolobi Apartments",
    description: "<p>A stunning modern apartment featuring 2 bedrooms and state-of-the-art amenities including a spacious living area, modern kitchen, and private balcony with city views.</p>",
    location: "Bugolobi",
    bedrooms: "2",
    bathrooms: "1",
    price: "1300",
    currency: "USD",
    amenities: ["Air Conditioning", "Parking", "Security", "Swimming Pool"],
    images: [
      "/images/properties/property-1.jpg",
      "/images/properties/fallback-1.jpg"
    ],
    propertyType: "apartment"
  },
  {
    id: "212",
    title: "Lime Trees Residences",
    description: "<p>An exclusive residence offering premium living with luxury finishes. Features include a swimming pool, garden, modern kitchen, and spacious living areas.</p>",
    location: "Kololo",
    bedrooms: "3",
    bathrooms: "2",
    price: "2000",
    currency: "USD",
    amenities: ["Garden", "Pool", "Smart Home", "Security System"],
    images: [
      "/images/properties/property-2.jpg",
      "/images/properties/fallback-2.jpg"
    ],
    propertyType: "house"
  },
  {
    id: "193",
    title: "Lime Trees Residences Studio",
    description: "<p>Cozy studio apartment perfect for singles or couples. Located in Lime Trees Residences with easy access to public transportation and shopping centers.</p>",
    location: "Kololo",
    bedrooms: "1",
    bathrooms: "1",
    price: "500",
    currency: "USD",
    amenities: ["Parking", "Security", "Elevator", "Air Conditioning"],
    images: [
      "/images/properties/property-3.jpg",
      "/images/properties/fallback-3.jpg"
    ],
    propertyType: "apartment"
  },
  {
    id: "182",
    title: "Kololo Residences",
    description: "<p>A beautifully designed residence located in the prestigious Kololo area. Features include a modern kitchen, spacious living room, and excellent amenities.</p>",
    location: "Kololo",
    bedrooms: "2",
    bathrooms: "2",
    price: "1200",
    currency: "USD",
    amenities: ["Parking", "Security", "Garden", "Modern Kitchen"],
    images: [
      "/images/properties/property-4.jpg",
      "/images/properties/fallback-1.jpg"
    ],
    propertyType: "apartment"
  },
  {
    id: "164",
    title: "Melinium Apartments",
    description: "<p>Modern apartments in the Melinium complex offering contemporary living spaces with excellent amenities and convenient location.</p>",
    location: "Kololo",
    bedrooms: "3",
    bathrooms: "3",
    price: "2500",
    currency: "USD",
    amenities: ["Swimming Pool", "Gym", "Security", "Parking"],
    images: [
      "/images/properties/property-5.jpg",
      "/images/properties/fallback-2.jpg"
    ],
    propertyType: "apartment"
  },
  {
    id: "159",
    title: "Hilltop Residency",
    description: "<p>Exclusive hilltop residence offering panoramic views and premium living spaces. Features modern design and high-end finishes throughout.</p>",
    location: "Kololo",
    bedrooms: "2",
    bathrooms: "2",
    price: "1100",
    currency: "USD",
    amenities: ["Views", "Modern Design", "Security", "Parking"],
    images: [
      "/images/properties/property-6.jpg",
      "/images/properties/fallback-3.jpg"
    ],
    propertyType: "apartment"
  },
  {
    id: "154",
    title: "Kololo Appartment",
    description: "<p>Stylish apartment in the heart of Kololo. Features include a private terrace, high-end finishes, and exclusive amenities.</p>",
    location: "Kololo",
    bedrooms: "2",
    bathrooms: "2",
    price: "1000",
    currency: "USD",
    amenities: ["Private Terrace", "Security", "Parking", "Modern Kitchen"],
    images: [
      "/images/properties/property-7.jpg",
      "/images/properties/fallback-1.jpg"
    ],
    propertyType: "apartment"
  },
  {
    id: "143",
    title: "International Gardens Apartments",
    description: "<p>Spacious apartments in the International Gardens complex. Features include well-maintained grounds, security, and comfortable living spaces.</p>",
    location: "Kololo",
    bedrooms: "2",
    bathrooms: "2",
    price: "900",
    currency: "USD",
    amenities: ["Garden", "Security", "Parking", "Quiet Neighborhood"],
    images: [
      "/images/properties/property-8.jpg",
      "/images/properties/fallback-2.jpg"
    ],
    propertyType: "apartment"
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
