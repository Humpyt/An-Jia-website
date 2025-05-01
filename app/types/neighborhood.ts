export interface Neighborhood {
  id: string;
  name: string;
  description: string;
  image: string;
  properties: number;
  averagePrice: number;
  stats: {
    safetyRating: number;
    nearbyAmenities: Array<{
      name: string;
      type: string;
      distance: number;
    }>;
    transportation: Array<{
      type: string;
      description: string;
    }>;
    schoolsFacilities: Array<{
      name: string;
      type: string;
    }>;
  };
}
