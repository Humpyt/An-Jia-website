/**
 * Script to test the WordPress API connection
 * 
 * Run this script with Node.js:
 * node scripts/test-wordpress-api.js
 */

const fetch = require('node-fetch');

// Configuration
const WORDPRESS_URLS = [
  process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'http://anjia-wordpress.local/wp-json',
  process.env.WORDPRESS_FALLBACK_API_URL || 'http://localhost/anjia-wordpress/wp-json',
  'http://localhost:10001/wp-json',
  'http://localhost:10002/wp-json',
  'http://localhost:10003/wp-json'
];

// Test endpoints
const ENDPOINTS = [
  '/',
  '/wp/v2/types',
  '/wp/v2/neighborhood',
  '/wp/v2/property'
];

// Function to test a WordPress API endpoint
async function testEndpoint(baseUrl, endpoint) {
  const url = `${baseUrl}${endpoint}`;
  console.log(`Testing: ${url}`);
  
  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json'
      },
      timeout: 5000 // 5 second timeout
    });
    
    const status = response.status;
    const statusText = response.statusText;
    
    if (response.ok) {
      console.log(`✅ ${status} ${statusText}`);
      
      try {
        const data = await response.json();
        if (endpoint === '/wp/v2/types') {
          console.log('Available post types:', Object.keys(data));
        } else if (endpoint === '/wp/v2/neighborhood') {
          console.log(`Found ${Array.isArray(data) ? data.length : 0} neighborhoods`);
        } else if (endpoint === '/wp/v2/property') {
          console.log(`Found ${Array.isArray(data) ? data.length : 0} properties`);
        }
      } catch (jsonError) {
        console.log('❌ Error parsing JSON:', jsonError.message);
      }
    } else {
      console.log(`❌ ${status} ${statusText}`);
    }
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }
  
  console.log('---');
}

// Function to test all WordPress API URLs
async function testWordPressAPIs() {
  console.log('=== WordPress API Connection Test ===\n');
  
  for (const baseUrl of WORDPRESS_URLS) {
    console.log(`\n🔍 Testing WordPress API at: ${baseUrl}\n`);
    
    for (const endpoint of ENDPOINTS) {
      await testEndpoint(baseUrl, endpoint);
    }
    
    console.log('=================================\n');
  }
}

// Run the tests
testWordPressAPIs().catch(error => {
  console.error('Test failed:', error);
  process.exit(1);
});
