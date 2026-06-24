// app/layout.tsx
'use client'
export const runtime = 'nodejs'

import { SessionProvider } from 'next-auth/react'
import { Inter } from 'next/font/google'
import './globals.css'
// No necesitas importar website.css aquí porque ya se importa en el layout específico
// import './styles/website.css'  // ← Elimina esta línea

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}