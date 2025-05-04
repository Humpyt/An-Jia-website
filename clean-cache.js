const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const rimraf = promisify(require('rimraf'));

async function cleanNextCache() {
  try {
    const nextDir = path.join(process.cwd(), '.next');
    console.log(`Attempting to clean Next.js cache at: ${nextDir}`);
    
    if (fs.existsSync(nextDir)) {
      await rimraf(nextDir);
      console.log('Successfully cleaned Next.js cache');
    } else {
      console.log('No .next directory found');
    }
  } catch (error) {
    console.error('Error cleaning Next.js cache:', error);
  }
}

cleanNextCache();
