/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Enables static file export
  trailingSlash: true, // Required for static hosting
  assetPrefix: '/content_wheel', 
  basePath: '/content_wheel', // Leave empty for local testing, set for GitHub Pages later
  images: {
    unoptimized: true, // Required for static hosting
  },
  reactStrictMode: true,
};

module.exports = nextConfig;

