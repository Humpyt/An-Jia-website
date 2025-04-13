# An Jia You Xuan - Real Estate Website

A premium real estate website for showcasing properties in Kampala, Uganda.

## Features

- Property listings with detailed information
- Property search and filtering
- Agent profiles
- Neighborhood information
- Admin dashboard for property management
- Inquiry system
- Responsive design for all devices

## Tech Stack

- Next.js 15
- TypeScript
- Tailwind CSS
- Supabase (for database and authentication)
- Shadcn UI components

## Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/Humpyt/An-Gia-Website.git
   cd An-Gia-Website
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   SUPABASE_URL=your_supabase_url_here
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment to Netlify

### Option 1: Deploy with Netlify CLI

1. Install the Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

2. Login to Netlify:
   ```bash
   netlify login
   ```

3. Initialize a new Netlify site:
   ```bash
   netlify init
   ```

4. Set up environment variables:
   ```bash
   netlify env:set NEXT_PUBLIC_SUPABASE_URL your_supabase_url_here
   netlify env:set NEXT_PUBLIC_SUPABASE_ANON_KEY your_supabase_anon_key_here
   netlify env:set SUPABASE_URL your_supabase_url_here
   netlify env:set SUPABASE_SERVICE_ROLE_KEY your_supabase_service_role_key_here
   ```

5. Deploy the site:
   ```bash
   netlify deploy --prod
   ```

### Option 2: Deploy via Netlify UI

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket).

2. Log in to [Netlify](https://app.netlify.com/).

3. Click "New site from Git" and select your repository.

4. Configure the build settings:
   - Build command: `node netlify-build.js && npm run build`
   - Publish directory: `.next`

5. Add the required environment variables in the site settings:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
   - SUPABASE_URL
   - SUPABASE_SERVICE_ROLE_KEY

6. Deploy the site.

## Supabase Setup

This project uses Supabase for database and authentication. You'll need to set up the following tables in your Supabase project:

- properties
- property_images
- agents
- neighborhoods
- inquiries

Refer to the `lib/database.types.ts` file for the schema details.

## License

[MIT](LICENSE)
