const fs = require('fs');
const path = require('path');
const CleanCSS = require('clean-css');

// Directories to optimize
const appDir = path.join(process.cwd(), 'app');

// Function to check if a file is a CSS file
function isCssFile(filePath) {
  return path.extname(filePath).toLowerCase() === '.css';
}

// Function to optimize a CSS file
function optimizeCssFile(filePath) {
  try {
    console.log(`Optimizing CSS: ${filePath}`);
    
    // Read the file content
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Optimize the CSS
    const output = new CleanCSS({
      level: 2,
      format: 'keep-breaks',
      sourceMap: false
    }).minify(content);
    
    // Write the optimized content back to the file
    fs.writeFileSync(filePath, output.styles);
    
    console.log(`Optimized CSS: ${filePath} - Reduced by ${Math.round((1 - output.stats.minifiedSize / output.stats.originalSize) * 100)}%`);
  } catch (error) {
    console.error(`Error optimizing CSS ${filePath}:`, error);
  }
}

// Function to recursively process all CSS files in a directory
function processDirectory(dirPath) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    
    if (entry.isDirectory()) {
      processDirectory(fullPath);
    } else if (isCssFile(fullPath)) {
      optimizeCssFile(fullPath);
    }
  }
}

// Main function
function main() {
  console.log('Starting CSS optimization...');
  
  try {
    // Check if clean-css is installed
    try {
      require.resolve('clean-css');
    } catch (e) {
      console.log('clean-css is not installed. Installing...');
      require('child_process').execSync('npm install clean-css --save-dev');
    }
    
    // Optimize app directory
    processDirectory(appDir);
    
    console.log('CSS optimization completed successfully!');
  } catch (error) {
    console.error('Error during CSS optimization:', error);
  }
}

// Run the script
main();
