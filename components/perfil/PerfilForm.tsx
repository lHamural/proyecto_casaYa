// components/admin/PerfilForm.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faSave, 
  faSpinner, 
  faUser, 
  faEnvelope, 
  faPhone, 
  faCheckCircle, 
  faExclamationCircle,
  faEdit,
  faIdCard,
  faUserEdit
} from '@fortawesome/free-solid-svg-icons'
import { cn } from '@/lib/utils'

interface PerfilFormProps {
  usuario: {
    id: string
    name: string | null
    email: string
    phone: string | null
  }
}

export default function PerfilForm({ usuario }: PerfilFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [form, setForm] = useState({
    name: usuario.name || '',
    phone: usuario.phone || '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const res = await fetch('/api/usuario/perfil', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Error al actualizar perfil')
      }

      setSuccess('Perfil actualizado correctamente')
      router.refresh()
      
      setTimeout(() => setSuccess(''), 3000)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al actualizar perfil')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Alertas con estilo mejorado */}
      {error && (
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-start gap-3">
          <div className="p-1.5 bg-red-100 rounded-full mt-0.5">
            <FontAwesomeIcon icon={faExclamationCircle} className="w-4 h-4 text-red-600" />
          </div>
          <div>
            <p className="font-medium text-red-800">Error</p>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 flex items-start gap-3 animate-in fade-in duration-300">
          <div className="p-1.5 bg-green-100 rounded-full mt-0.5">
            <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-600" />
          </div>
          <div>
            <p className="font-medium text-green-800">¡Éxito!</p>
            <p className="text-sm text-green-700">{success}</p>
          </div>
        </div>
      )}

      {/* Campos del formulario */}
      <div className="space-y-4">
        {/* Nombre */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-sm font-medium">
            <FontAwesomeIcon icon={faUser} className="w-3.5 h-3.5 text-primary" />
            Nombre completo
          </Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FontAwesomeIcon icon={faUserEdit} className="h-4 w-4 text-muted-foreground" />
            </div>
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Tu nombre completo"
              required
              className="pl-10 focus:ring-primary focus:border-primary"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            <FontAwesomeIcon icon={faEdit} className="w-3 h-3 mr-1" />
            Tu nombre se mostrará en tu perfil público
          </p>
        </div>

        {/* Email (solo lectura) */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-sm font-medium">
            <FontAwesomeIcon icon={faEnvelope} className="w-3.5 h-3.5 text-primary" />
            Correo electrónico
          </Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FontAwesomeIcon icon={faEnvelope} className="h-4 w-4 text-muted-foreground" />
            </div>
            <Input
              value={usuario.email}
              disabled
              className="pl-10 bg-muted/50 cursor-not-allowed border-dashed"
            />
          </div>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <FontAwesomeIcon icon={faIdCard} className="w-3 h-3" />
            El correo electrónico no puede ser modificado
          </p>
        </div>

        {/* Teléfono */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-sm font-medium">
            <FontAwesomeIcon icon={faPhone} className="w-3.5 h-3.5 text-primary" />
            Teléfono
          </Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FontAwesomeIcon icon={faPhone} className="h-4 w-4 text-muted-foreground" />
            </div>
            <Input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="+591 12345678"
              className="pl-10 focus:ring-primary focus:border-primary"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            <FontAwesomeIcon icon={faEdit} className="w-3 h-3 mr-1" />
            Número de contacto para comunicación
          </p>
        </div>
      </div>

      {/* Botón Guardar */}
      <div className="pt-4 border-t border-gray-100">
        <Button 
          type="submit" 
          disabled={loading}
          className="w-full sm:w-auto bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 px-8"
        >
          {loading ? (
            <>
              <FontAwesomeIcon icon={faSpinner} className="w-4 h-4 mr-2 animate-spin" />
              Guardando...
            </>
          ) : (
            <>
              <FontAwesomeIcon icon={faSave} className="w-4 h-4 mr-2" />
              Guardar cambios
            </>
          )}
        </Button>
      </div>
    </form>
  )
}