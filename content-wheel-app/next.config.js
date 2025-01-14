/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Enables static file export
  trailingSlash: true, // Required for static hosting
  basePath: '', // Leave empty for local testing, set for GitHub Pages later
  images: {
    unoptimized: true, // Required for static hosting
  },
};

module.exports = nextConfig;

