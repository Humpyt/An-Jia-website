'use client';

import { 
  Home, 
  Bath, 
  BedDouble, 
  Building, 
  Ruler, 
  Building2, 
  Check 
} from 'lucide-react';

interface PropertyFeaturesProps {
  amenities: string[];
  bedrooms: string;
  bathrooms: string;
  propertyType: string;
  squareMeters?: string;
  floor?: string;
}

export function PropertyFeatures({ 
  amenities, 
  bedrooms, 
  bathrooms, 
  propertyType, 
  squareMeters, 
  floor 
}: PropertyFeaturesProps) {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Property Features</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <div className="flex items-center gap-2">
          <BedDouble className="h-5 w-5 text-blue-600" />
          <span>{bedrooms} Bedrooms</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Bath className="h-5 w-5 text-blue-600" />
          <span>{bathrooms} Bathrooms</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Home className="h-5 w-5 text-blue-600" />
          <span>{propertyType}</span>
        </div>
        
        {squareMeters && (
          <div className="flex items-center gap-2">
            <Ruler className="h-5 w-5 text-blue-600" />
            <span>{squareMeters} m²</span>
          </div>
        )}
        
        {floor && (
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-blue-600" />
            <span>Floor {floor}</span>
          </div>
        )}
      </div>
      
      <h3 className="text-xl font-semibold mb-3">Amenities</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
        {amenities.map((amenity, index) => (
          <div key={index} className="flex items-center gap-2">
            <Check className="h-4 w-4 text-green-600" />
            <span>{amenity}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
