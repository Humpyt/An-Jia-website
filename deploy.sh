#!/bin/bash

# An Jia Website Deployment Script
# This script deploys the An Jia website to Vercel

# Colors for console output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Function to print section headers
print_section() {
  echo -e "\n${CYAN}======================================${NC}"
  echo -e "${CYAN}  $1${NC}"
  echo -e "${CYAN}======================================${NC}\n"
}

# Function to print success messages
print_success() {
  echo -e "${GREEN}✓ $1${NC}"
}

# Function to print error messages
print_error() {
  echo -e "${RED}✗ $1${NC}"
}

# Function to print info messages
print_info() {
  echo -e "${BLUE}ℹ $1${NC}"
}

# Function to print warning messages
print_warning() {
  echo -e "${YELLOW}⚠ $1${NC}"
}

# Check if Vercel CLI is installed
check_vercel_cli() {
  print_info "Checking if Vercel CLI is installed..."
  if ! command -v vercel &> /dev/null; then
    print_error "Vercel CLI is not installed."
    print_info "Please install it with: npm install -g vercel"
    exit 1
  fi
  print_success "Vercel CLI is installed."
}

# Check if user is logged in to Vercel
check_vercel_login() {
  print_info "Checking if you're logged in to Vercel..."
  if ! vercel whoami &> /dev/null; then
    print_error "You're not logged in to Vercel."
    print_info "Please login with: vercel login"
    exit 1
  fi
  print_success "You're logged in to Vercel."
}

# Build the project
build_project() {
  print_section "Building the project"
  print_info "Running build command..."
  if npm run build; then
    print_success "Build completed successfully."
  else
    print_error "Build failed."
    exit 1
  fi
}

# Deploy to Vercel
deploy_to_vercel() {
  print_section "Deploying to Vercel"
  print_info "Running deployment command..."
  
  # Ask if user wants to deploy to production
  read -p "Deploy to production? (y/n): " deploy_prod
  
  if [[ $deploy_prod == "y" || $deploy_prod == "Y" ]]; then
    print_info "Deploying to production..."
    if vercel --prod; then
      print_success "Deployment to production completed successfully."
    else
      print_error "Deployment to production failed."
      exit 1
    fi
  else
    print_info "Deploying to preview environment..."
    if vercel; then
      print_success "Deployment to preview environment completed successfully."
    else
      print_error "Deployment to preview environment failed."
      exit 1
    fi
  fi
}

# Verify deployment
verify_deployment() {
  print_section "Verifying deployment"
  print_info "Please verify that the properties page is working correctly:"
  echo "1. Visit https://ajyxn.com/properties"
  echo "2. Check that property data is loading correctly"
  echo "3. Open the browser console (F12) and look for any errors"
  echo "4. Test the property filters and pagination"
}

# Main function
main() {
  print_section "An Jia Website Deployment"
  
  # Check prerequisites
  check_vercel_cli
  check_vercel_login
  
  # Build and deploy
  build_project
  deploy_to_vercel
  
  # Verify deployment
  verify_deployment
  
  print_section "Deployment Complete"
  print_success "The An Jia website has been deployed to Vercel."
  print_info "If you encounter any issues, please check the troubleshooting section in DEPLOYMENT-INSTRUCTIONS.md"
}

# Run the main function
main
