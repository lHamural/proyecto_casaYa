import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },

  serverExternalPackages: ['@prisma/client', 'bcryptjs', 'sharp'],

  async rewrites() {
    const uploadUrl = process.env.NEXT_PUBLIC_UPLOAD_URL

    if (process.env.NODE_ENV === 'production' && uploadUrl) {
      return [
        {
          source: '/uploads/:path*',
          destination: `${uploadUrl}/:path*`,
        },
      ]
    }

    return []
  },
}

export default nextConfig