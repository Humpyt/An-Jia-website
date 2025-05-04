import { NextResponse } from 'next/server';
import { getPropertiesWithFilters } from '@/lib/wordpress';
import { properties as mockProperties } from '@/lib/property-data';

export async function GET() {
  try {
    // Get latest properties, limit to 12, sorted by newest first
    const result = await getPropertiesWithFilters({
      limit: 12,
      orderBy: 'date',
      order: 'desc'
    });

    // If we got properties from WordPress, return them
    if (result && result.properties && result.properties.length > 0) {
      console.log(`Returning ${result.properties.length} properties from WordPress API`);
      return NextResponse.json({ properties: result.properties });
    }

    // If WordPress API returned empty array, use mock data as fallback
    console.log('WordPress API returned no properties, using fallback data');

    // Transform mock data to match the expected format
    const fallbackProperties = mockProperties.slice(0, 12).map(property => ({
      id: property.id,
      title: property.title,
      location: property.location,
      price: property.price,
      currency: property.currency,
      paymentTerms: property.paymentTerms,
      bedrooms: property.bedrooms,
      bathrooms: property.bedrooms, // Use bedrooms as fallback for bathrooms
      images: property.images,
      isPremium: property.isPremium,
      description: property.description,
      amenities: property.amenities
    }));

    return NextResponse.json({ properties: fallbackProperties });
  } catch (error) {
    console.error('Error fetching latest properties:', error);

    // Use mock data as fallback in case of error
    console.log('Error occurred, using fallback data');

    // Transform mock data to match the expected format
    const fallbackProperties = mockProperties.slice(0, 12).map(property => ({
      id: property.id,
      title: property.title,
      location: property.location,
      price: property.price,
      currency: property.currency,
      paymentTerms: property.paymentTerms,
      bedrooms: property.bedrooms,
      bathrooms: property.bedrooms, // Use bedrooms as fallback for bathrooms
      images: property.images,
      isPremium: property.isPremium,
      description: property.description,
      amenities: property.amenities
    }));

    return NextResponse.json({
      properties: fallbackProperties,
      error: 'WordPress API error, using fallback data'
    });
  }
}
