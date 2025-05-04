const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Directory to optimize
const publicDir = path.join(process.cwd(), 'public');

// Function to check if a file is an image
function isImage(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return ['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext);
}

// Function to optimize an image
async function optimizeImage(filePath) {
  try {
    const ext = path.extname(filePath).toLowerCase();
    const optimizedPath = filePath + '.optimized';
    
    console.log(`Optimizing: ${filePath}`);
    
    let sharpInstance = sharp(filePath);
    
    // Resize large images (preserve aspect ratio)
    const metadata = await sharpInstance.metadata();
    if (metadata.width > 1920) {
      sharpInstance = sharpInstance.resize(1920, null, { withoutEnlargement: true });
    }
    
    // Apply appropriate compression based on image type
    if (ext === '.jpg' || ext === '.jpeg') {
      await sharpInstance
        .jpeg({ quality: 80, progressive: true })
        .toFile(optimizedPath);
    } else if (ext === '.png') {
      await sharpInstance
        .png({ compressionLevel: 9, progressive: true })
        .toFile(optimizedPath);
    } else if (ext === '.webp') {
      await sharpInstance
        .webp({ quality: 80 })
        .toFile(optimizedPath);
    } else if (ext === '.gif') {
      // Just copy GIFs as Sharp doesn't optimize them well
      fs.copyFileSync(filePath, optimizedPath);
      return;
    } else {
      // Unsupported format, skip
      return;
    }
    
    // Get file sizes for comparison
    const originalSize = fs.statSync(filePath).size;
    const optimizedSize = fs.statSync(optimizedPath).size;
    
    // Only replace if the optimized version is smaller
    if (optimizedSize < originalSize) {
      fs.unlinkSync(filePath);
      fs.renameSync(optimizedPath, filePath);
      console.log(`Optimized: ${filePath} - Reduced from ${formatBytes(originalSize)} to ${formatBytes(optimizedSize)}`);
    } else {
      fs.unlinkSync(optimizedPath);
      console.log(`Skipped: ${filePath} - Original is smaller`);
    }
  } catch (error) {
    console.error(`Error optimizing ${filePath}:`, error);
  }
}

// Function to format bytes to human-readable format
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// Function to recursively process all images in a directory
async function processDirectory(dirPath) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    
    if (entry.isDirectory()) {
      await processDirectory(fullPath);
    } else if (isImage(fullPath)) {
      await optimizeImage(fullPath);
    }
  }
}

// Main function
async function main() {
  console.log('Starting image optimization...');
  
  try {
    await processDirectory(publicDir);
    console.log('Image optimization completed successfully!');
  } catch (error) {
    console.error('Error during image optimization:', error);
  }
}

// Run the script
main();
