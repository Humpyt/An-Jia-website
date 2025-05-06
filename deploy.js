/**
 * An Jia Website Deployment Script
 * 
 * This script deploys the An Jia website to Vercel.
 */

const { execSync } = require('child_process');
const readline = require('readline');
const fs = require('fs');
const path = require('path');

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

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
    const output = execSync(command, { encoding: 'utf8', stdio: 'inherit' });
    return output;
  } catch (error) {
    log(`Error executing command: ${command}`, colors.fg.red);
    if (error.message) log(error.message, colors.fg.red);
    throw error;
  }
}

// Helper function to log section headers
function logSection(title) {
  const separator = '='.repeat(title.length + 4);
  log('', colors.fg.cyan);
  log(separator, colors.fg.cyan);
  log(`  ${title}  `, colors.fg.cyan);
  log(separator, colors.fg.cyan);
  log('', colors.fg.cyan);
}

// Helper function to ask questions
function ask(question) {
  return new Promise((resolve) => {
    rl.question(`${colors.fg.yellow}${question}${colors.reset} `, (answer) => {
      resolve(answer);
    });
  });
}

// Check if Vercel CLI is installed
async function checkVercelCLI() {
  try {
    execute('vercel --version');
    log('Vercel CLI is installed.', colors.fg.green);
    return true;
  } catch (error) {
    log('Vercel CLI is not installed.', colors.fg.red);
    const installVercel = await ask('Would you like to install Vercel CLI now? (y/n):');
    if (installVercel.toLowerCase() === 'y') {
      try {
        execute('npm install -g vercel');
        log('Vercel CLI installed successfully.', colors.fg.green);
        return true;
      } catch (installError) {
        log('Failed to install Vercel CLI.', colors.fg.red);
        return false;
      }
    } else {
      return false;
    }
  }
}

// Check if user is logged in to Vercel
async function checkVercelLogin() {
  try {
    execute('vercel whoami');
    log('You are logged in to Vercel.', colors.fg.green);
    return true;
  } catch (error) {
    log('You are not logged in to Vercel.', colors.fg.red);
    const login = await ask('Would you like to login to Vercel now? (y/n):');
    if (login.toLowerCase() === 'y') {
      try {
        execute('vercel login');
        log('Logged in to Vercel successfully.', colors.fg.green);
        return true;
      } catch (loginError) {
        log('Failed to login to Vercel.', colors.fg.red);
        return false;
      }
    } else {
      return false;
    }
  }
}

// Build the project
async function buildProject() {
  logSection('Building the Project');
  try {
    execute('npm run build');
    log('Build completed successfully.', colors.fg.green);
    return true;
  } catch (error) {
    log('Build failed.', colors.fg.red);
    return false;
  }
}

// Deploy to Vercel
async function deployToVercel() {
  logSection('Deploying to Vercel');
  
  const deployProd = await ask('Deploy to production? (y/n):');
  
  try {
    if (deployProd.toLowerCase() === 'y') {
      log('Deploying to production...', colors.fg.cyan);
      execute('vercel --prod');
    } else {
      log('Deploying to preview environment...', colors.fg.cyan);
      execute('vercel');
    }
    log('Deployment completed successfully.', colors.fg.green);
    return true;
  } catch (error) {
    log('Deployment failed.', colors.fg.red);
    return false;
  }
}

// Main function
async function main() {
  logSection('An Jia Website Deployment');
  
  // Check prerequisites
  const vercelCliInstalled = await checkVercelCLI();
  if (!vercelCliInstalled) {
    log('Please install Vercel CLI and try again.', colors.fg.red);
    rl.close();
    return;
  }
  
  const vercelLoggedIn = await checkVercelLogin();
  if (!vercelLoggedIn) {
    log('Please login to Vercel and try again.', colors.fg.red);
    rl.close();
    return;
  }
  
  // Build and deploy
  const buildSuccess = await buildProject();
  if (!buildSuccess) {
    log('Please fix the build errors and try again.', colors.fg.red);
    rl.close();
    return;
  }
  
  const deploySuccess = await deployToVercel();
  if (!deploySuccess) {
    log('Please check the deployment errors and try again.', colors.fg.red);
    rl.close();
    return;
  }
  
  // Verify deployment
  logSection('Verifying Deployment');
  log('Please verify that the properties page is working correctly:', colors.fg.white);
  log('1. Visit https://ajyxn.com/properties', colors.fg.white);
  log('2. Check that property data is loading correctly', colors.fg.white);
  log('3. Open the browser console (F12) and look for any errors', colors.fg.white);
  log('4. Test the property filters and pagination', colors.fg.white);
  
  logSection('Deployment Complete');
  log('The An Jia website has been deployed to Vercel.', colors.fg.green);
  log('If you encounter any issues, please check the troubleshooting section in DEPLOYMENT-INSTRUCTIONS.md', colors.fg.white);
  
  rl.close();
}

// Run the main function
main().catch((error) => {
  log(`Error: ${error.message}`, colors.fg.red);
  rl.close();
  process.exit(1);
});
