# Namecheap and Vercel Deployment Guide for An Jia Website

This guide provides step-by-step instructions for deploying the An Jia Website to Vercel and setting up a custom domain with Namecheap.

## Prerequisites

- A [Vercel account](https://vercel.com/signup)
- A [Namecheap account](https://www.namecheap.com/)
- Node.js installed on your local machine

## Deployment Process Overview

1. Prepare your website for deployment
2. Deploy to Vercel
3. Purchase and configure a domain on Namecheap
4. Connect your Namecheap domain to Vercel

## Step 1: Prepare Your Website for Deployment

Before deploying, make sure your website is ready for production:

1. Update your environment variables in `.env.local`:
   ```
   NEXT_PUBLIC_WORDPRESS_API_URL=https://your-wordpress-api-production-url.com/wp-json
   WORDPRESS_API_URL=https://your-wordpress-api-production-url.com/wp-json
   WORDPRESS_FALLBACK_API_URL=https://your-wordpress-api-production-url.com/wp-json
   ```

2. Run the optimization scripts:
   ```bash
   npm run optimize:all
   ```

3. Test your website locally:
   ```bash
   npm run build
   npm run start
   ```

## Step 2: Deploy to Vercel

### Option 1: Using the Vercel CLI (Recommended)

1. Install the Vercel CLI if you haven't already:
   ```bash
   npm install -g vercel
   ```

2. Run the deployment script:
   ```bash
   npm run vercel:deploy
   ```

3. Follow the prompts to complete the deployment.

### Option 2: Manual Deployment via Vercel Dashboard

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Log in to [Vercel](https://vercel.com/)
3. Click "New Project" and import your repository
4. Configure the build settings:
   - Framework Preset: Next.js
   - Build Command: `npm run vercel:build`
   - Output Directory: `.next`
5. Add the following environment variables:
   - `NEXT_PUBLIC_WORDPRESS_API_URL`: Your WordPress API URL
   - `WORDPRESS_API_URL`: Your WordPress API URL
   - `WORDPRESS_FALLBACK_API_URL`: Your WordPress API URL
6. Click "Deploy"

## Step 3: Purchase a Domain on Namecheap

1. Go to [Namecheap](https://www.namecheap.com/)
2. Search for your desired domain name
3. Add the domain to your cart and complete the purchase
4. Access your domain from the Namecheap dashboard

## Step 4: Configure DNS Settings on Namecheap

### Method 1: Using Namecheap Nameservers with Vercel DNS

1. In your Vercel project, go to "Settings" > "Domains"
2. Add your custom domain (e.g., `anjia.com`)
3. Vercel will provide you with nameserver addresses (e.g., `ns1.vercel-dns.com`, `ns2.vercel-dns.com`)
4. In your Namecheap dashboard, go to "Domain List" and click "Manage" next to your domain
5. Go to the "Domain" tab and select "Custom DNS" under "Nameservers"
6. Enter the nameservers provided by Vercel
7. Save your changes

### Method 2: Using Namecheap DNS with Vercel Records

1. In your Vercel project, go to "Settings" > "Domains"
2. Add your custom domain (e.g., `anjia.com`)
3. Vercel will provide you with verification records
4. In your Namecheap dashboard, go to "Domain List" and click "Manage" next to your domain
5. Go to the "Advanced DNS" tab
6. Add the following records:

   **For the apex domain (anjia.com):**
   - Type: A
   - Host: @
   - Value: 76.76.21.21
   - TTL: Automatic

   **For the www subdomain (www.anjia.com):**
   - Type: CNAME
   - Host: www
   - Value: cname.vercel-dns.com
   - TTL: Automatic

   **For the verification record (if provided by Vercel):**
   - Type: TXT
   - Host: @
   - Value: [verification value provided by Vercel]
   - TTL: Automatic

7. Save your changes

## Step 5: Verify Domain and Set Up SSL

1. In your Vercel project, go to "Settings" > "Domains"
2. Wait for the domain verification to complete (this may take up to 24 hours)
3. Vercel will automatically provision an SSL certificate for your domain

## Troubleshooting

### DNS Propagation Issues

DNS changes can take up to 48 hours to propagate globally. If your domain is not working immediately:

1. Check the DNS propagation status using [whatsmydns.net](https://www.whatsmydns.net/)
2. Verify that your DNS records are correctly set up in Namecheap
3. Check the domain status in your Vercel dashboard

### SSL Certificate Issues

If you're having issues with SSL:

1. In Vercel, go to "Settings" > "Domains"
2. Check the SSL certificate status
3. If needed, click "Refresh" next to the SSL certificate
4. Ensure your DNS records are correctly configured

### Redirect Issues

To set up redirects (e.g., from non-www to www or vice versa):

1. In Vercel, go to "Settings" > "Domains"
2. Click on the domain you want to redirect
3. Select "Redirect to" and choose your preferred domain format

## Maintenance

After deployment, remember to:

1. Regularly update your dependencies
2. Monitor your Vercel usage and limits
3. Keep your WordPress API secure and up-to-date
4. Set up monitoring for your production site

## Security Considerations

1. Never commit your `.env` file to version control
2. Use environment variables for all sensitive information
3. Configure Content Security Policy headers in `vercel.json`
4. Regularly update your dependencies to patch security vulnerabilities
