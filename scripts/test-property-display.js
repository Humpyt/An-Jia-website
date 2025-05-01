/**
 * Script to test property API endpoints and verify features
 * 
 * Run this script with Node.js:
 * node scripts/test-property-display.js [property_id1] [property_id2]
 */

const fetch = require('node-fetch');

// Configuration
const BASE_URL = 'http://localhost:3000';

// Get property IDs from command line arguments
const propertyIds = process.argv.slice(2);
if (propertyIds.length < 1) {
  console.error('Please provide at least one property ID as a command line argument');
  console.error('Usage: node scripts/test-property-display.js [property_id1] [property_id2]');
  process.exit(1);
}

// Test API endpoint for a property
async function testPropertyAPI(propertyId) {
  console.log(`\nTesting API for property ID: ${propertyId}`);
  
  try {
    const response = await fetch(`${BASE_URL}/api/properties/${propertyId}`);
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const property = await response.json();
    
    console.log(`\n✅ Property API Response for ID ${propertyId}:`);
    console.log(`Title: ${property.title}`);
    console.log(`Property Type: ${property.propertyType || 'Not set'}`);
    console.log(`Price: $${property.formattedPrice || property.price}`);
    console.log(`Location: ${property.location}`);
    console.log(`Premium: ${property.isPremium ? 'Yes' : 'No'}`);
    console.log(`Amenities: ${property.amenities ? property.amenities.join(', ') : 'None'}`);
    
    // Check for description enhancement
    if (property.description) {
      console.log('\nDescription:');
      console.log('- Original length:', property.description.original ? property.description.original.length : 0);
      console.log('- Enhanced length:', property.description.enhanced ? property.description.enhanced.length : 0);
      
      if (property.description.enhanced && 
          property.description.original && 
          property.description.enhanced.length > property.description.original.length) {
        console.log('✅ Description was successfully enhanced');
      } else {
        console.log('❌ Description enhancement may not be working properly');
      }
    }
    
    // Verify price formatting
    if (property.price) {
      const expectedFormat = property.price.toLocaleString();
      if (property.formattedPrice === expectedFormat) {
        console.log('✅ Price formatting is correct');
      } else {
        console.log(`❌ Price formatting issue. Expected: ${expectedFormat}, Got: ${property.formattedPrice}`);
      }
    }
    
    return property;
  } catch (error) {
    console.error(`❌ Error testing property API: ${error.message}`);
    return null;
  }
}

// Main function
async function main() {
  console.log('=== Property Features Test ===');
  
  const results = [];
  
  // Test each property
  for (const propertyId of propertyIds) {
    const property = await testPropertyAPI(propertyId);
    if (property) {
      results.push({
        id: propertyId,
        title: property.title,
        success: true
      });
    } else {
      results.push({
        id: propertyId,
        success: false
      });
    }
  }
  
  // Summary
  console.log('\n=== Test Summary ===');
  console.log(`Properties tested: ${propertyIds.length}`);
  console.log(`Successful tests: ${results.filter(r => r.success).length}`);
  console.log(`Failed tests: ${results.filter(r => !r.success).length}`);
  
  console.log('\nNext steps:');
  console.log('1. Visit these URLs in your browser to verify the frontend display:');
  propertyIds.forEach(id => {
    console.log(`   - http://localhost:3000/properties/${id}`);
  });
  console.log('2. Check that the property page has only one header');
  console.log('3. Verify that amenities display correctly in the Amenities tab');
  console.log('4. Confirm that the DeepSeek enhanced description appears in the Description tab');
  console.log('5. Test the rating submission form functionality');
}

// Run the script
main().catch(console.error);
