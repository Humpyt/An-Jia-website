/**
 * Simple script to test WordPress API connection
 * Run with: node scripts/test-wp-connection.js
 */

// Use native fetch in Node.js
const https = require('https');
const http = require('http');

// WordPress API URLs to test
const WORDPRESS_URLS = [
  'http://localhost/anjia-wordpress/wp-json',
  'http://anjia-wordpress.local/wp-json',
  'http://127.0.0.1/anjia-wordpress/wp-json',
  'http://localhost:10001/wp-json',
  'http://localhost:10002/wp-json'
];

// Test a single URL
async function testUrl(url) {
  console.log(`\nTesting connection to: ${url}`);
  
  return new Promise((resolve) => {
    const httpModule = url.startsWith('https') ? https : http;
    
    const req = httpModule.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log(`✅ Status: ${res.statusCode} ${res.statusMessage}`);
        
        try {
          const jsonData = JSON.parse(data);
          console.log('✅ Valid JSON response received');
          console.log('API Name:', jsonData.name);
          console.log('API Description:', jsonData.description);
          console.log('API URL:', jsonData.url);
          console.log('Routes available:', Object.keys(jsonData.routes).length);
          resolve(true);
        } catch (e) {
          console.log('❌ Invalid JSON response');
          console.log('Raw response:', data.substring(0, 100) + '...');
          resolve(false);
        }
      });
    });
    
    req.on('error', (error) => {
      console.log(`❌ Connection error: ${error.message}`);
      resolve(false);
    });
    
    // Set a timeout of 5 seconds
    req.setTimeout(5000, () => {
      console.log('❌ Connection timeout');
      req.destroy();
      resolve(false);
    });
  });
}

// Test neighborhood endpoint
async function testNeighborhoodEndpoint(url) {
  const endpointUrl = `${url}/wp/v2/neighborhood`;
  console.log(`\nTesting neighborhood endpoint: ${endpointUrl}`);
  
  return new Promise((resolve) => {
    const httpModule = url.startsWith('https') ? https : http;
    
    const req = httpModule.get(endpointUrl, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log(`Status: ${res.statusCode} ${res.statusMessage}`);
        
        if (res.statusCode === 200) {
          try {
            const jsonData = JSON.parse(data);
            console.log('✅ Valid JSON response received');
            console.log(`Found ${jsonData.length} neighborhoods`);
            if (jsonData.length > 0) {
              console.log('First neighborhood:', jsonData[0].title?.rendered || jsonData[0].title || 'No title');
            }
            resolve(true);
          } catch (e) {
            console.log('❌ Invalid JSON response');
            console.log('Raw response:', data.substring(0, 100) + '...');
            resolve(false);
          }
        } else {
          console.log('❌ Endpoint returned error');
          console.log('Raw response:', data.substring(0, 100) + '...');
          resolve(false);
        }
      });
    });
    
    req.on('error', (error) => {
      console.log(`❌ Connection error: ${error.message}`);
      resolve(false);
    });
    
    // Set a timeout of 5 seconds
    req.setTimeout(5000, () => {
      console.log('❌ Connection timeout');
      req.destroy();
      resolve(false);
    });
  });
}

// Main function to test all URLs
async function testAllUrls() {
  console.log('=== WordPress API Connection Test ===');
  
  let successfulUrl = null;
  
  for (const url of WORDPRESS_URLS) {
    const success = await testUrl(url);
    if (success) {
      successfulUrl = url;
      console.log(`\n✅ Successfully connected to ${url}`);
      
      // Test neighborhood endpoint
      const neighborhoodSuccess = await testNeighborhoodEndpoint(url);
      if (neighborhoodSuccess) {
        console.log(`✅ Successfully accessed neighborhoods at ${url}`);
      } else {
        console.log(`❌ Failed to access neighborhoods at ${url}`);
      }
      
      break;
    }
  }
  
  if (successfulUrl) {
    console.log('\n=== RECOMMENDATION ===');
    console.log(`Use this URL in your .env.local file:`);
    console.log(`NEXT_PUBLIC_WORDPRESS_API_URL=${successfulUrl}`);
    console.log(`WORDPRESS_API_URL=${successfulUrl}`);
  } else {
    console.log('\n❌ Failed to connect to any WordPress API endpoint');
    console.log('Please check if WordPress is running and accessible');
  }
}

// Run the tests
testAllUrls().catch(console.error);
