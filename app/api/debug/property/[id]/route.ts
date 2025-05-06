import { NextResponse } from 'next/server';

/**
 * Debug endpoint to see the raw WordPress API response
 * This helps us understand the structure of the data we're working with
 */
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    // Get the property ID from the URL parameters
    const id = params?.id;

    if (!id) {
      return NextResponse.json(
        { error: 'Property ID is required' },
        { status: 400 }
      );
    }

    console.log(`[DEBUG-API] Fetching raw WordPress data for property ID: ${id}`);

    // Fetch directly from WordPress API
    const wpApiUrl = `https://wp.ajyxn.com/wp-json/wp/v2/property/${id}?_embed`;
    
    console.log(`[DEBUG-API] WordPress API URL: ${wpApiUrl}`);
    
    const response = await fetch(wpApiUrl, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      console.error(`[DEBUG-API] WordPress API returned ${response.status}`);
      return NextResponse.json(
        { error: `WordPress API returned ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log(`[DEBUG-API] Successfully fetched raw WordPress data for property ID: ${id}`);

    // Return the raw WordPress data
    return NextResponse.json({
      raw_wordpress_data: data,
      acf_fields: data.acf || {},
      embedded_media: data._embedded?.['wp:featuredmedia'] || [],
      timestamp: Date.now()
    });
  } catch (error: any) {
    console.error('[DEBUG-API] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
