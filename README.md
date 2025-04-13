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

## Deployment to Vercel

### Option 1: Deploy with Vercel CLI

1. Install the Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy the site:
   ```bash
   vercel
   ```

4. Follow the prompts to set up your project. When asked about environment variables, add:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
   - SUPABASE_URL
   - SUPABASE_SERVICE_ROLE_KEY

5. For production deployment:
   ```bash
   vercel --prod
   ```

### Option 2: Deploy via Vercel UI

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket).

2. Log in to [Vercel](https://vercel.com/).

3. Click "New Project" and import your repository.

4. Vercel will automatically detect that it's a Next.js project and configure the build settings.

5. Add the required environment variables in the project settings:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
   - SUPABASE_URL
   - SUPABASE_SERVICE_ROLE_KEY

6. Click "Deploy" and Vercel will build and deploy your site.

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
