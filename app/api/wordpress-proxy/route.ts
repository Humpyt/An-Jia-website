import { NextRequest, NextResponse } from 'next/server';
import { GET as createGetHandler } from '@/lib/api-utils';

// Using our custom route handler wrapper for correct typing
export const GET = createGetHandler(
  async (request) => {
    try {
      // Get the path from the query parameters
      const url = new URL(request.url);
      const path = url.searchParams.get('path') || '';
      
      // WordPress API URL (using the subdomain)
      const wpApiUrl = process.env.WORDPRESS_API_URL || 'https://wp.ajyxn.com/wp-json';
      
      // Forward the request to WordPress
      const response = await fetch(`${wpApiUrl}/${path}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
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
