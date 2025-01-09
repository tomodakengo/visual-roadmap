/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: process.env.GITHUB_ACTIONS ? '/visual-roadmap' : '',
  assetPrefix: process.env.GITHUB_ACTIONS ? '/visual-roadmap/' : '',
}

module.exports = nextConfig 