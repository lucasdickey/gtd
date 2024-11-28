/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'aok-projects-images.s3.us-east-2.amazonaws.com',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/cmb',
        destination: '/chilled-monkey-brains',
        permanent: true,
      },
    ]
  },
  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|png)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
