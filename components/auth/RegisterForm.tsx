'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faUser, 
  faEnvelope, 
  faPhone, 
  faLock, 
  faHome,
  faArrowRight,
  faUserTag,
  faEye,
  faEyeSlash,
  faCheckCircle,
  faExclamationCircle
} from '@fortawesome/free-solid-svg-icons'
import { cn } from '@/lib/utils'

interface RegisterFormProps {
  logoUrl?: string
  siteName?: string
}

export default function RegisterForm({ 
  logoUrl = '/image/logo.png',
  siteName = 'CasaYa'
}: RegisterFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: 'VISITANTE',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (form.password !== form.confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    if (form.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          phone: form.phone,
          role: form.role,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error)
        return
      }

      await signIn('credentials', {
        email: form.email,
        password: form.password,
        redirect: false,
      })

      router.push('/suscriptor')
      router.refresh()
    } catch {
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
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
        {/* Logo y nombre de la página - Logo más grande */}
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
            Comienza tu experiencia
          </p>
        </div>

        <CardHeader className="text-center pt-4 pb-2">
          <CardTitle className="text-xl">Crear Cuenta</CardTitle>
          <CardDescription>
            Regístrate para publicar y gestionar propiedades
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5 px-6 pb-8">
          {error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-start gap-3 animate-in slide-in-from-top-2 duration-300">
              <div className="p-1.5 bg-red-100 rounded-full mt-0.5">
                <FontAwesomeIcon icon={faExclamationCircle} className="w-4 h-4 text-red-600" />
              </div>
              <div>
                <p className="font-medium text-red-800">Error</p>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nombre */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Nombre completo *</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FontAwesomeIcon icon={faUser} className="h-4 w-4 text-muted-foreground" />
                </div>
                <Input
                  placeholder="Juan Pérez"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="pl-10 h-11 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Email *</Label>
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

            {/* Teléfono */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Teléfono</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FontAwesomeIcon icon={faPhone} className="h-4 w-4 text-muted-foreground" />
                </div>
                <Input
                  placeholder="+591 7XXXXXXX"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="pl-10 h-11 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
            </div>

            {/* Rol */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Tipo de cuenta</Label>
              <Select
                value={form.role}
                onValueChange={(val) => setForm({ ...form, role: val })}
              >
                <SelectTrigger className="h-11 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all">
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faUserTag} className="h-4 w-4 text-muted-foreground" />
                    <SelectValue placeholder="Selecciona tu rol" />
                  </div>
                </SelectTrigger>
                <SelectContent className='bg-primary text-white'>
                  <SelectItem value="VISITANTE" className="py-2">
                    <div>
                      <p className="font-medium">Visitante</p>
                      <p className="text-xs text-muted-foreground">Solo buscar propiedades</p>
                    </div>
                  </SelectItem>
                  <SelectItem value="PROPIETARIO" className="py-2">
                    <div>
                      <p className="font-medium">Propietario</p>
                      <p className="text-xs text-muted-foreground">Publicar mis propiedades</p>
                    </div>
                  </SelectItem>
                  <SelectItem value="INMOBILIARIA" className="py-2">
                    <div>
                      <p className="font-medium">Inmobiliaria</p>
                      <p className="text-xs text-muted-foreground">Gestión profesional</p>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Contraseña */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Contraseña *</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FontAwesomeIcon icon={faLock} className="h-4 w-4 text-muted-foreground" />
                </div>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Mínimo 6 caracteres"
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

            {/* Confirmar contraseña */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Confirmar contraseña *</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FontAwesomeIcon icon={faCheckCircle} className="h-4 w-4 text-muted-foreground" />
                </div>
                <Input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Repite tu contraseña"
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  required
                  className={cn(
                    "pl-10 h-11 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all",
                    form.confirmPassword && form.password === form.confirmPassword && "border-green-500 focus:ring-green-500/20",
                    form.confirmPassword && form.password !== form.confirmPassword && "border-red-500 focus:ring-red-500/20"
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground transition-colors"
                >
                  <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} className="w-4 h-4" />
                </button>
                {form.confirmPassword && form.password === form.confirmPassword && (
                  <div className="absolute inset-y-0 right-12 pr-3 flex items-center">
                    <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500" />
                  </div>
                )}
              </div>
              {form.confirmPassword && form.password !== form.confirmPassword && (
                <p className="text-xs text-red-500 mt-1">Las contraseñas no coinciden</p>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full h-11 bg-primary text-primary  hover:text-white hover:bg-primary/90 shadow-lg shadow-primary/30 transition-all"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2  border-white/30 border-t-white rounded-full animate-spin" />
                  Creando cuenta...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Crear Cuenta
                  <FontAwesomeIcon icon={faArrowRight} className="w-4 h-4" />
                </span>
              )}
            </Button>
          </form>

          {/* Login */}
          <div className="text-center pt-2">
            <p className="text-sm text-muted-foreground">
              ¿Ya tienes cuenta?{' '}
              <Link 
                href="/login" 
                className="text-primary hover:text-primary/80 font-semibold hover:underline transition-colors"
              >
                Inicia sesión
              </Link>
            </p>
          </div>

          {/* Footer con roles */}
          <div className="flex justify-center gap-4 pt-2">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <FontAwesomeIcon icon={faUser} className="w-3 h-3" />
              <span>Visitantes</span>
            </div>
            <div className="w-px h-4 bg-gray-200" />
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <FontAwesomeIcon icon={faHome} className="w-3 h-3" />
              <span>Propietarios</span>
            </div>
            <div className="w-px h-4 bg-gray-200" />
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <FontAwesomeIcon icon={faUserTag} className="w-3 h-3" />
              <span>Inmobiliarias</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}