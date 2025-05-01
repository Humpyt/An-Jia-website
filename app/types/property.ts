export interface Property {
  id: string;
  title: string;
  description: string;
  descriptionSummary?: string; // Added for AI-generated summary
  location: string;
  price: string;
  currency: string;
  paymentTerms?: string;
  bedrooms: string;
  bathrooms?: string; // Added previously
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
}
