import { NextRequest, NextResponse } from 'next/server';
import { GET as createGetHandler, POST as createPostHandler } from '@/lib/api-utils';

// Using our custom route handler wrapper for correct typing
export const GET = createGetHandler(
  async (request) => {
    try {
      // Get the path from the query parameters
      const url = new URL(request.url);
      const path = url.searchParams.get('path') || '';

      // WordPress API URL (using HTTP for direct server-side requests)
      const wpApiUrl = process.env.WORDPRESS_DIRECT_API_URL || 'http://wp.ajyxn.com/wp-json';

      console.log(`Proxying WordPress request to: ${wpApiUrl}/${path}`);

      // Forward the request to WordPress
      const response = await fetch(`${wpApiUrl}/${path}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        next: { revalidate: 60 } // Cache for 60 seconds
      });

      if (!response.ok) {
        console.error(`WordPress API error: ${response.status} ${response.statusText}`);

        // Try fallback URL if primary fails
        const fallbackUrl = process.env.WORDPRESS_FALLBACK_API_URL || 'http://199.188.200.71/wp-json';
        console.log(`Trying fallback URL: ${fallbackUrl}/${path}`);

        const fallbackResponse = await fetch(`${fallbackUrl}/${path}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          }
        });

        if (!fallbackResponse.ok) {
          throw new Error(`WordPress API returned ${response.status}: ${response.statusText}`);
        }

        const fallbackData = await fallbackResponse.json();
        return NextResponse.json(fallbackData);
      }

      // Get the response data
      const data = await response.json();

      // Return the response
      return NextResponse.json(data);
    } catch (error: any) {
      console.error('Error in WordPress proxy:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to fetch from WordPress API' },
        { status: 500 }
      );
    }
  }
);

// Add POST handler for form submissions
export const POST = createPostHandler(
  async (request) => {
    try {
      // Get the path from the query parameters
      const url = new URL(request.url);
      const path = url.searchParams.get('path') || '';

      // Get the request body
      const body = await request.json();

      // WordPress API URL (using HTTP for direct server-side requests)
      const wpApiUrl = process.env.WORDPRESS_DIRECT_API_URL || 'http://wp.ajyxn.com/wp-json';

      console.log(`Proxying WordPress POST request to: ${wpApiUrl}/${path}`);

      // Forward the request to WordPress
      const response = await fetch(`${wpApiUrl}/${path}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        throw new Error(`WordPress API returned ${response.status}: ${response.statusText}`);
      }

      // Get the response data
      const data = await response.json();

      // Return the response
      return NextResponse.json(data);
    } catch (error: any) {
      console.error('Error in WordPress proxy POST:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to post to WordPress API' },
        { status: 500 }
      );
    }
  }
);
