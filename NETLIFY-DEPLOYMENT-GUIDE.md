# Netlify Deployment Guide for An Jia Website

This guide provides step-by-step instructions for deploying the An Jia Website to Netlify.

## Prerequisites

- A [Netlify account](https://app.netlify.com/signup)
- A [Supabase account](https://supabase.com/) with a project set up
- Node.js installed on your local machine

## Option 1: Automated Deployment (Recommended)

We've created a deployment script that automates most of the process.

1. Make sure you have the Netlify CLI installed:
   ```bash
   npm install -g netlify-cli
   ```

2. Run the deployment script:
   ```bash
   npm run netlify:deploy
   ```

3. Follow the prompts to:
   - Log in to Netlify (if not already logged in)
   - Enter your Supabase credentials
   - Initialize a new Netlify site or connect to an existing one

4. The script will:
   - Set up all required environment variables
   - Deploy your site to Netlify
   - Provide a URL for your deployed site

## Option 2: Manual Deployment

### Step 1: Set up Supabase

1. Create a new Supabase project or use an existing one
2. Note down the following credentials:
   - Supabase URL
   - Supabase Anon Key
   - Supabase Service Role Key

### Step 2: Deploy to Netlify

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Log in to [Netlify](https://app.netlify.com/)
3. Click "New site from Git" and select your repository
4. Configure the build settings:
   - Build command: `npm run netlify:build`
   - Publish directory: `.next`
5. Click "Show advanced" and add the following environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase Anon Key
   - `SUPABASE_URL`: Your Supabase URL (same as above)
   - `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase Service Role Key
6. Click "Deploy site"

### Step 3: Configure Netlify Settings

After deployment, you may want to configure additional settings:

1. **Custom Domain**: Go to "Domain settings" to set up a custom domain
2. **HTTPS**: Netlify automatically provisions SSL certificates
3. **Form Handling**: If your site uses forms, configure them in the "Forms" section
4. **Functions**: If you need serverless functions, set them up in the "Functions" section

## Troubleshooting

### Common Issues

1. **Build Failures**:
   - Check the build logs for specific errors
   - Ensure all environment variables are correctly set
   - Verify that the build command is correct

2. **API Routes Not Working**:
   - Check that the Netlify redirects are correctly configured in `netlify.toml`
   - Verify that the API routes are compatible with Netlify's serverless functions

3. **Supabase Connection Issues**:
   - Confirm that all Supabase environment variables are correctly set
   - Check that your Supabase project is active and accessible
   - Verify that your IP is not blocked by Supabase's security settings

### Getting Help

If you encounter issues not covered in this guide:

1. Check the [Netlify documentation](https://docs.netlify.com/)
2. Visit the [Supabase documentation](https://supabase.com/docs)
3. Search for solutions on [Stack Overflow](https://stackoverflow.com/)
4. Join the [Netlify Community](https://community.netlify.com/) for support

## Maintenance

After deployment, remember to:

1. Regularly update your dependencies
2. Monitor your Netlify build minutes and bandwidth usage
3. Keep your Supabase database backed up
4. Set up monitoring for your production site

## Security Considerations

1. Never commit your `.env` file to version control
2. Use environment variables for all sensitive information
3. Regularly rotate your Supabase keys
4. Set up proper authentication and authorization in your application
5. Configure Content Security Policy headers in `netlify.toml`
