/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  serverExternalPackages: ['mongoose'],
  
  // Configure Turbopack
  experimental: {
    turbo: {
      resolveAlias: {
        // Add any aliases needed for Turbopack
      },
      // Apply the same webpack fallbacks to Turbopack
      rules: {
        // Configure rules as an object, not an array
        resolveModules: {
          test: /node_modules/,
          type: 'resolve'
        }
      }
    },
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
