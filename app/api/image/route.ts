import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Define fallback images
const FALLBACK_IMAGES = [
  '/images/properties/fallback-1.svg',
  '/images/properties/fallback-2.svg',
  '/images/properties/fallback-3.svg',
  '/images/properties/property-placeholder.svg',
];

// Get a random fallback image
const getRandomFallback = () => {
  return FALLBACK_IMAGES[Math.floor(Math.random() * FALLBACK_IMAGES.length)];
};

// Check if a file exists in the public directory
const fileExists = (filePath: string): boolean => {
  try {
    const fullPath = path.join(process.cwd(), 'public', filePath);
    return fs.existsSync(fullPath);
  } catch (error) {
    console.error('Error checking if file exists:', error);
    return false;
  }
};

export async function GET(request: NextRequest) {
  try {
    // Get the URL parameter
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get('url');

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'Missing url parameter' },
        { status: 400 }
      );
    }

    // If it's an external URL, return a redirect to a fallback
    if (imageUrl.startsWith('http')) {
      const fallback = getRandomFallback();
      return NextResponse.redirect(new URL(fallback, request.url));
    }

    // Clean the URL (remove leading slash if present)
    const cleanUrl = imageUrl.startsWith('/') ? imageUrl.substring(1) : imageUrl;
    
    // Check if the file exists in the public directory
    if (fileExists(cleanUrl)) {
      // File exists, redirect to it
      return NextResponse.redirect(new URL(`/${cleanUrl}`, request.url));
    }

    // File doesn't exist, use a fallback
    const fallback = getRandomFallback();
    return NextResponse.redirect(new URL(fallback, request.url));
  } catch (error) {
    console.error('Error in image API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
