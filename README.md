# An Jia You Xuan - Real Estate Website

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://ajyxn.com)
[![WordPress Backend](https://img.shields.io/badge/Backend-WordPress-blue?style=for-the-badge&logo=wordpress)](https://wp.ajyxn.com)

A premium real estate website for showcasing properties in China, built with Next.js and WordPress.

## Live Deployment

- **Production Site**: [https://ajyxn.com](https://ajyxn.com)
- **WordPress Backend**: [https://wp.ajyxn.com](https://wp.ajyxn.com)
- **GitHub Repository**: [https://github.com/Humpyt/anjiaFrontend](https://github.com/Humpyt/anjiaFrontend)

## Current Application Architecture

### Overview
An Jia You Xuan is a modern real estate platform built with a headless CMS architecture:
- **Frontend**: Next.js 15 application with TypeScript and Tailwind CSS
- **Backend**: WordPress with custom post types and REST API
- **Deployment**: Vercel for frontend, managed WordPress hosting for backend
- **Caching**: Multi-level caching system for optimized performance

### System Architecture Diagram
```
┌─────────────────┐      ┌─────────────────┐
│                 │      │                 │
│  Next.js 15     │◄────►│  WordPress API  │
│  Frontend       │      │  Backend        │
│  (Vercel)       │      │  (wp.ajyxn.com) │
│                 │      │                 │
└─────────────────┘      └─────────────────┘
        ▲                        ▲
        │                        │
        ▼                        ▼
┌─────────────────┐      ┌─────────────────┐
│                 │      │                 │
│  Client         │      │  Admin          │
│  Browser        │      │  Dashboard      │
│                 │      │                 │
└─────────────────┘      └─────────────────┘
```

## Features

### Property Management
- Featured Properties Section (Premium listings)
- Latest Properties Section with sorting by date
- Property categories with animated buttons
- Detailed property information including:
  - Location and property details
  - Number of bedrooms and bathrooms
  - Price and payment information
  - Amenities (WiFi, Parking, Security, etc.)
  - Property gallery with multiple images
  - Detailed property descriptions

### Multilingual Support
- Complete multilingual support throughout the website
- Language switcher for English and Chinese
- Translated content for all UI elements and property information
- Consistent language experience across all pages

### Responsive Design
- Fully responsive design for all devices (mobile, tablet, desktop)
- Optimized image loading for different screen sizes
- Touch-friendly interface for mobile users
- Consistent experience across all devices

### User Interface
- Modern, clean design with professional aesthetics
- Streamlined navigation with intuitive menus
- Property search and filtering capabilities
- Error boundaries for improved reliability
- Loading states and fallbacks for better user experience
- Optimized for Chinese and international users

## Tech Stack

### Frontend
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom components based on Shadcn UI
- **State Management**: React Context API
- **Error Handling**: Custom Error Boundaries
- **Image Optimization**: Next.js Image component with automatic optimization

### Backend
- **CMS**: WordPress with REST API (HTTPS)
- **Custom Plugins**:
  - Custom Post Type UI
  - Advanced Custom Fields
  - WP REST API Controller
  - ACF to REST API
- **Security**: SSL/TLS encryption for API endpoints

## Development Environment

### Local Setup

1. **Frontend (Next.js)**:
   ```bash
   git clone https://github.com/Humpyt/anjiaFrontend.git
   cd anjiaFrontend
   npm install
   ```

2. **Environment Configuration**:
   ```bash
   # .env.local
   NEXT_PUBLIC_WORDPRESS_API_URL=https://wp.ajyxn.com/wp-json
   WORDPRESS_API_URL=https://wp.ajyxn.com/wp-json
   WORDPRESS_FALLBACK_API_URL=https://wp.ajyxn.com/wp-json
   ```

3. **Development Server**:
   ```bash
   npm run dev
   # Access at http://localhost:3000
   ```

### WordPress Backend

1. **WordPress Installation**:
   - Production domain: wp.ajyxn.com
   - HTTPS enabled with SSL certificate
   - WordPress 6.4+

2. **Required Plugins**:
   - Custom Post Type UI (v1.13.5+)
   - Advanced Custom Fields PRO (v6.2.0+)
   - WP REST API Controller (v2.0+)
   - ACF to REST API (v3.3.3+)

3. **Custom Post Types**:
   - `property`: Real estate properties
   - `neighborhood`: Location information
   - `agent`: Real estate agents

4. **Custom Fields Structure**:
   ```
   property
   ├── basic_info
   │   ├── location (text)
   │   ├── property_type (select)
   │   ├── bedrooms (number)
   │   ├── bathrooms (number)
   │   └── square_meters (number)
   ├── pricing
   │   ├── price (number)
   │   ├── currency (select)
   │   └── payment_terms (select)
   ├── features
   │   ├── amenities (checkbox)
   │   ├── floor (number)
   │   └── units (number)
   └── media
       ├── gallery_images (gallery)
       └── google_pin (text)
   ```

## API Integration

### WordPress REST API

- **Base URL**: `https://wp.ajyxn.com/wp-json/`
- **Endpoints**:
  - Properties List: `GET /wp/v2/property?per_page=12&offset=0`
  - Property Detail: `GET /wp/v2/property/{id}`
  - Property Search: `GET /wp/v2/property?search={term}`
  - Property Filter: `GET /wp/v2/property?meta_key=bedrooms&meta_value=3`

### WordPress REST API Configuration

To ensure the WordPress REST API is properly configured for property post types and custom fields:

1. **Install WP REST API Controller Plugin**:
   - This plugin provides fine-grained control over REST API endpoints
   - Enable the Property post type in the plugin settings
   - Configure which fields are exposed in the API

2. **Configure Custom Fields**:
   - Ensure all property custom fields are exposed in the REST API
   - Set appropriate permissions for GET requests
   - Test endpoints to verify data is accessible

3. **Add CORS Headers**:
   - Configure WordPress to allow cross-origin requests from the frontend domain
   - Add appropriate headers in the WordPress configuration
   - Test cross-origin requests to ensure they work properly

## Performance Optimizations

### Caching System

1. **API Cache**:
   - Caches WordPress API responses
   - Implemented in `lib/wordpress.js`
   - Reduces load on the WordPress backend

2. **Property Listings Cache**:
   - Caches transformed property listings
   - Improves performance for frequently accessed listings
   - Implemented with appropriate cache invalidation

3. **Property Details Cache**:
   - Caches individual property details
   - Reduces API calls for popular properties
   - Improves page load times for property details

4. **Next.js Cache**:
   - Built-in Next.js data cache
   - Configured with appropriate revalidation periods
   - Optimizes server-side rendering performance

### Image Optimization

1. **Next.js Image Component**:
   - Automatic image optimization
   - Responsive sizing based on device
   - WebP format support for modern browsers
   - Lazy loading for improved performance

2. **Fallback Images**:
   - Robust fallback system for missing images
   - Prevents layout shifts during loading
   - Ensures consistent user experience

## Error Handling

### Client-Side Error Boundaries

- **Implementation**: React Error Boundary component
- **Location**: `components/error-boundary.tsx`
- **Features**:
  - Graceful error recovery
  - User-friendly error messages
  - Refresh and navigation options

### API Error Handling

- **Timeout Handling**: Configurable timeouts for external API calls
- **Fallback Mechanisms**: Default content when API requests fail
- **Retry Logic**: Automatic retry for transient errors
- **Resilient Image Component**: Custom component that handles image loading failures

## Code Quality

1. **TypeScript Integration**:
   - Strong typing throughout the application
   - Interface definitions for all data structures
   - Type safety for API responses

2. **Code Splitting**:
   - Automatic code splitting with Next.js
   - Dynamic imports for large components
   - Reduced initial bundle size

3. **Server-Side Rendering**:
   - Critical paths rendered on server
   - Client-side hydration for interactivity
   - Improved SEO and initial load performance

4. **Progressive Enhancement**:
   - Core functionality works without JavaScript
   - Enhanced experience with JavaScript enabled
   - Accessible to all users

## Deployment

### Current Deployment

The An Jia website is currently deployed on Vercel with the following configuration:

1. **Production Domain**:
   - Main site: [https://ajyxn.com](https://ajyxn.com)
   - WordPress backend: [https://wp.ajyxn.com](https://wp.ajyxn.com)

2. **Deployment Platform**:
   - Frontend: Vercel (continuous deployment from GitHub)
   - Backend: Managed WordPress hosting with HTTPS

3. **Environment Variables**:
   - `NEXT_PUBLIC_WORDPRESS_API_URL`: https://wp.ajyxn.com/wp-json
   - `WORDPRESS_API_URL`: https://wp.ajyxn.com/wp-json
   - `WORDPRESS_FALLBACK_API_URL`: https://wp.ajyxn.com/wp-json

### Deployment Process

To deploy updates to the An Jia website:

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Description of changes"
   git push origin main
   ```

2. **Manual Deployment via Vercel CLI**:
   ```bash
   # Deploy to production
   vercel --prod
   ```

3. **Vercel Dashboard**:
   - Monitor deployments at [https://vercel.com/dashboard](https://vercel.com/dashboard)
   - View deployment logs and analytics
   - Manage environment variables and domains

### WordPress Configuration

The WordPress backend is configured with:

1. **HTTPS Support**:
   - SSL certificate for secure API communication
   - Proper CORS headers for cross-origin requests

2. **REST API Configuration**:
   - WP REST API Controller plugin for fine-grained API control
   - Custom fields exposed through the REST API
   - Appropriate permissions for public access to property data

3. **Security Measures**:
   - Limited login attempts
   - Security headers
   - Regular updates and backups

## License

[MIT](LICENSE)
