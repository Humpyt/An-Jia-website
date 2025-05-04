# WordPress API Setup Guide

This guide provides instructions for setting up the WordPress API for the An Jia website, specifically focusing on fixing the neighborhood endpoint issue.

## Current Issue

The WordPress API is accessible at `http://anjia-wordpress.local/wp-json`, but the neighborhood endpoint (`/wp/v2/neighborhood`) is not available. This suggests that the custom post type for neighborhoods might not be properly registered or exposed in the WordPress REST API.

## Solution Steps

### 1. Check WordPress Custom Post Type Registration

1. Log in to the WordPress admin panel at `http://anjia-wordpress.local/wp-admin`
2. Go to "Custom Post Type UI" plugin (if installed)
3. Check if the "neighborhood" post type is registered
4. Make sure it has "Show in REST API" set to "True"
5. Verify the REST API base is set to "neighborhood"

If the Custom Post Type UI plugin is not installed:

1. Install and activate the plugin from the WordPress plugin directory
2. Create a new post type with the following settings:
   - Post Type Slug: `neighborhood`
   - Plural Label: `Neighborhoods`
   - Show in REST API: `True`
   - REST API base slug: `neighborhood`
   - Supports: `Title`, `Editor`, `Featured Image`, `Custom Fields`

### 2. Check Advanced Custom Fields (ACF) Setup

1. Go to "Custom Fields" in the WordPress admin
2. Verify that fields for neighborhoods exist (safety_rating, average_price, etc.)
3. Make sure ACF to REST API plugin is installed and activated
4. Check that the fields are assigned to the neighborhood post type

### 3. Create Test Neighborhood Content

1. Go to "Neighborhoods" in the WordPress admin
2. Create a test neighborhood with:
   - Title: "Test Neighborhood"
   - Content: Basic description
   - Featured Image: Upload an image
   - Custom Fields: Fill in safety rating, average price, etc.
3. Publish the neighborhood

### 4. Test the API Endpoint

Use the following URL to test if the neighborhood endpoint is working:
```
http://anjia-wordpress.local/wp-json/wp/v2/neighborhood
```

If it returns a 404 error, try:
```
http://anjia-wordpress.local/wp-json/wp/v2/posts?type=neighborhood
```

### 5. Check WordPress Permalinks

1. Go to Settings > Permalinks
2. Select a different permalink structure (e.g., Post name)
3. Save changes
4. Test the API endpoint again

### 6. Temporary Solution

Until the WordPress API issue is fixed, the website is using static data for the neighborhoods page. To revert to using the API:

1. Open `app/neighborhoods/page.tsx`
2. Uncomment the import for `getNeighborhoods`
3. Comment out the static data section
4. Uncomment the API call in the component

## WordPress Plugin Requirements

Make sure the following plugins are installed and activated:

1. **Custom Post Type UI** - For creating and managing custom post types
2. **Advanced Custom Fields PRO** - For adding custom fields to post types
3. **ACF to REST API** - For exposing ACF fields in the REST API
4. **WP REST API Cache** - For caching API responses

## Testing WordPress API Connection

You can use the provided test script to check the WordPress API connection:

```bash
node scripts/test-wp-connection.js
```

This script will test various WordPress API URLs and endpoints to help diagnose connection issues.

## Environment Configuration

Make sure your `.env.local` file has the correct WordPress API URL:

```
NEXT_PUBLIC_WORDPRESS_API_URL=http://anjia-wordpress.local/wp-json
WORDPRESS_API_URL=http://anjia-wordpress.local/wp-json
WORDPRESS_FALLBACK_API_URL=http://localhost/anjia-wordpress/wp-json
```

## Additional Resources

- [WordPress REST API Handbook](https://developer.wordpress.org/rest-api/)
- [Custom Post Type UI Documentation](https://github.com/WebDevStudios/custom-post-type-ui/wiki)
- [Advanced Custom Fields Documentation](https://www.advancedcustomfields.com/resources/)
- [ACF to REST API Documentation](https://github.com/airesvsg/acf-to-rest-api)
