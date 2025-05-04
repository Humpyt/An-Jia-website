const fs = require('fs');
const path = require('path');

// Create the pages-manifest.json file if it doesn't exist
const manifestPath = path.join(process.cwd(), '.next', 'server', 'pages-manifest.json');
const manifestDir = path.dirname(manifestPath);

try {
  // Create directory structure if it doesn't exist
  if (!fs.existsSync(manifestDir)) {
    fs.mkdirSync(manifestDir, { recursive: true });
    console.log(`Created directory: ${manifestDir}`);
  }

  // Create an empty manifest file if it doesn't exist
  if (!fs.existsSync(manifestPath)) {
    fs.writeFileSync(manifestPath, '{}', 'utf8');
    console.log(`Created empty pages-manifest.json at: ${manifestPath}`);
  } else {
    console.log(`pages-manifest.json already exists at: ${manifestPath}`);
  }

  console.log('Fix completed successfully!');
} catch (error) {
  console.error('Error fixing Next.js cache:', error);
}
