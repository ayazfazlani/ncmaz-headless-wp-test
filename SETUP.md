# Local Development Setup Guide

This guide will help you set up and run the WordPress Next.js project locally.

## Prerequisites

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **WordPress site** with WPGraphQL plugin installed and activated
- **npm** or **yarn** package manager

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Configure Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# WordPress Backend URL (required)
NEXT_PUBLIC_WORDPRESS_URL=http://localhost:8080

# Faust.js Secret Key (required)
# Get this from your WordPress site: Settings > Headless > Secret Key
FAUST_SECRET_KEY=your-secret-key-here

# Optional: API Method (defaults to "GET" if not set)
NEXT_PUBLIC_SITE_API_METHOD=GET

# Optional: Site Direction (ltr or rtl)
NEXT_PUBLIC_SITE_DIRECTION=ltr

# Optional: Enable/Disable Demo Site Features
NEXT_PUBLIC_IS_CHISNGHIAX_DEMO_SITE=false

# Optional: Site URL
NEXT_PUBLIC_URL=http://localhost:3000

# Optional: Image Remote Hostnames
NEXT_PUBLIC_IMAGE_REMOTE_HOSTNAME_1=1.gravatar.com
NEXT_PUBLIC_IMAGE_REMOTE_HOSTNAME_2=1.gravatar.com

# Optional: Enable Gear Icon
NEXT_PUBLIC_SITE_GEAR_ICON=false
```

### Getting Your Faust Secret Key

1. Log into your WordPress admin panel
2. Go to **Settings > Headless**
3. Copy the **Secret Key** value
4. Paste it into your `.env.local` file as `FAUST_SECRET_KEY`

## Step 3: WordPress Setup

Make sure your WordPress site has:

1. **WPGraphQL plugin** installed and activated
   - Download from: https://www.wpgraphql.com/
   - Or install via WordPress admin: Plugins > Add New > Search "WPGraphQL"

2. **Faust.js plugin** (if using authentication)
   - This is typically included with WP Engine's Atlas platform
   - Or install the Faust.js WordPress plugin

3. **GraphQL endpoint** accessible at: `YOUR_WORDPRESS_URL/graphql`

## Step 4: Generate GraphQL Types

Before running the dev server, generate the GraphQL types:

```bash
npm run generate
```

This will:
- Generate possible types from your WordPress GraphQL schema
- Create TypeScript types for your GraphQL queries

## Step 5: Run Development Server

Start the development server:

```bash
npm run dev
```

This command will:
- Generate possible types
- Start the Next.js dev server (usually on http://localhost:3000)
- Start the GraphQL codegen in watch mode

### Available Scripts

- `npm run dev` - Start development server with codegen watch mode
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run generate` - Generate GraphQL possible types
- `npm run codegen` - Run GraphQL codegen once
- `npm run watch-codegen` - Run GraphQL codegen in watch mode
- `npm run tsc` - Run TypeScript compiler

## Troubleshooting

### GraphQL Codegen Errors

If you see errors about missing `@parcel/watcher`:
```bash
npm install --save-dev @parcel/watcher
```

### Connection Issues

- Verify your `NEXT_PUBLIC_WORDPRESS_URL` is correct and accessible
- Check that WPGraphQL is installed and activated on your WordPress site
- Ensure CORS is properly configured on your WordPress site
- Test the GraphQL endpoint: `YOUR_WORDPRESS_URL/graphql`

### Port Already in Use

If port 3000 is already in use, Next.js will automatically use the next available port (3001, 3002, etc.)

### Faust Dev Command Exits Immediately

If `faust dev` exits with code 0 immediately without starting the server, try using the alternative dev script:

```bash
npm run dev:next
```

This uses `next dev` directly instead of the Faust CLI wrapper. Make sure your `.env.local` file has the required environment variables set.

## Project Structure

- `src/` - Source code
  - `pages/` - Next.js pages
  - `components/` - React components
  - `fragments/` - GraphQL query fragments
  - `__generated__/` - Auto-generated GraphQL types
- `public/` - Static assets
- `faust.config.js` - Faust.js configuration
- `codegen.ts` - GraphQL codegen configuration
- `site-settings.json` - Site configuration

## Additional Resources

- [Faust.js Documentation](https://faustjs.org)
- [WPGraphQL Documentation](https://www.wpgraphql.com)
- [Next.js Documentation](https://nextjs.org/docs)

