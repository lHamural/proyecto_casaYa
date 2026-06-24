// components/suscripcion/HistorialSuscripciones.tsx
'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, CreditCard, History, CheckCircle, XCircle, Clock } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import type { JSX } from 'react'

interface Subscription {
  id: string
  status: string
  startDate: string
  endDate: string | null
  plan: {
    name: string
    price: number
    currency: string
  }
}

const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon: JSX.Element }> = {
  ACTIVE: { 
    label: 'Activo', 
    variant: 'default',
    icon: <CheckCircle className="w-3 h-3" />
  },
  CANCELLED: { 
    label: 'Cancelado', 
    variant: 'secondary',
    icon: <XCircle className="w-3 h-3" />
  },
  EXPIRED: { 
    label: 'Expirado', 
    variant: 'outline',
    icon: <Clock className="w-3 h-3" />
  },
  PENDING: { 
    label: 'Pendiente', 
    variant: 'secondary',
    icon: <Clock className="w-3 h-3" />
  },
}

export default function HistorialSuscripciones() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchHistorial()
  }, [])

  const fetchHistorial = async () => {
    try {
      const res = await fetch('/api/suscripciones/historial')
      if (!res.ok) throw new Error('Error al cargar historial')
      const data = await res.json()
      setSubscriptions(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
        {[1, 2].map((i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-48" />
                </div>
                <Skeleton className="h-6 w-20" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <Card className="bg-red-50 border-red-200">
        <CardContent className="py-6 text-center text-red-600">
          <p>Error al cargar el historial: {error}</p>
        </CardContent>
      </Card>
    )
  }

  if (subscriptions.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="py-8 text-center">
          <History className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No hay suscripciones previas</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Historial de Suscripciones</h2>
        <p className="text-xs text-muted-foreground">
          {subscriptions.length} registro(s)
        </p>
      </div>

      <div className="space-y-3">
        {subscriptions.map((sub) => {
          const status = statusConfig[sub.status] || statusConfig.PENDING
          const startDate = new Date(sub.startDate)
          const endDate = sub.endDate ? new Date(sub.endDate) : null

          return (
            <Card key={sub.id}>
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                      <CreditCard className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant={status.variant} className="text-[10px] px-1.5 h-5">
                          <span className="flex items-center gap-1">
                            {status.icon}
                            {status.label}
                          </span>
                        </Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{startDate.toLocaleDateString('es-ES')}</span>
                        </div>
                        {endDate && (
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>→ {endDate.toLocaleDateString('es-ES')}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}