/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  serverExternalPackages: ['mongoose'],
  
  // Disable ESLint during build
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Disable TypeScript type checking during build
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Configure React to suppress hydration warnings
  reactStrictMode: true,
  
  // Suppress hydration warnings from browser extensions
  onDemandEntries: {
    // Period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,
    // Number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 2,
  },
  
  webpack: (config) => {
    // Add support for native node modules
    config.resolve.fallback = { 
      fs: false,
      net: false,
      tls: false,
      dns: false
    };
    
    return config;
  }
};

module.exports = nextConfig;
