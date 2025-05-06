import { NextResponse } from 'next/server';
import { GET as createGetHandler } from '@/lib/api-utils';
import { properties as mockProperties } from '@/lib/property-data';
import { getFallbackProperty } from '@/lib/property-fallback';

// Using our custom route handler wrapper for correct typing
export const GET = createGetHandler(
  async (request, { params }) => {
    try {
      // Get the property ID from the URL parameters
      const id = params?.id;

      if (!id) {
        return NextResponse.json(
          { error: 'Property ID is required' },
          { status: 400 }
        );
      }

      console.log(`API: Fetching property with ID: ${id} from direct data`);

      // First try to find the property in the mock data
      const property = mockProperties.find(p => p.id === id);

      if (property) {
        console.log(`API: Found property with ID: ${id} in mock data`);
        
        // Add agent information
        const propertyWithAgent = {
          ...property,
          agents: {
            id: "agent-1",
            name: "John Doe",
            email: "john.doe@example.com",
            phone: "+256 701 234 567",
            company: "An Jia You Xuan Real Estate"
          }
        };
        
        return NextResponse.json({ property: propertyWithAgent });
      }

      // If not found in mock data, use fallback
      console.log(`API: Property with ID: ${id} not found in mock data, using fallback`);
      const fallbackProperty = getFallbackProperty(id);
      
      return NextResponse.json({ property: fallbackProperty });
    } catch (error: any) {
      console.error('Error in property direct API route:', error);

      // Return fallback data in case of error
      return NextResponse.json({
        property: {
          id: params?.id?.toString() || '0',
          title: "Property Information",
          description: "<p>Property details are being updated.</p>",
          location: "An Jia Properties",
          price: "Contact agent",
          currency: "USD",
          bedrooms: "0",
          bathrooms: "0",
          amenities: ["WiFi", "Parking", "Security", "Swimming Pool", "Gym"],
          images: [
            "/images/properties/property-placeholder.svg"
          ],
          propertyType: "property",
          agents: {
            id: "agent-1",
            name: "John Doe",
            email: "john.doe@example.com",
            phone: "+256 701 234 567",
            company: "An Jia You Xuan Real Estate"
          }
        }
      });
    }
  }
);
