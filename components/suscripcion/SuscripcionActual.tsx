// components/suscripcion/SuscripcionActual.tsx
'use client'

import { useState } from 'react'  // 👈 Agrega esta importación
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, CreditCard, AlertCircle, Zap } from 'lucide-react'

interface SuscripcionActualProps {
  subscription: {
    plan: { name: string; maxProperties: number; maxImages: number; price: number }
    status: string
    startDate?: Date | null
    endDate?: Date | null
    stripeSubscriptionId?: string | null
  } | null
}

export default function SuscripcionActual({ subscription }: SuscripcionActualProps) {
  const [cancelling, setCancelling] = useState(false)

  const handleCancel = async () => {
    if (!confirm('¿Estás seguro de que deseas cancelar tu suscripción?')) return
    
    setCancelling(true)
    try {
      const res = await fetch('/api/stripe/cancelar', { method: 'POST' })
      const data = await res.json()
      if (res.ok) {
        alert(data.message)
        window.location.reload()
      } else {
        alert(data.error)
      }
    } catch {
      alert('Error al cancelar la suscripción')
    } finally {
      setCancelling(false)
    }
  }

  if (!subscription) {
    return (
      <Card className="border-amber-200 bg-amber-50/30">
        <CardContent className="py-6 text-center">
          <Zap className="w-8 h-8 text-amber-500 mx-auto mb-2" />
          <p className="text-muted-foreground text-sm">
            Activa tu primer plan gratuito o elige un plan de pago
          </p>
        </CardContent>
      </Card>
    )
  }

  const isFree = subscription.plan.price === 0
  const daysLeft = subscription.endDate
    ? Math.max(0, Math.ceil((new Date(subscription.endDate).getTime() - Date.now()) / (1000 * 3600 * 24)))
    : null

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between flex-wrap gap-2">
          <span>Plan actual: {subscription.plan.name}</span>
          <Badge variant={subscription.status === 'ACTIVE' ? 'default' : 'destructive'} className="text-white">
            {subscription.status === 'ACTIVE' ? 'Activo' : subscription.status}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-2 text-sm">
            <CreditCard className="w-4 h-4 text-muted-foreground" />
            <span>Máximo: {subscription.plan.maxProperties} propiedades</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <CreditCard className="w-4 h-4 text-muted-foreground" />
            <span>Máximo: {subscription.plan.maxImages} imágenes por propiedad</span>
          </div>
          {subscription.startDate && (
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span>Inicio: {new Date(subscription.startDate).toLocaleDateString('es-ES')}</span>
            </div>
          )}
          {subscription.endDate && !isFree && (
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span>Próxima renovación: {new Date(subscription.endDate).toLocaleDateString('es-ES')}</span>
            </div>
          )}
        </div>

        {isFree && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-700">
              ℹ️ El plan gratuito es válido por {subscription.plan.durationDays} días y solo puede activarse una vez.
              Al vencerse, deberás contratar un plan de pago.
            </p>
          </div>
        )}

        {daysLeft !== null && daysLeft <= 7 && !isFree && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <p className="text-sm text-amber-700">
              ⚠️ Tu suscripción expira en {daysLeft} días. ¡Renueva para no perder beneficios!
            </p>
          </div>
        )}

        {subscription.stripeSubscriptionId && subscription.status === 'ACTIVE' && !isFree && (
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={handleCancel}
            disabled={cancelling}
          >
            {cancelling ? 'Cancelando...' : 'Cancelar suscripción'}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}