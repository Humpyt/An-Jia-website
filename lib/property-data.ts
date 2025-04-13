// Property data parsed from CSV file
export interface Property {
  id: string;
  title: string;
  location: string;
  floor: string;
  bedrooms: string;
  units?: string;
  price: string;
  currency: string;
  paymentTerms: string;
  amenities: string[];
  ownerName: string;
  ownerContact: string;
  googlePin?: string;
  isPremium: boolean;
  images: string[];
  description: string;
  propertyType: 'apartment' | 'house' | 'land' | 'hotel';
  squareMeters?: number;
}

// Sample Image URLs (Replace with more diverse and specific ones as needed)
const apartmentImages = [
  "https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  "https://images.pexels.com/photos/271816/pexels-photo-271816.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
];
const houseImages = [
  "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  "https://images.pexels.com/photos/259588/pexels-photo-259588.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
];
const landImages = [
  "https://images.pexels.com/photos/164664/pexels-photo-164664.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Field
  "https://images.pexels.com/photos/440731/pexels-photo-440731.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Landscape
  "https://images.pexels.com/photos/534285/pexels-photo-534285.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" // Plot with markings
];
const hotelImages = [
  "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Resort pool
  "https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Hotel exterior night
  "https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" // Hotel room
];

// Function to get images based on type, rotating through the samples
const getImagesForType = (type: Property['propertyType'], index: number) => {
  switch (type) {
    case 'apartment':
      return apartmentImages.slice(index % apartmentImages.length).concat(apartmentImages.slice(0, index % apartmentImages.length));
    case 'house':
      return houseImages.slice(index % houseImages.length).concat(houseImages.slice(0, index % houseImages.length));
    case 'land':
      return landImages.slice(index % landImages.length).concat(landImages.slice(0, index % landImages.length));
    case 'hotel':
      return hotelImages.slice(index % hotelImages.length).concat(hotelImages.slice(0, index % hotelImages.length));
    default:
      return apartmentImages; // Default fallback
  }
};

