#!/usr/bin/env node

/**
 * Vercel Deployment Script for An Jia Website
 * 
 * This script helps prepare and deploy the An Jia website to Vercel.
 * It handles environment variable setup and runs optimization tasks.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

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

/**
 * Logs a message with color
 */
function log(message, color = colors.fg.white) {
  console.log(`${color}${message}${colors.reset}`);
}

/**
 * Logs a section header
 */
function logSection(message) {
  console.log('\n');
  log('='.repeat(message.length + 4), colors.fg.cyan);
  log(`  ${message}  `, colors.fg.cyan + colors.bright);
  log('='.repeat(message.length + 4), colors.fg.cyan);
  console.log('\n');
}

/**
 * Executes a command and returns the output
 */
function execute(command, silent = false) {
  try {
    if (!silent) {
      log(`> ${command}`, colors.dim);
    }
    return execSync(command, { stdio: silent ? 'pipe' : 'inherit' });
  } catch (error) {
    log(`Error executing command: ${command}`, colors.fg.red);
    log(error.message, colors.fg.red);
    process.exit(1);
  }
}

/**
 * Asks a question and returns the answer
 */
function ask(question) {
  return new Promise((resolve) => {
    rl.question(`${colors.fg.yellow}${question}${colors.reset} `, (answer) => {
      resolve(answer);
    });
  });
}

/**
 * Checks if Vercel CLI is installed
 */
function checkVercelCLI() {
  try {
    execute('vercel --version', true);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Main function
 */
async function main() {
  logSection('An Jia Website Vercel Deployment');
  
  // Check if Vercel CLI is installed
  if (!checkVercelCLI()) {
    log('Vercel CLI is not installed. Installing...', colors.fg.yellow);
    execute('npm install -g vercel');
  }
  
  // Run optimization scripts
  logSection('Running Optimization Scripts');
  execute('npm run optimize:all');
  
  // Prepare for deployment
  logSection('Preparing for Deployment');
  
  // Ask for WordPress API URL
  const wpApiUrl = await ask('Enter your production WordPress API URL (e.g., https://your-wordpress-api.com/wp-json):');
  
  // Update environment variables
  log('Updating environment variables...', colors.fg.cyan);
  
  // Deploy to Vercel
  logSection('Deploying to Vercel');
  log('Running Vercel deployment...', colors.fg.cyan);
  
  // Set environment variables for Vercel
  execute(`vercel env add NEXT_PUBLIC_WORDPRESS_API_URL ${wpApiUrl}`);
  execute(`vercel env add WORDPRESS_API_URL ${wpApiUrl}`);
  execute(`vercel env add WORDPRESS_FALLBACK_API_URL ${wpApiUrl}`);
  
  // Deploy to Vercel
  execute('vercel --prod');
  
  logSection('Deployment Complete');
  log('Your An Jia website has been deployed to Vercel!', colors.fg.green);
  log('Next steps:', colors.fg.cyan);
  log('1. Set up your custom domain in the Vercel dashboard', colors.fg.white);
  log('2. Configure DNS settings in Namecheap', colors.fg.white);
  log('3. Verify your domain and set up SSL', colors.fg.white);
  
  rl.close();
}

// Run the main function
main().catch((error) => {
  log(`Error: ${error.message}`, colors.fg.red);
  process.exit(1);
});
