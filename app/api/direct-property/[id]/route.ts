import { NextResponse } from 'next/server';
import { GET as createGetHandler } from '@/lib/api-utils';

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

      console.log(`[DIRECT-API] Fetching property with ID: ${id}`);

      // WordPress API URL (now using HTTPS for direct server-side requests)
      const wpApiUrl = 'https://wp.ajyxn.com/wp-json';
      const propertyEndpoint = `${wpApiUrl}/wp/v2/property/${id}?_embed`;

      console.log(`[DIRECT-API] Requesting from: ${propertyEndpoint}`);

      // Fetch with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

      const response = await fetch(propertyEndpoint, {
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        cache: 'no-store', // Don't cache this request
        next: { revalidate: 0 } // Don't revalidate
      });

      clearTimeout(timeoutId);

      console.log(`[DIRECT-API] Response status: ${response.status}`);

      if (!response.ok) {
        throw new Error(`WordPress API returned ${response.status}: ${response.statusText}`);
      }

      // Get the raw WordPress data
      const wpData = await response.json();

      console.log(`[DIRECT-API] Successfully fetched property data for ID: ${id}`);

      // Transform the WordPress data to match our frontend structure
      const property = transformPropertyData(wpData);

      // Return the response
      return NextResponse.json({ property });
    } catch (error: any) {
      console.error('[DIRECT-API] Error fetching property:', error);

      // Return fallback data in case of error
      console.log('[DIRECT-API] Using fallback property data for ID:', params?.id);

      // Try to import the fallback property system
      try {
        const { getFallbackProperty } = require('@/lib/property-fallback');
        const fallbackProperty = getFallbackProperty(params?.id?.toString() || '0');

        console.log('[DIRECT-API] Successfully loaded fallback property from property-fallback.js');
        return NextResponse.json({ property: fallbackProperty });
      } catch (fallbackError) {
        console.error('[DIRECT-API] Error loading fallback property:', fallbackError);

        // If fallback system fails, use minimal property data
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
            floor: undefined,
            units: undefined,
            paymentTerms: undefined,
            amenities: ["WiFi", "Parking", "Security", "Swimming Pool", "Gym"],
            ownerName: undefined,
            ownerContact: undefined,
            googlePin: undefined,
            isPremium: false,
            images: [
              "/images/properties/property-placeholder.jpg"
            ],
            propertyType: "property",
            squareMeters: undefined,
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
  }
);

/**
 * Transform WordPress property data to match our frontend structure
 */
function transformPropertyData(wpProperty: any) {
  try {
    console.log(`[DIRECT-API] Transforming property data for ID: ${wpProperty.id}`);

    // Extract featured image URL
    let featuredImageUrl = '';
    let galleryImages: string[] = [];

    // Get featured image
    const featuredMedia = wpProperty._embedded?.['wp:featuredmedia']?.[0];
    if (featuredMedia?.source_url) {
      featuredImageUrl = featuredMedia.source_url;
      console.log(`[DIRECT-API] Found featured image: ${featuredImageUrl}`);
    }

    // Extract ACF fields or use meta fields as fallback
    const acf = wpProperty.acf || wpProperty.meta || {};

    // Try to get gallery images from various possible fields
    if (Array.isArray(acf.gallery)) {
      galleryImages = acf.gallery.map((img: any) => img.url || img.sizes?.large || '').filter(Boolean);
      console.log(`[DIRECT-API] Found ${galleryImages.length} gallery images from acf.gallery`);
    } else if (Array.isArray(acf.property_images)) {
      galleryImages = acf.property_images.map((img: any) => img.url || img.sizes?.large || '').filter(Boolean);
      console.log(`[DIRECT-API] Found ${galleryImages.length} gallery images from acf.property_images`);
    } else if (Array.isArray(acf.images)) {
      galleryImages = acf.images.map((img: any) => img.url || img.sizes?.large || '').filter(Boolean);
      console.log(`[DIRECT-API] Found ${galleryImages.length} gallery images from acf.images`);
    }

    // Combine featured image with gallery images, ensuring no duplicates
    const allImages = [
      ...(featuredImageUrl ? [featuredImageUrl] : []),
      ...galleryImages
    ];

    // If no images found, use placeholder
    const finalImages = allImages.length > 0
      ? allImages
      : ["/images/properties/property-placeholder.jpg"];

    console.log(`[DIRECT-API] Final image count: ${finalImages.length}`);

    // Process amenities with better fallback handling
    let amenities: string[] = [];
    if (Array.isArray(acf.amenities) && acf.amenities.length > 0) {
      amenities = acf.amenities;
    } else if (typeof acf.amenities === 'string' && acf.amenities.trim() !== '') {
      amenities = acf.amenities.split(',').map((a: string) => a.trim());
    } else if (Array.isArray(acf.property_amenities) && acf.property_amenities.length > 0) {
      amenities = acf.property_amenities;
    } else {
      amenities = ["WiFi", "Parking", "Security", "Air Conditioning"];
    }

    // Create the transformed property object with all required fields
    return {
      id: wpProperty.id?.toString() || '',
      title: wpProperty.title?.rendered || '',
      location: acf.location || '',
      floor: acf.floor?.toString() || undefined,
      bedrooms: acf.bedrooms?.toString() || '0',
      bathrooms: acf.bathrooms?.toString() || '0',
      units: acf.units?.toString() || undefined,
      price: acf.price?.toString() || '0',
      currency: acf.currency || 'USD',
      paymentTerms: acf.payment_terms || acf.paymentTerms || undefined,
      amenities: amenities,
      ownerName: acf.owner_name || acf.ownerName || undefined,
      ownerContact: acf.owner_contact || acf.ownerContact || undefined,
      googlePin: acf.google_pin || acf.googlePin || undefined,
      isPremium: acf.is_premium || acf.isPremium || false,
      images: finalImages,
      description: wpProperty.content?.rendered || '',
      propertyType: acf.property_type || acf.propertyType || 'apartment',
      squareMeters: acf.square_meters?.toString() || acf.squareMeters?.toString() || undefined,
      agents: {
        id: "agent-1",
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "+256 701 234 567",
        company: "An Jia You Xuan Real Estate"
      }
    };
  } catch (error) {
    console.error('[DIRECT-API] Error transforming property data:', error);
    // Return a minimal valid property object if transformation fails
    console.log('[DIRECT-API] Transformation failed, using minimal property object');

    // Try to get at least the ID and title if possible
    const id = wpProperty?.id?.toString() || 'unknown';
    const title = wpProperty?.title?.rendered || 'Error Loading Property';

    return {
      id: id,
      title: title,
      description: '<p>Error loading property details. Please try again later.</p>',
      location: 'An Jia Properties',
      floor: undefined,
      bedrooms: '0',
      bathrooms: '0',
      units: undefined,
      price: 'Contact agent',
      currency: 'USD',
      paymentTerms: undefined,
      amenities: ["WiFi", "Parking", "Security"],
      ownerName: undefined,
      ownerContact: undefined,
      googlePin: undefined,
      isPremium: false,
      images: ["/images/properties/property-placeholder.jpg"],
      propertyType: 'property',
      squareMeters: undefined,
      agents: {
        id: "agent-1",
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "+256 701 234 567",
        company: "An Jia You Xuan Real Estate"
      }
    };
  }
}
