# WordPress Production Setup Guide for An Jia Website

This guide provides instructions for setting up a production WordPress instance to serve as the API backend for the An Jia website.

## Overview

The An Jia website uses WordPress as a headless CMS, accessing content through the WordPress REST API. For production deployment, you'll need to:

1. Set up a WordPress instance on a hosting provider
2. Configure the necessary plugins and settings
3. Set up proper security measures
4. Connect your Next.js frontend to the WordPress API

## Step 1: Choose a WordPress Hosting Provider

Recommended options for WordPress hosting:

- **Managed WordPress Hosting**:
  - [WP Engine](https://wpengine.com/)
  - [Kinsta](https://kinsta.com/)
  - [Flywheel](https://getflywheel.com/)
  - [SiteGround](https://www.siteground.com/)

- **General Hosting with WordPress Support**:
  - [DigitalOcean](https://www.digitalocean.com/) (with WordPress 1-Click App)
  - [AWS Lightsail](https://aws.amazon.com/lightsail/)
  - [Linode](https://www.linode.com/)

Choose a provider based on your budget, technical expertise, and performance requirements.

## Step 2: Install and Configure WordPress

### 2.1 Basic WordPress Setup

1. Install WordPress on your chosen hosting provider
2. Complete the initial WordPress setup
3. Set up a secure admin username and password
4. Configure basic settings (site title, timezone, etc.)

### 2.2 Install Required Plugins

Install and activate the following plugins:

1. **Custom Post Type UI** - For creating and managing custom post types
   - Download from: [https://wordpress.org/plugins/custom-post-type-ui/](https://wordpress.org/plugins/custom-post-type-ui/)

2. **Advanced Custom Fields PRO** - For adding custom fields to post types
   - Purchase from: [https://www.advancedcustomfields.com/pro/](https://www.advancedcustomfields.com/pro/)

3. **ACF to REST API** - For exposing ACF fields in the REST API
   - Download from: [https://wordpress.org/plugins/acf-to-rest-api/](https://wordpress.org/plugins/acf-to-rest-api/)

4. **WP REST API Cache** - For caching API responses
   - Download from: [https://wordpress.org/plugins/wp-rest-api-cache/](https://wordpress.org/plugins/wp-rest-api-cache/)

5. **JWT Authentication for WP REST API** - For secure API authentication
   - Download from: [https://wordpress.org/plugins/jwt-authentication-for-wp-rest-api/](https://wordpress.org/plugins/jwt-authentication-for-wp-rest-api/)

6. **WP REST API Controller** - For fine-grained control over REST API endpoints
   - Download from: [https://wordpress.org/plugins/wp-rest-api-controller/](https://wordpress.org/plugins/wp-rest-api-controller/)

7. **Yoast SEO** - For SEO optimization
   - Download from: [https://wordpress.org/plugins/wordpress-seo/](https://wordpress.org/plugins/wordpress-seo/)

8. **Wordfence Security** - For WordPress security
   - Download from: [https://wordpress.org/plugins/wordfence/](https://wordpress.org/plugins/wordfence/)

### 2.3 Configure Custom Post Types

Using Custom Post Type UI, create the following post types:

1. **Properties**
   - Post Type Slug: `property`
   - Plural Label: `Properties`
   - Show in REST API: `True`
   - REST API base slug: `property`
   - Supports: `Title`, `Editor`, `Featured Image`, `Custom Fields`

2. **Neighborhoods**
   - Post Type Slug: `neighborhood`
   - Plural Label: `Neighborhoods`
   - Show in REST API: `True`
   - REST API base slug: `neighborhood`
   - Supports: `Title`, `Editor`, `Featured Image`, `Custom Fields`

### 2.4 Configure Advanced Custom Fields

Set up the following field groups in ACF:

1. **Property Fields**
   - Location: Post Type is equal to Property
   - Fields:
     - Price (Number)
     - Bedrooms (Number)
     - Bathrooms (Number)
     - Square Footage (Number)
     - Location (Text)
     - Property Type (Select)
     - Property Images (Gallery)
     - Features (Checkbox)
     - Description (Textarea)

2. **Neighborhood Fields**
   - Location: Post Type is equal to Neighborhood
   - Fields:
     - Safety Rating (Number)
     - Average Price (Number)
     - Neighborhood Image (Image)
     - Property Count (Number)
     - Description (Textarea)

### 2.5 Configure REST API Settings

1. In WP REST API Controller:
   - Enable all custom fields for the Property post type
   - Enable all custom fields for the Neighborhood post type
   - Set appropriate permissions for each endpoint

2. In JWT Authentication:
   - Configure the secret key
   - Set up the proper authentication headers

## Step 3: Security Configuration

### 3.1 Set Up SSL

Ensure your WordPress site uses HTTPS:

1. Install an SSL certificate on your hosting provider
2. Configure WordPress to use HTTPS
3. Update the site URL in WordPress settings

### 3.2 Configure CORS

Add the following to your theme's `functions.php` file or create a custom plugin:

```php
function add_cors_headers() {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
    header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method, Authorization");
    header("Access-Control-Allow-Credentials: true");
    header("Access-Control-Max-Age: 86400");
    
    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
        status_header(200);
        exit();
    }
}
add_action('init', 'add_cors_headers');
```

### 3.3 Secure the REST API

1. Limit access to sensitive endpoints
2. Implement rate limiting
3. Configure Wordfence to protect the REST API

## Step 4: Content Migration

1. Export content from your development WordPress instance
2. Import content to your production WordPress instance
3. Verify that all custom fields and media are correctly imported

## Step 5: Connect Next.js to Production WordPress

1. Update your `.env.local` file with the production WordPress API URL:
   ```
   NEXT_PUBLIC_WORDPRESS_API_URL=https://your-production-wordpress.com/wp-json
   WORDPRESS_API_URL=https://your-production-wordpress.com/wp-json
   WORDPRESS_FALLBACK_API_URL=https://your-production-wordpress.com/wp-json
   ```

2. Update `next.config.js` to use the production WordPress API URL for rewrites

3. Deploy your Next.js application to Vercel

## Step 6: Testing and Verification

1. Test all API endpoints using a tool like Postman
2. Verify that all custom fields are accessible via the API
3. Check that media URLs are correctly formatted and accessible
4. Test the connection between your Next.js frontend and WordPress backend

## Troubleshooting

### Common Issues

1. **CORS Errors**:
   - Verify CORS headers are correctly set
   - Check that your Next.js application is using the correct API URL

2. **Authentication Issues**:
   - Verify JWT Authentication is correctly configured
   - Check that your Next.js application is sending the correct authentication headers

3. **Missing Custom Fields**:
   - Ensure ACF to REST API plugin is active
   - Check that fields are enabled in WP REST API Controller

4. **Performance Issues**:
   - Implement caching for API responses
   - Consider using a CDN for media files

## Maintenance

1. Regularly update WordPress core, themes, and plugins
2. Monitor API performance and implement optimizations as needed
3. Back up your WordPress database and files regularly
4. Keep your SSL certificate up to date
