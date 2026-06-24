// components/web/MensajeSimplificado.tsx
'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Send, Loader2, CheckCircle, AlertCircle, MessageCircle } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

interface MensajeSimplificadoProps {
  propertyId: string
  ownerId: string
  ownerName: string
  propertyTitle: string
}

export function MensajeSimplificado({ 
  propertyId, 
  ownerId, 
  ownerName,
  propertyTitle 
}: MensajeSimplificadoProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [mensaje, setMensaje] = useState(`Hola, me interesa esta propiedad. ¿Podrías darme más información?`)

  // Si no está logueado, mostrar mensaje
  if (!session?.user) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
          <MessageCircle className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-muted-foreground mb-4">
          Inicia sesión para enviar un mensaje al vendedor
        </p>
        <Button asChild className="w-full">
          <a href={`/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`}>
            Iniciar Sesión
          </a>
        </Button>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!mensaje.trim()) {
      setError('Escribe un mensaje')
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/mensajes/enviar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyId,
          ownerId,
          mensaje: mensaje.trim(),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Error al enviar mensaje')
      }

      setSuccess(true)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al enviar mensaje')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="font-semibold text-green-800">¡Mensaje enviado!</h3>
        <p className="text-sm text-green-600 mt-1">
          Tu mensaje fue enviado a {ownerName}. Te contactará pronto.
        </p>
        <Button variant="outline" className="mt-4" onClick={() => setSuccess(false)}>
          Enviar otro mensaje
        </Button>
      </div>
    )
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Cabecera con avatar */}
      <div className="flex items-center gap-3 pb-3 border-b">
        <Avatar className="w-10 h-10">
          <AvatarFallback className="bg-primary/10 text-primary">
            {getInitials(ownerName)}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold text-sm">{ownerName}</p>
          <p className="text-xs text-muted-foreground">Propietario</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      <div>
        <Textarea
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          placeholder={`Escribe tu mensaje para ${ownerName}...`}
          rows={3}
          className="resize-none"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Mensaje sobre: <span className="font-medium">{propertyTitle}</span>
        </p>
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Enviando...
          </>
        ) : (
          <>
            <Send className="w-4 h-4 mr-2" />
            Enviar mensaje
          </>
        )}
      </Button>
    </form>
  )
}