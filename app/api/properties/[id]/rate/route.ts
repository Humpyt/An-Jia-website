import { NextResponse } from 'next/server';
import fetch from 'node-fetch';

const WORDPRESS_API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'http://anjia-wordpress.local/wp-json';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const propertyId = params.id;
    const data = await request.json();

    // Submit rating to WordPress
    const response = await fetch(
      `${WORDPRESS_API_URL}/anjia/v1/properties/${propertyId}/rate`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }
    );

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error submitting rating:', error);
    return NextResponse.json(
      { error: 'Failed to submit rating' },
      { status: 500 }
    );
  }
}
