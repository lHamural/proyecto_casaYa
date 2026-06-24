'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faEnvelope, 
  faLock, 
  faArrowRight,
  faBuilding,
  faHome,
  faShieldAlt,
  faEye,
  faEyeSlash
} from '@fortawesome/free-solid-svg-icons'
import { cn } from '@/lib/utils'

interface LoginFormProps {
  logoUrl?: string
  siteName?: string
}

export default function LoginForm({ 
  logoUrl = '/image/logo.png',
  siteName = 'CasaYa'
}: LoginFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [loadingGoogle, setLoadingGoogle] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const result = await signIn('credentials', {
      email: form.email,
      password: form.password,
      redirect: false,
    })

    if (result?.error) {
      setError('Email o contraseña incorrectos')
      setLoading(false)
      return
    }

    const session = await fetch('/api/auth/session').then((r) => r.json())
    const role = session?.user?.role

    if (role === 'SUPERADMIN') {
      router.push('/admin')
    } else {
      router.push('/dashboard')
    }
    router.refresh()
  }

  const handleGoogle = async () => {
    setLoadingGoogle(true)
    await signIn('google', { callbackUrl: '/dashboard' })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50/30 p-4">
      {/* Elementos decorativos de fondo */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      </div>

      <Card className="w-full max-w-md relative z-10 border-0 shadow-2xl shadow-primary/10 bg-white/80 backdrop-blur-xl">
        {/* Logo y nombre de la página - Logo más grande sin fondo */}
        <div className="flex flex-col items-center pt-10 px-6">
          <div className="relative">
            {logoUrl ? (
              <Image 
                src={logoUrl}
                alt={siteName}
                width={100}
                height={100}
                className="w-24 h-24 object-contain"
                priority
              />
            ) : (
              <div className="text-primary">
                <FontAwesomeIcon icon={faHome} className="w-16 h-16" />
              </div>
            )}
          </div>
          
          <h1 className="text-3xl font-bold mt-4 text-primary">
            {siteName}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Bienvenido de vuelta
          </p>
        </div>

        <CardHeader className="text-center pt-4 pb-2">
          <CardTitle className="text-xl">Iniciar Sesión</CardTitle>
          <CardDescription>
            Ingresa a tu cuenta para gestionar tus propiedades
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5 px-6 pb-8">
          {error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-start gap-3 animate-in slide-in-from-top-2 duration-300">
              <div className="p-1.5 bg-red-100 rounded-full mt-0.5">
                <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-red-800">Error</p>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}

          {/* Google Button */}
          <Button
            type="button"
            variant="outline"
            className="w-full h-11 border-2 hover:border-primary hover:bg-primary/5 transition-all group"
            onClick={handleGoogle}
            disabled={loadingGoogle}
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {loadingGoogle ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-gray-300 border-t-primary rounded-full animate-spin" />
                Conectando...
              </span>
            ) : (
              'Continuar con Google'
            )}
          </Button>

          <div className="flex items-center gap-3">
            <Separator className="flex-1" />
            <span className="text-xs text-muted-foreground font-medium">o</span>
            <Separator className="flex-1" />
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Correo electrónico</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FontAwesomeIcon icon={faEnvelope} className="h-4 w-4 text-muted-foreground" />
                </div>
                <Input
                  type="email"
                  placeholder="tu@correo.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  className="pl-10 h-11 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Contraseña</Label>
                <Link 
                  href="/recuperar-password" 
                  className="text-xs text-primary hover:text-primary/80 hover:underline font-medium"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FontAwesomeIcon icon={faLock} className="h-4 w-4 text-muted-foreground" />
                </div>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  className="pl-10 h-11 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground transition-colors"
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="w-4 h-4" />
                </button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-11 hover:text-white hover:bg-primary/90 shadow-lg shadow-primary/30 transition-all bg-primary"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Ingresando...
                </span>
              ) : (
                <span className="flex items-center gap-2 ">
                  Ingresar
                  <FontAwesomeIcon icon={faArrowRight} className="w-4 h-4" />
                </span>
              )}
            </Button>
          </form>

          {/* Registro */}
          <div className="text-center pt-2">
            <p className="text-sm text-muted-foreground">
              ¿No tienes cuenta?{' '}
              <Link 
                href="/registro" 
                className="text-primary hover:text-primary/80 font-semibold hover:underline transition-colors"
              >
                Regístrate aquí
              </Link>
            </p>
          </div>

          {/* Footer con roles */}
          <div className="flex justify-center gap-4 pt-2">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <FontAwesomeIcon icon={faBuilding} className="w-3 h-3" />
              <span>Inmobiliarias</span>
            </div>
            <div className="w-px h-4 bg-gray-200" />
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <FontAwesomeIcon icon={faHome} className="w-3 h-3" />
              <span>Propietarios</span>
            </div>
            <div className="w-px h-4 bg-gray-200" />
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <FontAwesomeIcon icon={faShieldAlt} className="w-3 h-3" />
              <span>Administradores</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}