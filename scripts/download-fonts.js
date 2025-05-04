const fs = require('fs');
const path = require('path');
const https = require('https');

// Create fonts directory if it doesn't exist
const fontsDir = path.join(process.cwd(), 'public', 'fonts');
if (!fs.existsSync(fontsDir)) {
  fs.mkdirSync(fontsDir, { recursive: true });
  console.log('Created fonts directory:', fontsDir);
}

// List of fonts to download
const fonts = [
  {
    name: 'inter-var.woff2',
    url: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZJhiI2B.woff2',
    credit: 'Inter font by Rasmus Andersson (https://rsms.me/inter/)'
  }
];

// Function to download a font
function downloadFont(url, filepath) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download font: ${response.statusCode}`));
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

// Download all fonts
async function processFonts() {
  // Create a credits file
  const creditsPath = path.join(fontsDir, 'CREDITS.txt');
  let creditsContent = 'Font Credits:\n\n';

  for (const font of fonts) {
    const filepath = path.join(fontsDir, font.name);
    creditsContent += `${font.name}: ${font.credit}\n`;

    try {
      // Skip if the file already exists
      if (fs.existsSync(filepath)) {
        console.log(`File already exists: ${filepath}`);
        continue;
      }

      // Download the font
      await downloadFont(font.url, filepath);
    } catch (error) {
      console.error(`Error processing ${font.name}:`, error);
    }
  }

  // Write the credits file
  fs.writeFileSync(creditsPath, creditsContent);
  console.log(`Created credits file: ${creditsPath}`);
}

// Run the script
processFonts().then(() => {
  console.log('All fonts processed successfully!');
}).catch((error) => {
  console.error('Error processing fonts:', error);
});
