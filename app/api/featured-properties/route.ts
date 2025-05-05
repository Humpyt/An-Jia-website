import { NextRequest, NextResponse } from 'next/server';
import { GET as createGetHandler } from '@/lib/api-utils';

// Using our custom route handler wrapper for correct typing
export const GET = createGetHandler(
  async (request) => {
    try {
      // WordPress API URL (using the subdomain)
      const wpApiUrl = process.env.WORDPRESS_API_URL || 'https://wp.ajyxn.com/wp-json';
      
      // Forward the request to WordPress
      const response = await fetch(`${wpApiUrl}/anjia/v1/featured-properties`, {
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
      console.error('Error in featured properties proxy:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to fetch featured properties' },
        { status: 500 }
      );
    }
  }
);
