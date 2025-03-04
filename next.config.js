/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  serverExternalPackages: ['mongoose'],
  
  // Disable ESLint during build
  eslint: {
    ignoreDuringBuilds: true,
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
