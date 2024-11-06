/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        // Adjust these values according to your image URL pattern
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
}

module.exports = nextConfig
