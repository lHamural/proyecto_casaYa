import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/uploads/**',
      },
    ],
    // Permitir imágenes locales también
    domains: ['localhost'],
  },
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'bcryptjs', 'sharp'],
  },
/*   images: {
    domains: ['localhost', 'tudominio.com'],
  }, */
  // Servir archivos estáticos desde carpeta externa en VPS
  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination:
          process.env.NODE_ENV === 'production'
            ? `${process.env.NEXT_PUBLIC_UPLOAD_URL}/:path*`
            : '/uploads/:path*',
      },
    ]
  },
}

export default nextConfig