const fs = require('fs');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');

// Create headers directory if it doesn't exist
const headersDir = path.join(process.cwd(), 'public', 'images', 'headers');
if (!fs.existsSync(headersDir)) {
  fs.mkdirSync(headersDir, { recursive: true });
  console.log('Created headers directory:', headersDir);
}

// List of high-quality property stock images with proper attribution
// These are royalty-free images from Unsplash and Pexels
const headerImages = [
  {
    name: 'modern-building-exterior.jpg',
    url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1920',
    credit: 'Photo by Lance Anderson on Unsplash'
  },
  {
    name: 'luxury-apartment-interior.jpg',
    url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1920',
    credit: 'Photo by Francesca Tosolini on Unsplash'
  },
  {
    name: 'kampala-skyline.jpg',
    url: 'https://images.unsplash.com/photo-1621852003687-0092b5b9c8c2?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1920',
    credit: 'Photo by Random Institute on Unsplash'
  },
  {
    name: 'modern-office-reception.jpg',
    url: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1920',
    credit: 'Photo by Nastuh Abootalebi on Unsplash'
  },
  {
    name: 'luxury-home-exterior.jpg',
    url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1920',
    credit: 'Photo by Avi Waxman on Unsplash'
  },
  {
    name: 'kampala-neighborhood.jpg',
    url: 'https://images.unsplash.com/photo-1580223530509-849e0b90a407?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1920',
    credit: 'Photo by Random Institute on Unsplash'
  },
  {
    name: 'modern-living-room.jpg',
    url: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1920',
    credit: 'Photo by R ARCHITECTURE on Unsplash'
  },
  {
    name: 'elegant-bedroom.jpg',
    url: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1920',
    credit: 'Photo by Spacejoy on Unsplash'
  },
  {
    name: 'modern-workspace.jpg',
    url: 'https://images.unsplash.com/photo-1497215842964-222b430dc094?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1920',
    credit: 'Photo by Nastuh Abootalebi on Unsplash'
  },
  {
    name: 'luxury-kitchen.jpg',
    url: 'https://images.unsplash.com/photo-1600489000022-c2086d79f9d4?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1920',
    credit: 'Photo by R ARCHITECTURE on Unsplash'
  },
  {
    name: 'property-search.jpg',
    url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1920',
    credit: 'Photo by Francesca Tosolini on Unsplash'
  }
];

// Function to download an image
function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download image: ${response.statusCode}`));
        return;
      }

      const fileStream = fs.createWriteStream(filepath);
      response.pipe(fileStream);

      fileStream.on('finish', () => {
        fileStream.close();
        console.log(`Downloaded: ${filepath}`);
        resolve(filepath);
      });

      fileStream.on('error', (err) => {
        fs.unlink(filepath, () => {}); // Delete the file if there was an error
        reject(err);
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

// Function to optimize an image using sharp (if available)
function optimizeImage(filepath) {
  try {
    // Check if sharp is installed
    try {
      require.resolve('sharp');
    } catch (e) {
      console.log('Sharp is not installed. Skipping optimization.');
      return Promise.resolve(filepath);
    }

    const sharp = require('sharp');
    const optimizedPath = filepath;

    return sharp(filepath)
      .resize(1920, null, { withoutEnlargement: true })
      .jpeg({ quality: 80, progressive: true })
      .toFile(optimizedPath + '.optimized')
      .then(() => {
        fs.unlinkSync(filepath);
        fs.renameSync(optimizedPath + '.optimized', optimizedPath);
        console.log(`Optimized: ${filepath}`);
        return filepath;
      });
  } catch (error) {
    console.error(`Error optimizing image ${filepath}:`, error);
    return Promise.resolve(filepath);
  }
}

// Download and optimize all images
async function processImages() {
  // Create a credits file
  const creditsPath = path.join(headersDir, 'CREDITS.txt');
  let creditsContent = 'Image Credits:\n\n';

  for (const image of headerImages) {
    const filepath = path.join(headersDir, image.name);
    creditsContent += `${image.name}: ${image.credit}\n`;

    try {
      // Skip if the file already exists
      if (fs.existsSync(filepath)) {
        console.log(`File already exists: ${filepath}`);
        continue;
      }

      // Download the image
      await downloadImage(image.url, filepath);

      // Optimize the image
      await optimizeImage(filepath);
    } catch (error) {
      console.error(`Error processing ${image.name}:`, error);
    }
  }

  // Write the credits file
  fs.writeFileSync(creditsPath, creditsContent);
  console.log(`Created credits file: ${creditsPath}`);
}

// Run the script
processImages().then(() => {
  console.log('All images processed successfully!');
}).catch((error) => {
  console.error('Error processing images:', error);
});
