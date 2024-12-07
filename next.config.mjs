/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // Enable if you're using static assets
  images: {
    domains: ['api.dicebear.com'], // Add other domains as needed
  }
};

export default nextConfig;
