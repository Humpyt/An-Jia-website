# An Jia Website Deployment Instructions

This document provides instructions for deploying the An Jia website to Vercel, with a focus on fixing the properties page data fetching issue.

## Changes Made

We've made the following changes to fix the properties page data fetching issue:

1. **Updated Content Security Policy**: Modified the CSP in vercel.json to allow connections to the WordPress API domains (wp.ajyxn.com and 199.188.200.71).

2. **Created a CORS Proxy**: Added a new API endpoint at `/api/cors-proxy` that handles CORS issues when fetching from the WordPress API.

3. **Updated Client Properties Component**: Modified the client-properties.tsx component to use the new CORS proxy as the primary data source, with fallbacks to the existing API endpoints.

4. **Updated Property Service**: Updated the property-service.js file to use the CORS proxy for both the properties list and individual property details.

## Deployment Options

### Option 1: Deploy via Vercel CLI

If you have the Vercel CLI installed and configured, you can deploy directly from the command line:

```bash
# Login to Vercel if not already logged in
vercel login

# Deploy to production
vercel --prod
```

### Option 2: Deploy via GitHub Integration

If your repository is connected to Vercel through GitHub integration:

1. Commit the changes to your repository:
   ```bash
   git add .
   git commit -m "Fix properties page data fetching"
   git push origin main
   ```

2. Vercel will automatically deploy the changes.

### Option 3: Deploy via Vercel Web Interface

You can also deploy directly through the Vercel web interface:

1. Go to [vercel.com](https://vercel.com) and log in
2. Navigate to your project
3. Click on "Deployments" in the sidebar
4. Click "Deploy" button
5. Choose "Deploy from GitHub" or "Upload" option
6. Follow the prompts to complete the deployment

## Verifying the Deployment

After deployment, verify that the properties page is working correctly:

1. Visit https://ajyxn.com/properties
2. Check that property data is loading correctly
3. Open the browser console (F12) and look for any errors
4. Test the property filters and pagination

## Troubleshooting

If issues persist after deployment:

1. Check the Vercel deployment logs for any errors
2. Verify that the WordPress API is accessible at http://wp.ajyxn.com/wp-json
3. Check for CORS errors in the browser console
4. Ensure that the Content Security Policy in vercel.json is correctly configured

## Environment Variables

Make sure the following environment variables are set in your Vercel project:

- `NEXT_PUBLIC_WORDPRESS_API_URL`: Your WordPress API URL (e.g., http://wp.ajyxn.com/wp-json)
- `WORDPRESS_API_URL`: Same as above
- `WORDPRESS_FALLBACK_API_URL`: Fallback WordPress API URL (e.g., http://199.188.200.71/wp-json)
- `WORDPRESS_DIRECT_API_URL`: Direct WordPress API URL for server-side requests

## Contact

If you encounter any issues with the deployment, please contact the development team for assistance.
