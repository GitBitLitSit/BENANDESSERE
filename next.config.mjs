import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

// Check if we are running the build for production (GitHub Actions)
const isProd = process.env.NODE_ENV === 'production';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  
  // Set the basePath only in production. 
  // IMPORTANT: Replace 'your-repo-name' with your actual GitHub repository name!
  basePath: isProd ? '/BENANDESSERE' : '',
  
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default withNextIntl(nextConfig)