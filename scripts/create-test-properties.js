/**
 * Script to create test properties in WordPress
 * 
 * Run this script with Node.js:
 * node scripts/create-test-properties.js
 */

const fetch = require('node-fetch');

// Configuration
const WORDPRESS_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'http://anjia-wordpress.local/wp-json';
const USERNAME = 'admin'; // Replace with your WordPress username
const PASSWORD = 'password'; // Replace with your WordPress password

// Test properties data
const testProperties = [
  {
    title: "Luxury Villa in Kololo",
    content: "This is a beautiful 4-bedroom villa in Kololo with a swimming pool and garden. The property features modern amenities and is close to the city center.",
    acf: {
      property_type: "Villa",
      price: 850000,
      location: "Kololo, Kampala",
      bedrooms: 4,
      bathrooms: 3.5,
      square_meters: 350,
      property_description: "This is a beautiful 4-bedroom villa in Kololo with a swimming pool and garden. The property features modern amenities and is close to the city center.",
      property_amenities: ["wifi", "swimming_pool", "security", "garden", "parking", "generator"],
      is_premium: true
    }
  },
  {
    title: "Modern Apartment in Nakasero",
    content: "A 2-bedroom apartment in Nakasero with a balcony and city views. The apartment has been recently renovated and includes new appliances.",
    acf: {
      property_type: "Apartment",
      price: 350000,
      location: "Nakasero, Kampala",
      bedrooms: 2,
      bathrooms: 2,
      square_meters: 120,
      property_description: "A 2-bedroom apartment in Nakasero with a balcony and city views. The apartment has been recently renovated and includes new appliances.",
      property_amenities: ["wifi", "elevator", "security", "balcony", "air_conditioning"],
      is_premium: false
    }
  }
];

// Get authentication token
async function getAuthToken() {
  try {
    const response = await fetch(`${WORDPRESS_URL}/jwt-auth/v1/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: USERNAME,
        password: PASSWORD
      })
    });

    const data = await response.json();
    
    if (data.token) {
      console.log('Authentication successful');
      return data.token;
    } else {
      console.error('Authentication failed:', data);
      return null;
    }
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
}

// Create a property
async function createProperty(property, token) {
  try {
    console.log(`Creating property: ${property.title}`);
    
    const response = await fetch(`${WORDPRESS_URL}/wp/v2/property`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        title: property.title,
        content: property.content,
        status: 'publish',
        acf: property.acf
      })
    });

    const data = await response.json();
    
    if (data.id) {
      console.log(`Property created successfully. ID: ${data.id}`);
      return data.id;
    } else {
      console.error('Failed to create property:', data);
      return null;
    }
  } catch (error) {
    console.error('Error creating property:', error);
    return null;
  }
}

// Main function
async function main() {
  console.log('=== Creating Test Properties ===');
  
  // Get authentication token
  const token = await getAuthToken();
  if (!token) {
    console.error('Failed to get authentication token. Exiting...');
    return;
  }
  
  // Create properties
  const createdIds = [];
  
  for (const property of testProperties) {
    const id = await createProperty(property, token);
    if (id) {
      createdIds.push({ title: property.title, id });
    }
  }
  
  // Summary
  console.log('\n=== Summary ===');
  console.log(`Total properties created: ${createdIds.length}`);
  
  if (createdIds.length > 0) {
    console.log('\nCreated properties:');
    createdIds.forEach(prop => {
      console.log(`- ${prop.title} (ID: ${prop.id})`);
    });
    
    console.log('\nTest URLs:');
    createdIds.forEach(prop => {
      console.log(`- API: http://localhost:3000/api/properties/${prop.id}`);
      console.log(`- Frontend: http://localhost:3000/properties/${prop.id}`);
    });
  }
}

// Run the script
main().catch(console.error);
