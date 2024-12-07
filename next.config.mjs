/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // Enable if you're using static assets
  images: {
    domains: ['api.dicebear.com'], // Add other domains as needed
  },
  eslint: {
    // Disable ESLint during production builds
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: true,
  },
  // Increase build performance
  swcMinify: true,
  // Reduce the size of the build output
  compress: true,
  poweredByHeader: false,
  // Add this configuration for dynamic API routes
  experimental: {
    serverActions: true,
  },
  // Configure which routes should be static/dynamic
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,DELETE,PATCH,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
        ],
      },
    ]
  },
  // Mark API routes as dynamic
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ]
  }
};

export default nextConfig;
