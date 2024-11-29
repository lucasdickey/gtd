/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {},
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    }
    return config
  },
  images: {
    domains: [
      'apesonkeys.com',
      'aok-projects-images.s3.us-east-2.amazonaws.com',
    ],
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  async rewrites() {
    return [
      {
        source: '/images/:path*',
        destination:
          'https://aok-projects-images.s3.us-east-2.amazonaws.com/:path*',
      },
    ]
  },
}

export default nextConfig
