#!/usr/bin/env node

/**
 * Netlify deployment helper script
 * This script helps with deploying the An Jia Website to Netlify
 */

const { execSync } = require('child_process');
const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Check if Netlify CLI is installed
try {
  execSync('netlify --version', { stdio: 'ignore' });
  console.log('✅ Netlify CLI is installed');
} catch (error) {
  console.log('❌ Netlify CLI is not installed. Installing...');
  try {
    execSync('npm install -g netlify-cli', { stdio: 'inherit' });
    console.log('✅ Netlify CLI installed successfully');
  } catch (installError) {
    console.error('❌ Failed to install Netlify CLI. Please install it manually with: npm install -g netlify-cli');
    process.exit(1);
  }
}

// Check if user is logged in to Netlify
let isLoggedIn = false;
try {
  const netlifySites = execSync('netlify sites:list --json').toString();
  if (netlifySites.includes('[') || netlifySites.includes('{')) {
    isLoggedIn = true;
    console.log('✅ Already logged in to Netlify');
  }
} catch (error) {
  console.log('❌ Not logged in to Netlify');
}

if (!isLoggedIn) {
  console.log('Please log in to Netlify:');
  execSync('netlify login', { stdio: 'inherit' });
}

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  console.log('❌ .env file not found. Creating one...');
  
  const askQuestion = (question) => {
    return new Promise((resolve) => {
      rl.question(question, (answer) => {
        resolve(answer);
      });
    });
  };
  
  (async () => {
    const supabaseUrl = await askQuestion('Enter your Supabase URL: ');
    const supabaseAnonKey = await askQuestion('Enter your Supabase Anon Key: ');
    const supabaseServiceKey = await askQuestion('Enter your Supabase Service Role Key: ');
    
    const envContent = `NEXT_PUBLIC_SUPABASE_URL=${supabaseUrl}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${supabaseAnonKey}
SUPABASE_URL=${supabaseUrl}
SUPABASE_SERVICE_ROLE_KEY=${supabaseServiceKey}`;
    
    fs.writeFileSync(envPath, envContent);
    console.log('✅ .env file created successfully');
    
    // Continue with deployment
    deployToNetlify();
    
    rl.close();
  })();
} else {
  console.log('✅ .env file found');
  deployToNetlify();
  rl.close();
}

function deployToNetlify() {
  console.log('Checking if site is already initialized with Netlify...');
  
  const netlifyConfigPath = path.join(__dirname, '.netlify', 'state.json');
  const isInitialized = fs.existsSync(netlifyConfigPath);
  
  if (!isInitialized) {
    console.log('Initializing new Netlify site...');
    try {
      execSync('netlify init', { stdio: 'inherit' });
    } catch (error) {
      console.error('❌ Failed to initialize Netlify site');
      process.exit(1);
    }
  }
  
  // Set environment variables from .env file
  console.log('Setting up environment variables...');
  const envContent = fs.readFileSync(envPath, 'utf8');
  const envVars = envContent.split('\n').filter(line => line.trim() !== '');
  
  for (const envVar of envVars) {
    const [key, value] = envVar.split('=');
    if (key && value) {
      try {
        execSync(`netlify env:set ${key} ${value}`, { stdio: 'ignore' });
        console.log(`✅ Set ${key} environment variable`);
      } catch (error) {
        console.error(`❌ Failed to set ${key} environment variable`);
      }
    }
  }
  
  // Deploy to Netlify
  console.log('Deploying to Netlify...');
  try {
    execSync('netlify deploy --prod', { stdio: 'inherit' });
    console.log('✅ Deployment successful!');
  } catch (error) {
    console.error('❌ Deployment failed');
    process.exit(1);
  }
}