// Process CSV data and convert to structured properties array
export const properties: Property[] = [
  {
    id: "prop-1",
    title: "Hamilton Residency 18A",
    location: "Naguru, Kampala",
    floor: "3rd",
    bedrooms: "3",
    price: "1800",
    currency: "USD",
    paymentTerms: "Monthly",
    amenities: ["Wifi", "Elevator", "Standby Generator", "Parking Space"],
    ownerName: "Stellahmaris",
    ownerContact: "0782528269",
    googlePin: "https://maps.app.goo.gl/Cqs5MsmgkCtu7aqB9",
    isPremium: true,
    images: [
      "/images/04/WhatsApp Image 2025-04-09 at 11.37.57 AM.jpeg",
      "/images/04/WhatsApp Image 2025-04-09 at 11.37.57 AM (1).jpeg",
      "/images/04/WhatsApp Image 2025-04-09 at 11.37.57 AM (2).jpeg",
      "/images/04/WhatsApp Image 2025-04-09 at 11.37.58 AM.jpeg",
      "/images/04/WhatsApp Image 2025-04-09 at 11.37.58 AM (1).jpeg",
      "/images/04/WhatsApp Image 2025-04-09 at 11.37.58 AM (2).jpeg",
      "/images/04/WhatsApp Image 2025-04-09 at 11.37.59 AM.jpeg",
      "/images/04/WhatsApp Image 2025-04-09 at 11.37.59 AM (1).jpeg"
    ],
    description: "Luxurious 3-bedroom apartment in the prestigious Hamilton Residency. Enjoy panoramic views of Kampala from this elegantly designed space featuring modern amenities and premium finishes.",
    propertyType: "apartment",
    squareMeters: 180
  },
  {
    id: "prop-2",
    title: "Julie Heights",
    location: "Naguru, Kampala",
    floor: "3",
    bedrooms: "3",
    price: "1200",
    currency: "USD",
    paymentTerms: "Monthly",
    amenities: ["Wifi", "Elevator", "Standby Generator"],
    ownerName: "Hamfrey",
    ownerContact: "0782528269",
    googlePin: "https://maps.app.goo.gl/Cqs5MsmgkCtu7aqB9",
    isPremium: true,
    images: [
      "/images/03/WhatsApp Image 2025-04-09 at 11.36.23 AM.jpeg",
      "/images/03/WhatsApp Image 2025-04-09 at 11.36.25 AM (1).jpeg",
      "/images/03/WhatsApp Image 2025-04-09 at 11.36.25 AM.jpeg",
      "/images/03/WhatsApp Image 2025-04-09 at 11.36.26 AM (1).jpeg",
      "/images/03/WhatsApp Image 2025-04-09 at 11.36.26 AM.jpeg",
      "/images/03/WhatsApp Image 2025-04-09 at 11.36.27 AM.jpeg",
      "/images/03/WhatsApp Image 2025-04-09 at 11.37.57 AM (2).jpeg",
      "/images/03/WhatsApp Image 2025-04-09 at 11.37.57 AM.jpeg"
    ],
    description: "Modern living spaces in Julie Heights offer comfort and convenience in the heart of Naguru. This 3-bedroom apartment provides spacious rooms with excellent natural lighting and premium amenities.",
    propertyType: "apartment",
    squareMeters: 165
  },
  {
    id: "prop-3",
    title: "Leonia Apartments",
    location: "Bukoto, Sserunkuma Road",
    floor: "1, 2, 3",
    bedrooms: "1, 2",
    price: "600-850",
    currency: "USD",
    paymentTerms: "Monthly",
    amenities: ["Wifi", "Standby Generator", "Parking Space", "House Keeping"],
    ownerName: "Mr. Hefty",
    ownerContact: "+256702720231",
    googlePin: "9H3X+7P9 Kampala",
    isPremium: false,
    images: getImagesForType("apartment", 2),
    description: "Leonia Apartments offers flexible living options with 1 and 2-bedroom units available on multiple floors. Located in the quiet Bukoto neighborhood on Sserunkuma Road, these apartments provide comfort with essential amenities.",
    propertyType: "apartment",
    squareMeters: 120
  },
  {
    id: "prop-4",
    title: "Sunshine Apartments",
    location: "Naguru, Kampala",
    floor: "Ground Floor",
    bedrooms: "3",
    price: "1100",
    currency: "USD",
    paymentTerms: "Monthly",
    amenities: ["Standby Generator", "Parking Space"],
    ownerName: "Patrick",
    ownerContact: "0767760084",
    isPremium: false,
    images: getImagesForType("apartment", 3),
    description: "Sunshine Apartments offers convenient ground-floor access with spacious 3-bedroom units. Perfect for families looking for accessibility and comfort in the vibrant Naguru area.",
    propertyType: "apartment",
    squareMeters: 150
  },
  {
    id: "prop-5",
    title: "Naguru Apartments",
    location: "Naguru, Kampala",
    floor: "2nd Floor",
    bedrooms: "3",
    price: "1200",
    currency: "USD",
    paymentTerms: "Monthly",
    amenities: ["Elevator", "Standby Generator", "Parking Space"],
    ownerName: "Daniel",
    ownerContact: "0773117924",
    isPremium: false,
    images: getImagesForType("apartment", 4),
    description: "Contemporary living in the heart of Naguru. These well-appointed 3-bedroom apartments feature modern designs with excellent city views from the 2nd floor.",
    propertyType: "apartment",
    squareMeters: 155
  },
  {
    id: "prop-6",
    title: "Princess Kevina",
    location: "Bukoto, Upper Naguru Road",
    floor: "1, 2, 3",
    bedrooms: "2",
    price: "650",
    currency: "USD",
    paymentTerms: "Monthly",
    amenities: ["Standby Generator", "Parking Space"],
    ownerName: "Mr. Charles",
    ownerContact: "+256754444445",
    googlePin: "8JV3+2XF Kampala",
    isPremium: false,
    images: getImagesForType("apartment", 5),
    description: "Princess Kevina offers affordable 2-bedroom apartments in a convenient location on Upper Naguru Road. With reliable power backup and secure parking, these units provide comfort and value.",
    propertyType: "apartment",
    squareMeters: 110
  },
  {
    id: "prop-7",
    title: "Namayiba Park Apartments",
    location: "Kampala City Center",
    floor: "6",
    bedrooms: "1, 2",
    price: "700-800",
    currency: "USD",
    paymentTerms: "Monthly",
    amenities: ["Wifi", "Elevator", "Standby Generator", "Parking Space", "Gym", "Supermarket", "Financial Services", "Educational Services"],
    ownerName: "Namayiba",
    ownerContact: "+256701942382",
    googlePin: "http://maps.app.goo.gl/bGvz6DMvfRhCJfEj8",
    isPremium: true,
    images: [
      "/images/05/WhatsApp Image 2025-04-09 at 11.40.23 AM (1).jpeg",
      "/images/05/WhatsApp Image 2025-04-09 at 11.40.23 AM.jpeg",
      "/images/05/WhatsApp Image 2025-04-09 at 11.40.24 AM (2).jpeg",
      "/images/05/WhatsApp Image 2025-04-09 at 11.40.25 AM.jpeg",
      "/images/05/WhatsApp Image 2025-04-09 at 11.40.27 AM.jpeg",
      "/images/05/WhatsApp Image 2025-04-09 at 11.40.28 AM.jpeg",
      "/images/05/WhatsApp Image 2025-04-09 at 11.40.31 AM.jpeg"
    ],
    description: "Namayiba Park Apartments offer premium urban living in Kampala City Center. These fully-serviced apartments include an impressive range of amenities including gym, supermarket, and various services within the complex.",
    propertyType: "apartment",
    squareMeters: 130
  },
  {
    id: "prop-8",
    title: "Spring Valley Apartments",
    location: "Bugolobi, Kampala",
    floor: "Ground Floor",
    bedrooms: "3",
    units: "1",
    price: "800",
    currency: "USD",
    paymentTerms: "Monthly",
    amenities: ["Parking Space"],
    ownerName: "J2 Spring",
    ownerContact: "0773060410",
    isPremium: false,
    images: getImagesForType("apartment", 7),
    description: "Spring Valley Apartments offer convenient ground-floor living in the desirable Bugolobi area. This 3-bedroom unit provides comfortable living spaces with secure parking in a peaceful setting.",
    propertyType: "apartment",
    squareMeters: 140
  },
  {
    id: "prop-9",
    title: "Legacy Apartment",
    location: "Naguru, Kampala",
    floor: "3rd and 1st Floor",
    bedrooms: "2-3",
    units: "5",
    price: "800-1800",
    currency: "USD",
    paymentTerms: "Monthly",
    amenities: ["Standby Generator", "Parking Space", "Gym", "Swimming Pool", "Pool Tables", "Chess Table"],
    ownerName: "Justine",
    ownerContact: "0774442076",
    isPremium: true,
    images: getImagesForType("apartment", 8),
    description: "Legacy Apartment offers premium living with outstanding recreational facilities. Choose from 2 or 3-bedroom units with access to a swimming pool, gym, and gaming areas for a complete lifestyle experience.",
    propertyType: "apartment",
    squareMeters: 160
  },
  {
    id: "prop-10",
    title: "Dick Villas",
    location: "Bugolobi, Kampala",
    floor: "Ground and First Floor",
    bedrooms: "5",
    units: "5",
    price: "1500",
    currency: "USD",
    paymentTerms: "Monthly",
    amenities: ["Parking Space", "Security"],
    ownerName: "Dick",
    ownerContact: "0701444375",
    isPremium: true,
    images: getImagesForType("house", 0),
    description: "Spacious 5-bedroom villas in the exclusive Bugolobi area. These two-level homes offer generous living spaces with enhanced security features and private parking for discerning residents.",
    propertyType: "house",
    squareMeters: 320
  },
  {
    id: "prop-11",
    title: "Namayimba Park Hotel",
    location: "Kampala Central",
    floor: "3rd Floor and Others",
    bedrooms: "2",
    units: "6",
    price: "700-800",
    currency: "USD",
    paymentTerms: "Monthly",
    amenities: ["Wifi", "Elevator", "Standby Generator", "Parking Space", "Gym", "Resting Area"],
    ownerName: "Hotel Manager",
    ownerContact: "0701942382",
    googlePin: "Aponye Mall",
    isPremium: true,
    images: getImagesForType("hotel", 0),
    description: "Namayimba Park Hotel offers serviced 2-bedroom apartments with hotel amenities. Located near Aponye Mall in Kampala Central, these units provide comfort with access to gym facilities and relaxation areas.",
    propertyType: "hotel",
    squareMeters: 120
  },
  {
    id: "prop-12",
    title: "Laaifa Residences",
    location: "Bukoto, Kisasi Road",
    floor: "3",
    bedrooms: "1-3",
    units: "8",
    price: "450-1000",
    currency: "USD",
    paymentTerms: "Monthly",
    amenities: ["Elevator", "Standby Generator", "Parking Space"],
    ownerName: "Kakande",
    ownerContact: "0702965733",
    googlePin: "https://maps.app.goo.gl/H5BxSJxsrQ7n1CDCA",
    isPremium: false,
    images: getImagesForType("apartment", 9),
    description: "Laaifa Residences offers flexible apartment options with 1, 2, and 3-bedroom units available. Located in Bukoto on Kisasi Road, these modern apartments provide excellent value with essential amenities.",
    propertyType: "apartment",
    squareMeters: 140
  },
  {
    id: "prop-13",
    title: "Pearl Heights",
    location: "Naguru, Kampala",
    floor: "1 to 7",
    bedrooms: "3",
    units: "9",
    price: "2200",
    currency: "USD",
    paymentTerms: "Monthly",
    amenities: ["Wifi", "Elevator", "Standby Generator", "Parking Space"],
    ownerName: "Ali",
    ownerContact: "Not Available",
    googlePin: "Naguru",
    isPremium: true,
    images: getImagesForType("apartment", 10),
    description: "Pearl Heights offers luxury 3-bedroom apartments across multiple floors in a premium high-rise building. With comprehensive amenities and prime Naguru location, these units represent exclusive urban living.",
    propertyType: "apartment",
    squareMeters: 200
  },
  {
    id: "prop-14",
    title: "Hill Top Residency",
    location: "Kololo, Kampala",
    floor: "14",
    bedrooms: "1-2",
    units: "3",
    price: "1000",
    currency: "USD",
    paymentTerms: "Monthly",
    amenities: ["Wifi", "Elevator", "Standby Generator", "Parking Space"],
    ownerName: "Sam",
    ownerContact: "0782528269",
    googlePin: "Kololo",
    isPremium: true,
    images: getImagesForType("apartment", 11),
    description: "Hill Top Residency offers elevated living in the prestigious Kololo area. These high-floor apartments provide stunning city views with a choice of 1 or 2-bedroom layouts in a full-service building.",
    propertyType: "apartment",
    squareMeters: 130
  },
  {
    id: "prop-15",
    title: "Luzira Residency",
    location: "Luzira, Kampala",
    floor: "Standalone",
    bedrooms: "9",
    units: "1",
    price: "3500",
    currency: "USD",
    paymentTerms: "Monthly",
    amenities: ["Parking Space"],
    ownerName: "Stephen",
    ownerContact: "0782528269",
    googlePin: "Luzira",
    isPremium: true,
    images: getImagesForType("house", 1),
    description: "Impressive standalone residence in Luzira featuring 9 bedrooms. This expansive property is ideal for large families or as a potential guest house investment with ample parking space.",
    propertyType: "house",
    squareMeters: 450
  },
  {
    id: "prop-16",
    title: "Mutungo Hill Estate",
    location: "Mutungo Hill, Kampala",
    floor: "Standalone",
    bedrooms: "4",
    units: "1",
    price: "2000",
    currency: "USD",
    paymentTerms: "Monthly",
    amenities: ["Parking Space"],
    ownerName: "Samuel",
    ownerContact: "0782528269",
    googlePin: "Mutungo Hill",
    isPremium: true,
    images: getImagesForType("house", 2),
    description: "Elegant 4-bedroom standalone residence on Mutungo Hill. This property is available for sale and offers comfortable family living in a prestigious neighborhood with secure parking.",
    propertyType: "house",
    squareMeters: 280
  },
  {
    id: "prop-17",
    title: "KS Apartments",
    location: "Ntinda, Magambo Road",
    floor: "3",
    bedrooms: "1",
    units: "6",
    price: "500",
    currency: "USD",
    paymentTerms: "Monthly",
    amenities: ["Standby Generator", "Parking Space"],
    ownerName: "Abu",
    ownerContact: "0765947343",
    googlePin: "https://maps.app.goo.gl/9N4efb3iduhBxNPS9",
    isPremium: false,
    images: getImagesForType("apartment", 12),
    description: "KS Apartments offer affordable 1-bedroom units on Magambo Road in Ntinda. These practical living spaces include reliable power backup and secure parking at a competitive price point.",
    propertyType: "apartment",
    squareMeters: 75
  },
  {
    id: "prop-18",
    title: "Nobert's Home",
    location: "Upper Naguru Hill, Kampala",
    floor: "1, 2",
    bedrooms: "5",
    units: "1",
    price: "4000",
    currency: "USD",
    paymentTerms: "Monthly",
    amenities: ["Parking Space", "80 Decimals Free Space", "Big Compound", "Maids House"],
    ownerName: "Nobert",
    ownerContact: "0772441828",
    googlePin: "https://maps.app.goo.gl/9N4efb3iduhBxNPS9",
    isPremium: true,
    images: getImagesForType("house", 3),
    description: "Exclusive 5-bedroom residence on Upper Naguru Hill with expansive grounds (80 decimals). This premium property includes a separate maids' quarters and offers luxury living with generous outdoor space.",
    propertyType: "house",
    squareMeters: 350
  },
  {
    id: "prop-19",
    title: "Naguru Land",
    location: "Naguru, Kampala",
    floor: "Ground",
    bedrooms: "0",
    units: "1",
    price: "1500000",
    currency: "USD",
    paymentTerms: "Monthly",
    amenities: ["Ground"],
    ownerName: "Ochaya Michael",
    ownerContact: "0776944351",
    googlePin: "Naguru",
    isPremium: true,
    images: getImagesForType("land", 0),
    description: "Prime development land in Naguru covering one hectare. This flat land offers excellent investment potential in one of Kampala's most desirable neighborhoods.",
    propertyType: "land",
    squareMeters: 10000
  },
  {
    id: "prop-20",
    title: "Arirang Hotel",
    location: "Nakasero, Kampala",
    floor: "3rd",
    bedrooms: "8",
    units: "2",
    price: "100-120",
    currency: "USD",
    paymentTerms: "Monthly",
    amenities: ["Elevator", "Parking Space"],
    ownerName: "Hotel Manager",
    ownerContact: "0759333444",
    googlePin: "Nakasero",
    isPremium: false,
    images: getImagesForType("hotel", 1),
    description: "Arirang Hotel offers comfortable accommodation in the central Nakasero area with convenient access to Kampala's business district. These rooms include basic amenities at affordable nightly rates.",
    propertyType: "hotel",
    squareMeters: 40
  }
];

