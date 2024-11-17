/** @type {import('next').NextConfig} */
const { withSitemap } = require('next-sitemap')

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'aok-projects-images.s3.us-east-2.amazonaws.com',
      },
    ],
  },
}

module.exports = withSitemap(nextConfig)
