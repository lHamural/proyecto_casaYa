import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: "standalone",
  
  // 1. Quita `domains`, ya tienes `remotePatterns`
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/uploads/**',
      },
    ],
  },

  // 2. `serverComponentsExternalPackages` se movió fuera de `experimental`
  serverExternalPackages: ['@prisma/client', 'bcryptjs', 'sharp'],

  // 3. El rewrite falla porque NEXT_PUBLIC_UPLOAD_URL no está definida en Railway
  // Debes manejar el caso donde sea undefined
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