const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Directories to optimize
const componentsDir = path.join(process.cwd(), 'components');
const appDir = path.join(process.cwd(), 'app');

// Function to check if a file is a JavaScript/TypeScript file
function isJsFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return ['.js', '.jsx', '.ts', '.tsx'].includes(ext);
}

// Function to optimize a JavaScript/TypeScript file
function optimizeJsFile(filePath) {
  try {
    console.log(`Optimizing: ${filePath}`);
    
    // Read the file content
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Remove console.log statements in production
    content = content.replace(/console\.log\([^)]*\);?/g, '');
    
    // Remove unnecessary whitespace and comments
    content = content.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '');
    content = content.replace(/\s{2,}/g, ' ');
    
    // Write the optimized content back to the file
    fs.writeFileSync(filePath, content);
    
    console.log(`Optimized: ${filePath}`);
  } catch (error) {
    console.error(`Error optimizing ${filePath}:`, error);
  }
}

// Function to recursively process all JavaScript/TypeScript files in a directory
function processDirectory(dirPath) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    
    if (entry.isDirectory()) {
      processDirectory(fullPath);
    } else if (isJsFile(fullPath)) {
      optimizeJsFile(fullPath);
    }
  }
}

// Main function
function main() {
  console.log('Starting code optimization...');
  
  try {
    // Optimize components directory
    processDirectory(componentsDir);
    
    // Optimize app directory
    processDirectory(appDir);
    
    console.log('Code optimization completed successfully!');
  } catch (error) {
    console.error('Error during code optimization:', error);
  }
}

// Run the script
main();
