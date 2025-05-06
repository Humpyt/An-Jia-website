/**
 * Build for Vercel
 * 
 * This script prepares the project for deployment to Vercel by:
 * 1. Creating a build output directory
 * 2. Copying the necessary files
 * 3. Creating a deployment package
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  underscore: '\x1b[4m',
  blink: '\x1b[5m',
  reverse: '\x1b[7m',
  hidden: '\x1b[8m',
  
  fg: {
    black: '\x1b[30m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    crimson: '\x1b[38m'
  },
  
  bg: {
    black: '\x1b[40m',
    red: '\x1b[41m',
    green: '\x1b[42m',
    yellow: '\x1b[43m',
    blue: '\x1b[44m',
    magenta: '\x1b[45m',
    cyan: '\x1b[46m',
    white: '\x1b[47m',
    crimson: '\x1b[48m'
  }
};

// Helper function to log with color
function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

// Helper function to execute shell commands
function execute(command) {
  try {
    log(`Executing: ${command}`, colors.fg.blue);
    const output = execSync(command, { encoding: 'utf8' });
    return output.trim();
  } catch (error) {
    log(`Error executing command: ${command}`, colors.fg.red);
    log(error.message, colors.fg.red);
    throw error;
  }
}

// Helper function to create directory if it doesn't exist
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    log(`Created directory: ${dirPath}`, colors.fg.green);
  }
}

// Helper function to copy file
function copyFile(source, destination) {
  fs.copyFileSync(source, destination);
  log(`Copied: ${source} -> ${destination}`, colors.fg.green);
}

// Helper function to copy directory
function copyDirectory(source, destination) {
  ensureDirectoryExists(destination);
  
  const files = fs.readdirSync(source);
  
  for (const file of files) {
    const sourcePath = path.join(source, file);
    const destPath = path.join(destination, file);
    
    const stats = fs.statSync(sourcePath);
    
    if (stats.isDirectory()) {
      copyDirectory(sourcePath, destPath);
    } else {
      copyFile(sourcePath, destPath);
    }
  }
}

// Main function
function main() {
  log('=== Building for Vercel Deployment ===', colors.fg.cyan);
  
  // Create build directory
  const buildDir = path.join(__dirname, 'vercel-build');
  ensureDirectoryExists(buildDir);
  
  // Clean build directory
  log('Cleaning build directory...', colors.fg.yellow);
  fs.rmSync(buildDir, { recursive: true, force: true });
  ensureDirectoryExists(buildDir);
  
  // Copy necessary files
  log('Copying files...', colors.fg.yellow);
  
  // Copy package.json and package-lock.json
  copyFile(path.join(__dirname, 'package.json'), path.join(buildDir, 'package.json'));
  copyFile(path.join(__dirname, 'package-lock.json'), path.join(buildDir, 'package-lock.json'));
  
  // Copy Next.js config
  copyFile(path.join(__dirname, 'next.config.js'), path.join(buildDir, 'next.config.js'));
  
  // Copy Vercel config
  copyFile(path.join(__dirname, 'vercel.json'), path.join(buildDir, 'vercel.json'));
  
  // Copy source code directories
  copyDirectory(path.join(__dirname, 'app'), path.join(buildDir, 'app'));
  copyDirectory(path.join(__dirname, 'components'), path.join(buildDir, 'components'));
  copyDirectory(path.join(__dirname, 'lib'), path.join(buildDir, 'lib'));
  copyDirectory(path.join(__dirname, 'public'), path.join(buildDir, 'public'));
  
  // Create README.md for deployment
  fs.writeFileSync(
    path.join(buildDir, 'README.md'),
    '# An Jia Website\n\nThis is a deployment package for the An Jia website.\n'
  );
  
  log('Build completed successfully!', colors.fg.green);
  log(`The build output is available in: ${buildDir}`, colors.fg.white);
  log('', colors.reset);
  log('To deploy to Vercel:', colors.fg.cyan);
  log('1. Navigate to the build directory: cd vercel-build', colors.fg.white);
  log('2. Run the Vercel CLI: vercel --prod', colors.fg.white);
  log('', colors.reset);
}

// Run the main function
try {
  main();
} catch (error) {
  log(`Error: ${error.message}`, colors.fg.red);
  process.exit(1);
}
