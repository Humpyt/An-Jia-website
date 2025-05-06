import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    // Read the manifest file from the public directory
    const manifestPath = path.join(process.cwd(), 'public', 'app-manifest.json');
    const manifestContent = fs.readFileSync(manifestPath, 'utf8');
    const manifestData = JSON.parse(manifestContent);

    // Return the manifest with appropriate headers
    return NextResponse.json(manifestData, {
      headers: {
        'Content-Type': 'application/manifest+json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=0, must-revalidate'
      }
    });
  } catch (error) {
    console.error('Error serving manifest:', error);
    
    // Return a basic manifest if the file can't be read
    return NextResponse.json({
      name: "An Jia You Xuan",
      short_name: "An Jia",
      icons: [
        {
          src: "/favicon.ico",
          sizes: "64x64",
          type: "image/x-icon"
        }
      ],
      theme_color: "#ffffff",
      background_color: "#ffffff",
      display: "standalone"
    }, {
      headers: {
        'Content-Type': 'application/manifest+json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=0, must-revalidate'
      }
    });
  }
}
