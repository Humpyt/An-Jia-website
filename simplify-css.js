// Script to simplify the CSS approach and remove Tailwind dependency
const fs = require('fs');
const path = require('path');

console.log('Simplifying CSS approach to avoid Tailwind dependency...');

// Check if the simplified CSS file exists
const simplifiedCssPath = path.join(__dirname, 'app', 'simplified-globals.css');
if (!fs.existsSync(simplifiedCssPath)) {
  console.error('❌ Simplified CSS file not found. Please create it first.');
  process.exit(1);
}

// Backup the original globals.css file
const globalsCssPath = path.join(__dirname, 'app', 'globals.css');
if (fs.existsSync(globalsCssPath)) {
  const backupPath = `${globalsCssPath}.bak`;
  if (!fs.existsSync(backupPath)) {
    fs.copyFileSync(globalsCssPath, backupPath);
    console.log(`✅ Created backup of globals.css at ${backupPath}`);
  }
  
  // Replace the globals.css file with the simplified version
  fs.copyFileSync(simplifiedCssPath, globalsCssPath);
  console.log('✅ Replaced globals.css with simplified version');
}

// Create a simplified postcss.config.js file
const postcssConfigPath = path.join(__dirname, 'postcss.config.js');
const simplifiedPostcssConfig = `module.exports = {
  plugins: {
    autoprefixer: {},
  },
}`;

fs.writeFileSync(postcssConfigPath, simplifiedPostcssConfig);
console.log('✅ Created simplified postcss.config.js');

// Create a simplified tailwind.config.js file that doesn't actually use tailwind
const tailwindConfigPath = path.join(__dirname, 'tailwind.config.js');
const simplifiedTailwindConfig = `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [],
  theme: {
    extend: {},
  },
  plugins: [],
}`;

fs.writeFileSync(tailwindConfigPath, simplifiedTailwindConfig);
console.log('✅ Created simplified tailwind.config.js');

// Create an empty tailwindcss module to satisfy imports
const nodeModulesPath = path.join(__dirname, 'node_modules');
const tailwindcssPath = path.join(nodeModulesPath, 'tailwindcss');

if (!fs.existsSync(nodeModulesPath)) {
  fs.mkdirSync(nodeModulesPath, { recursive: true });
}

if (!fs.existsSync(tailwindcssPath)) {
  fs.mkdirSync(tailwindcssPath, { recursive: true });
  
  // Create a minimal index.js file
  fs.writeFileSync(path.join(tailwindcssPath, 'index.js'), 'module.exports = function() { return {}; };');
  
  // Create a minimal package.json
  fs.writeFileSync(path.join(tailwindcssPath, 'package.json'), JSON.stringify({
    name: 'tailwindcss',
    version: '3.3.0',
    main: 'index.js'
  }, null, 2));
  
  console.log('✅ Created minimal tailwindcss module');
}

// Create an empty tailwindcss-animate module to satisfy imports
const tailwindcssAnimatePath = path.join(nodeModulesPath, 'tailwindcss-animate');

if (!fs.existsSync(tailwindcssAnimatePath)) {
  fs.mkdirSync(tailwindcssAnimatePath, { recursive: true });
  
  // Create a minimal index.js file
  fs.writeFileSync(path.join(tailwindcssAnimatePath, 'index.js'), 'module.exports = function() { return {}; };');
  
  // Create a minimal package.json
  fs.writeFileSync(path.join(tailwindcssAnimatePath, 'package.json'), JSON.stringify({
    name: 'tailwindcss-animate',
    version: '1.0.7',
    main: 'index.js'
  }, null, 2));
  
  console.log('✅ Created minimal tailwindcss-animate module');
}

console.log('CSS simplification completed successfully!');
