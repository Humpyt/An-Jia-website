/**
 * Fix Properties Page Script
 * 
 * This script deploys the fixes for the properties page to Vercel.
 */

const { execSync } = require('child_process');
const readline = require('readline');

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Colors for console output
const colors = {
  fg: {
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
  },
  reset: '\x1b[0m',
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

// Main function
async function main() {
  logSection('An Jia Properties Page Fix');
  log('This script will deploy the fixes for the properties page to Vercel.', colors.fg.white);
  
  // Check if Git is installed
  try {
    const gitVersion = execute('git --version');
    log(`Git detected: ${gitVersion}`, colors.fg.green);
  } catch (error) {
    log('Git is not installed. Please install Git and try again.', colors.fg.red);
    process.exit(1);
  }
  
  // Check if Vercel CLI is installed
  try {
    const vercelVersion = execute('vercel --version');
    log(`Vercel CLI detected: ${vercelVersion}`, colors.fg.green);
  } catch (error) {
    log('Vercel CLI is not installed. Please install it with: npm i -g vercel', colors.fg.red);
    process.exit(1);
  }
  
  // Check Git status
  const gitStatus = execute('git status --porcelain');
  if (gitStatus) {
    log('You have uncommitted changes:', colors.fg.yellow);
    log(gitStatus, colors.fg.white);
    
    const shouldContinue = await ask('Do you want to commit these changes before deploying? (y/n):');
    if (shouldContinue.toLowerCase() === 'y') {
      const commitMessage = await ask('Enter a commit message:');
      execute('git add .');
      execute(`git commit -m "${commitMessage}"`);
      log('Changes committed successfully.', colors.fg.green);
    } else {
      log('Continuing without committing changes...', colors.fg.yellow);
    }
  } else {
    log('Git working directory is clean.', colors.fg.green);
  }
  
  // Build the project
  logSection('Building the Project');
  try {
    execute('npm run build');
    log('Build completed successfully.', colors.fg.green);
  } catch (error) {
    log('Build failed. Please fix the errors and try again.', colors.fg.red);
    process.exit(1);
  }
  
  // Deploy to Vercel
  logSection('Deploying to Vercel');
  try {
    const shouldProd = await ask('Deploy to production? (y/n):');
    if (shouldProd.toLowerCase() === 'y') {
      log('Deploying to production...', colors.fg.cyan);
      execute('vercel --prod');
    } else {
      log('Deploying to preview environment...', colors.fg.cyan);
      execute('vercel');
    }
    log('Deployment completed successfully.', colors.fg.green);
  } catch (error) {
    log('Deployment failed. Please check the error message above.', colors.fg.red);
    process.exit(1);
  }
  
  logSection('Deployment Complete');
  log('The properties page fix has been deployed to Vercel.', colors.fg.green);
  log('Next steps:', colors.fg.cyan);
  log('1. Test the properties page at https://ajyxn.com/properties', colors.fg.white);
  log('2. Check the browser console for any errors', colors.fg.white);
  log('3. If issues persist, check the Vercel logs for more details', colors.fg.white);
  
  rl.close();
}

// Run the main function
main().catch((error) => {
  log(`Error: ${error.message}`, colors.fg.red);
  process.exit(1);
});
