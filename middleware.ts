// middleware.ts
import { auth } from '@/auth'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

export default auth((req) => {
  const { nextUrl, auth: session } = req
  const isLoggedIn = !!session?.user
  const role = session?.user?.role

  // 🔴 IMPORTANTE: Excluir rutas de API de upload
  const isUploadRoute = nextUrl.pathname.startsWith('/api/upload')
  if (isUploadRoute) {
    return NextResponse.next()  // Permitir sin procesar auth
  }

  // ===== RUTAS PÚBLICAS =====
  const isPublicRoute = 
    nextUrl.pathname === '/' ||
    nextUrl.pathname.startsWith('/nosotros') ||
    nextUrl.pathname.startsWith('/propiedades') ||
    nextUrl.pathname.startsWith('/alquiler') ||
    nextUrl.pathname.startsWith('/venta') ||
    nextUrl.pathname.startsWith('/contacto')

  const isAuthRoute = 
    nextUrl.pathname.startsWith('/login') ||
    nextUrl.pathname.startsWith('/registro')

  const isAdminRoute = nextUrl.pathname.startsWith('/admin')
  const isSuscriptorRoute = nextUrl.pathname.startsWith('/suscriptor')

  // Resto de tu middleware...
  if (isLoggedIn && isAuthRoute) {
    if (role === 'SUPERADMIN') {
      return NextResponse.redirect(new URL('/admin', nextUrl))
    }
    return NextResponse.redirect(new URL('/suscriptor', nextUrl))
  }

  if (!isLoggedIn && (isAdminRoute || isSuscriptorRoute)) {
    return NextResponse.redirect(new URL('/login', nextUrl))
  }

  if (isLoggedIn && isAdminRoute && role !== 'SUPERADMIN') {
    return NextResponse.redirect(new URL('/suscriptor', nextUrl))
  }

  return NextResponse.next()
})

// middleware.ts
export const config = {
  matcher: ['/((?!api/auth|api/upload|_next/static|_next/image|favicon.ico).*)'],
}