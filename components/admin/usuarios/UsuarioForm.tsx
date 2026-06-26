'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faUser, 
  faEnvelope, 
  faPhone, 
  faLock, 
  faUserTag,
  faSave,
  faTimes,
  faCheckCircle,
  faIdCard
} from '@fortawesome/free-solid-svg-icons'
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons'
import { cn } from '@/lib/utils'

interface UsuarioFormProps {
  initialData?: {
    id: string
    name: string
    email: string
    phone?: string | null
    whatsapp?: string | null
    role: string
    isActive: boolean
  }
  isEditing?: boolean
}

export default function UsuarioForm({
  initialData,
  isEditing = false,
}: UsuarioFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: initialData?.name || '',
    email: initialData?.email || '',
    password: '',
    phone: initialData?.phone || '',
    whatsapp: initialData?.whatsapp || '',
    role: initialData?.role || 'VISITANTE',
    isActive: initialData?.isActive ?? true,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const url = isEditing
      ? `/api/admin/usuarios/${initialData?.id}`
      : '/api/admin/usuarios'
    const method = isEditing ? 'PUT' : 'POST'

    if (!isEditing && !form.password) {
      setError('La contraseña es requerida')
      setLoading(false)
      return
    }

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Ocurrió un error')
        return
      }

      router.push('/admin/usuarios')
      router.refresh()
    } catch {
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  const roles = [
    { value: 'VISITANTE', label: 'Visitante' },
    { value: 'PROPIETARIO', label: 'Propietario' },
    { value: 'INMOBILIARIA', label: 'Inmobiliaria' },
    { value: 'SUPERADMIN', label: 'Super Admin' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="container-custom max-w-4xl mx-auto px-6">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 text-white rounded-3xl p-10 mb-8 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(at_top_right,#4f46e520_0%,transparent_50%)]" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-xl border border-white/20">
                <FontAwesomeIcon icon={faUser} className="w-8 h-8 text-blue-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-white">
                  {isEditing ? 'Editar Usuario' : 'Nuevo Usuario'}
                </h1>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-700 border border-red-200 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          {/* Información Personal */}
          <Card className="border-2 border-gray-100">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="flex items-center gap-2">
                <FontAwesomeIcon icon={faUser} className="w-5 h-5 text-primary" />
                Información Personal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faUser} className="w-4 h-4 text-muted-foreground" />
                    Nombre completo *
                  </Label>
                  <Input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Juan Pérez"
                    required
                    className="focus:ring-primary focus:border-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faEnvelope} className="w-4 h-4 text-muted-foreground" />
                    Email *
                  </Label>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="juan@correo.com"
                    required
                    className="focus:ring-primary focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faPhone} className="w-4 h-4 text-muted-foreground" />
                    Teléfono
                  </Label>
                  <Input
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+591 7XXXXXXX"
                    className="focus:ring-primary focus:border-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faWhatsapp} className="w-4 h-4 text-green-500" />
                    WhatsApp
                  </Label>
                  <Input
                    value={form.whatsapp}
                    onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                    placeholder="+591 7XXXXXXX"
                    className="focus:ring-primary focus:border-primary"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Acceso y Rol */}
          <Card className="border-2 border-gray-100">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="flex items-center gap-2">
                <FontAwesomeIcon icon={faLock} className="w-5 h-5 text-primary" />
                Acceso y Rol
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faUserTag} className="w-4 h-4 text-muted-foreground" />
                  Rol *
                </Label>
                <Select
                  value={form.role}
                  onValueChange={(val) => setForm({ ...form, role: val })}
                >
                  <SelectTrigger className="focus:ring-primary focus:border-primary">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className='bg-primary text-white'>
                    {roles.map((r) => (
                      <SelectItem key={r.value} value={r.value}>
                        {r.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faLock} className="w-4 h-4 text-muted-foreground" />
                  {isEditing
                    ? 'Nueva contraseña (dejar vacío para no cambiar)'
                    : 'Contraseña *'}
                </Label>
                <Input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Mínimo 6 caracteres"
                  required={!isEditing}
                  className="focus:ring-primary focus:border-primary"
                />
              </div>

              <div className="flex items-center justify-between rounded-lg border-2 p-4">
                <div>
                  <Label className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-500" />
                    Usuario activo
                  </Label>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Los usuarios inactivos no pueden iniciar sesión
                  </p>
                </div>
                <Switch
                  checked={form.isActive}
                  onCheckedChange={(val) => setForm({ ...form, isActive: val })}
                  className="data-[state=checked]:bg-primary"
                />
              </div>
            </CardContent>
          </Card>

          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button 
              type="submit" 
              disabled={loading}
              className="flex-1 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
            >
              <FontAwesomeIcon 
                icon={faSave} 
                className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} 
              />
              {loading
                ? 'Guardando...'
                : isEditing
                ? 'Actualizar Usuario'
                : 'Crear Usuario'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/admin/usuarios')}
              className="flex-1 sm:flex-none"
            >
              <FontAwesomeIcon icon={faTimes} className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}