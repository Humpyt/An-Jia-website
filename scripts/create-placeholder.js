const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Create a simple placeholder image
async function createPlaceholder() {
  const placeholderPath = path.join(process.cwd(), 'public', 'images', 'placeholder.jpg');
  
  // Create a 800x600 gray placeholder with text
  await sharp({
    create: {
      width: 800,
      height: 600,
      channels: 3,
      background: { r: 200, g: 200, b: 200 }
    }
  })
  .jpeg({ quality: 70 })
  .toFile(placeholderPath);
  
  console.log(`Created placeholder image: ${placeholderPath}`);
}

// Run the script
createPlaceholder().catch(console.error);
