export interface Property {
  id: string;
  title: string;
  description: string;
  location: string;
  price: string;
  currency: string;
  paymentTerms?: string;
  bedrooms: string;
  bathrooms: string;
  amenities: string[];
  images: string[];
  isPremium?: boolean;
  ownerName?: string;
  ownerContact?: string;
  propertyType: string;
  squareMeters?: string;
  floor?: string;
  units?: string;
  googlePin?: string;
  agents?: {
    id: string;
    name: string;
    email: string;
    phone: string;
    company: string;
  };
  // Metadata fields
  _source?: string;
  _fetchedAt?: string;
}
