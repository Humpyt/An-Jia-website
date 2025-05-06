/**
 * Test API Endpoints
 *
 * This script tests various API endpoints to see which ones work correctly.
 */

const BASE_URL = 'https://ajyxn.com';
const endpoints = [
  `${BASE_URL}/api/properties-data`,
  `${BASE_URL}/api/properties-reliable`,
  `${BASE_URL}/api/featured-properties`
];

async function testEndpoint(endpoint) {
  console.log(`Testing endpoint: ${endpoint}`);
  try {
    const response = await fetch(endpoint);
    if (!response.ok) {
      console.error(`Error: ${response.status} ${response.statusText}`);
      return false;
    }

    const data = await response.json();
    console.log(`Success! Received data with ${data.properties ? data.properties.length : (Array.isArray(data) ? data.length : 0)} properties`);
    return true;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    return false;
  }
}

async function runTests() {
  console.log('Starting endpoint tests...');

  for (const endpoint of endpoints) {
    const success = await testEndpoint(endpoint);
    console.log(`${endpoint}: ${success ? 'PASSED' : 'FAILED'}`);
    console.log('-----------------------------------');
  }

  console.log('Tests completed!');
}

// Run the tests
runTests();
