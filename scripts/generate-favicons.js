const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Define the source logo path
const logoPath = path.join(__dirname, '../public/logo.png');

// Define the output directory
const outputDir = path.join(__dirname, '../public');

// Create the output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Define the favicon sizes to generate
const faviconSizes = [
  { name: 'favicon.ico', size: 32 },
  { name: 'favicon-16x16.png', size: 16 },
  { name: 'favicon-32x32.png', size: 32 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'android-chrome-192x192.png', size: 192 },
  { name: 'android-chrome-512x512.png', size: 512 }
];

// Function to generate a favicon
async function generateFavicon(inputPath, outputPath, size) {
  try {
    // For ICO files, we need to use a different approach
    if (outputPath.endsWith('.ico')) {
      await sharp(inputPath)
        .resize(size, size)
        .toFormat('png')
        .toBuffer()
        .then(data => {
          // Write the buffer to the output path
          fs.writeFileSync(outputPath, data);
          console.log(`Generated ${outputPath}`);
        });
    } else {
      // For PNG files
      await sharp(inputPath)
        .resize(size, size)
        .toFormat('png')
        .toFile(outputPath);
      console.log(`Generated ${outputPath}`);
    }
  } catch (error) {
    console.error(`Error generating ${outputPath}:`, error);
  }
}

// Generate all favicon sizes
async function generateAllFavicons() {
  console.log('Generating favicons from logo...');
  
  for (const favicon of faviconSizes) {
    const outputPath = path.join(outputDir, favicon.name);
    await generateFavicon(logoPath, outputPath, favicon.size);
  }
  
  console.log('Favicon generation complete!');
}

// Run the script
generateAllFavicons().catch(error => {
  console.error('Error generating favicons:', error);
  process.exit(1);
});
