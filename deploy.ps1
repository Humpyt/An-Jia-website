# An Jia Website Deployment Script for Windows
# This script deploys the An Jia website to Vercel

# Function to print section headers
function Print-Section {
    param([string]$Title)
    Write-Host "`n======================================"
    Write-Host "  $Title"
    Write-Host "======================================`n"
}

# Function to print success messages
function Print-Success {
    param([string]$Message)
    Write-Host "✓ $Message" -ForegroundColor Green
}

# Function to print error messages
function Print-Error {
    param([string]$Message)
    Write-Host "✗ $Message" -ForegroundColor Red
}

# Function to print info messages
function Print-Info {
    param([string]$Message)
    Write-Host "ℹ $Message" -ForegroundColor Blue
}

# Function to print warning messages
function Print-Warning {
    param([string]$Message)
    Write-Host "⚠ $Message" -ForegroundColor Yellow
}

# Check if Vercel CLI is installed
function Check-VercelCLI {
    Print-Info "Checking if Vercel CLI is installed..."
    try {
        $vercelVersion = vercel --version
        Print-Success "Vercel CLI is installed: $vercelVersion"
        return $true
    } catch {
        Print-Error "Vercel CLI is not installed."
        Print-Info "Please install it with: npm install -g vercel"
        return $false
    }
}

# Check if user is logged in to Vercel
function Check-VercelLogin {
    Print-Info "Checking if you're logged in to Vercel..."
    try {
        $vercelUser = vercel whoami
        Print-Success "You're logged in to Vercel as: $vercelUser"
        return $true
    } catch {
        Print-Error "You're not logged in to Vercel."
        Print-Info "Please login with: vercel login"
        return $false
    }
}

# Build the project
function Build-Project {
    Print-Section "Building the project"
    Print-Info "Running build command..."
    try {
        npm run build
        Print-Success "Build completed successfully."
        return $true
    } catch {
        Print-Error "Build failed."
        return $false
    }
}

# Deploy to Vercel
function Deploy-ToVercel {
    Print-Section "Deploying to Vercel"
    Print-Info "Running deployment command..."
    
    # Ask if user wants to deploy to production
    $deployProd = Read-Host "Deploy to production? (y/n)"
    
    if ($deployProd -eq "y" -or $deployProd -eq "Y") {
        Print-Info "Deploying to production..."
        try {
            vercel --prod
            Print-Success "Deployment to production completed successfully."
            return $true
        } catch {
            Print-Error "Deployment to production failed."
            return $false
        }
    } else {
        Print-Info "Deploying to preview environment..."
        try {
            vercel
            Print-Success "Deployment to preview environment completed successfully."
            return $true
        } catch {
            Print-Error "Deployment to preview environment failed."
            return $false
        }
    }
}

# Verify deployment
function Verify-Deployment {
    Print-Section "Verifying deployment"
    Print-Info "Please verify that the properties page is working correctly:"
    Write-Host "1. Visit https://ajyxn.com/properties"
    Write-Host "2. Check that property data is loading correctly"
    Write-Host "3. Open the browser console (F12) and look for any errors"
    Write-Host "4. Test the property filters and pagination"
}

# Main function
function Main {
    Print-Section "An Jia Website Deployment"
    
    # Check prerequisites
    $vercelCliInstalled = Check-VercelCLI
    if (-not $vercelCliInstalled) {
        exit 1
    }
    
    $vercelLoggedIn = Check-VercelLogin
    if (-not $vercelLoggedIn) {
        exit 1
    }
    
    # Build and deploy
    $buildSuccess = Build-Project
    if (-not $buildSuccess) {
        exit 1
    }
    
    $deploySuccess = Deploy-ToVercel
    if (-not $deploySuccess) {
        exit 1
    }
    
    # Verify deployment
    Verify-Deployment
    
    Print-Section "Deployment Complete"
    Print-Success "The An Jia website has been deployed to Vercel."
    Print-Info "If you encounter any issues, please check the troubleshooting section in DEPLOYMENT-INSTRUCTIONS.md"
}

# Run the main function
Main
