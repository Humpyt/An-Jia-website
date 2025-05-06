import { NextResponse } from 'next/server';
import { GET as createGetHandler } from '@/lib/api-utils';

// Using our custom route handler wrapper for correct typing
export const GET = createGetHandler(
  async (request) => {
    try {
      // Get the URL parameters
      const url = new URL(request.url);
      const endpoint = url.searchParams.get('endpoint') || 'wp/v2';
      const id = url.searchParams.get('id') || '';

      // WordPress API URL (now using HTTPS for direct server-side requests)
      const wpApiUrl = 'https://wp.ajyxn.com/wp-json';

      // Build the full API URL
      const apiUrl = id
        ? `${wpApiUrl}/${endpoint}/property/${id}?_embed`
        : `${wpApiUrl}/${endpoint}`;

      console.log(`[WP-DIAGNOSTIC] Testing WordPress API at: ${apiUrl}`);

      // Fetch with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

      const response = await fetch(apiUrl, {
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        cache: 'no-store', // Don't cache this request
        next: { revalidate: 0 } // Don't revalidate
      });

      clearTimeout(timeoutId);

      // Get response headers
      const headers = Object.fromEntries([...response.headers.entries()]);

      if (!response.ok) {
        return NextResponse.json({
          success: false,
          status: response.status,
          statusText: response.statusText,
          headers,
          message: `WordPress API returned ${response.status}: ${response.statusText}`,
          url: apiUrl
        });
      }

      // Get the response data
      const data = await response.json();

      // Return diagnostic information
      return NextResponse.json({
        success: true,
        status: response.status,
        statusText: response.statusText,
        headers,
        dataType: typeof data,
        isArray: Array.isArray(data),
        dataKeys: Array.isArray(data)
          ? data.length > 0 ? Object.keys(data[0]) : []
          : Object.keys(data),
        url: apiUrl,
        // Include a sample of the data
        dataSample: Array.isArray(data)
          ? data.slice(0, 1)
          : data
      });
    } catch (error: any) {
      console.error('[WP-DIAGNOSTIC] Error:', error);
      return NextResponse.json({
        success: false,
        error: error.message || 'Unknown error',
        stack: error.stack
      });
    }
  }
);
