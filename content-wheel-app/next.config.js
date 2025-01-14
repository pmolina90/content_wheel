/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // This ensures you're exporting to static HTML
  trailingSlash: true, // Ensures URLs end with a slash for proper static serving
  assetPrefix: '/content_wheel', // Ensures static assets are linked correctly
  basePath: '/content_wheel', // The base path for GitHub Pages (repo name)
  images: {
    unoptimized: true, // Necessary for static hosting
  },
  reactStrictMode: true,
};

module.exports = nextConfig;
