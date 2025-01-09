/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/visual-roadmap',
  assetPrefix: '/visual-roadmap/',
}

module.exports = nextConfig 