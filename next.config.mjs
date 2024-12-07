/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // Enable if you're using static assets
  images: {
    domains: ['api.dicebear.com'], // Add other domains as needed
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