export const categories = [
  { id: "apartments", name: "Apartments", count: properties.filter(p => p.propertyType === "apartment").length },
  { id: "houses", name: "Houses", count: properties.filter(p => p.propertyType === "house").length },
  { id: "land", name: "Land", count: properties.filter(p => p.propertyType === "land").length },
  { id: "hotels", name: "Hotels", count: properties.filter(p => p.propertyType === "hotel").length },
];

export const neighborhoods = [
  { id: "naguru", name: "Naguru", count: properties.filter(p => p.location.toLowerCase().includes("naguru")).length, 
    image: houseImages[0] }, // Use a sample house image for Naguru
  { id: "kololo", name: "Kololo", count: properties.filter(p => p.location.toLowerCase().includes("kololo")).length,
    image: apartmentImages[0] }, // Use a sample apartment image for Kololo
  { id: "bukoto", name: "Bukoto", count: properties.filter(p => p.location.toLowerCase().includes("bukoto")).length,
    image: apartmentImages[1] }, // Use another sample apartment image for Bukoto
  { id: "bugolobi", name: "Bugolobi", count: properties.filter(p => p.location.toLowerCase().includes("bugolobi")).length,
    image: houseImages[1] }, // Use another sample house image for Bugolobi
  { id: "ntinda", name: "Ntinda", count: properties.filter(p => p.location.toLowerCase().includes("ntinda")).length,
    image: apartmentImages[2] }, // Use another sample apartment image for Ntinda
  { id: "mutungo", name: "Mutungo", count: properties.filter(p => p.location.toLowerCase().includes("mutungo")).length,
    image: houseImages[2] }, // Use another sample house image for Mutungo
];

// Add this function to fix the error
export async function getProperties() {
  // Return properties directly without trying to fetch from Supabase
  return { data: properties, error: null };
}
