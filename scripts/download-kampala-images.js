const fs = require('fs');
const path = require('path');
const https = require('https');

// Create headers directory if it doesn't exist
const headersDir = path.join(process.cwd(), 'public', 'images', 'headers');
if (!fs.existsSync(headersDir)) {
  fs.mkdirSync(headersDir, { recursive: true });
  console.log('Created headers directory:', headersDir);
}

// List of alternative Kampala/Africa images
const kampalaImages = [
  {
    name: 'kampala-skyline.jpg',
    url: 'https://images.unsplash.com/photo-1611348524140-53c9a25263d6?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1920',
    credit: 'Photo by Ninno JackJr on Unsplash'
  },
  {
    name: 'kampala-neighborhood.jpg',
    url: 'https://images.unsplash.com/photo-1596005554384-d293674c91d7?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1920',
    credit: 'Photo by Random Institute on Unsplash'
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

// Download all images
async function processImages() {
  // Update the credits file
  const creditsPath = path.join(headersDir, 'CREDITS.txt');
  let creditsContent = fs.existsSync(creditsPath) 
    ? fs.readFileSync(creditsPath, 'utf8') 
    : 'Image Credits:\n\n';

  for (const image of kampalaImages) {
    const filepath = path.join(headersDir, image.name);
    
    // Add to credits
    if (!creditsContent.includes(image.name)) {
      creditsContent += `${image.name}: ${image.credit}\n`;
    }

    try {
      // Download the image (overwrite if exists)
      await downloadImage(image.url, filepath);
    } catch (error) {
      console.error(`Error processing ${image.name}:`, error);
    }
  }

  // Write the updated credits file
  fs.writeFileSync(creditsPath, creditsContent);
  console.log(`Updated credits file: ${creditsPath}`);
}

// Run the script
processImages().then(() => {
  console.log('Kampala images processed successfully!');
}).catch((error) => {
  console.error('Error processing images:', error);
});
