// components/suscripcion/PlanesDisponibles.tsx
'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check, Zap, Loader2 } from 'lucide-react'

interface Plan {
  id: string
  name: string
  price: number
  currency: string
  description?: string | null
  maxProperties: number
  maxImages: number
  allowVirtualTour: boolean
  allowHighlight: boolean
  allowWhatsapp: boolean
  allowStats: boolean
  durationDays: number
  stripePriceId?: string | null
}

interface PlanesDisponiblesProps {
  planes: Plan[]
  planActual: string
}

const planStyles: Record<string, { border: string; badge: string; button: string }> = {
  GRATUITO: {
    border: 'border-gray-200',
    badge: 'bg-gray-100 text-gray-600',
    button: 'outline',
  },
  BASICO: {
    border: 'border-blue-200 shadow-blue-100',
    badge: 'bg-blue-100 text-blue-700',
    button: 'outline',
  },
  PROFESIONAL: {
    border: 'border-purple-200 shadow-purple-100',
    badge: 'bg-purple-100 text-purple-700',
    button: 'default',
  },
  PREMIUM: {
    border: 'border-amber-200 shadow-amber-100',
    badge: 'bg-amber-100 text-amber-700',
    button: 'default',
  },
}

export default function PlanesDisponibles({
  planes,
  planActual,
}: PlanesDisponiblesProps) {
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubscribe = async (plan: Plan) => {
    setLoading(plan.id)
    setError(null)

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId: plan.id }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al procesar el pago')
      }

      // Redirigir a Stripe Checkout
      if (data.url) {
        window.location.href = data.url
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al procesar el pago')
      setTimeout(() => setError(null), 5000)
    } finally {
      setLoading(null)
    }
  }

  // Ordenar planes: GRATUITO, BASICO, PROFESIONAL, PREMIUM
 const ordenPlanes: Record<string, number> = { GRATUITO: 0, BASICO: 1, PROFESIONAL: 2, PREMIUM: 3 }
  const planesOrdenados = [...planes].sort((a, b) => ordenPlanes[a.name] - ordenPlanes[b.name])

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Planes Disponibles</h2>
        <p className="text-sm text-muted-foreground">
          Actualiza tu plan para publicar más propiedades y acceder a más funciones
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
          ❌ {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {planesOrdenados.map((plan) => {
          const esPlanActual = plan.name === planActual
          const esGratuito = plan.price === 0
          const styles = planStyles[plan.name] || planStyles.GRATUITO
          const isPopular = plan.name === 'PROFESIONAL'

          return (
            <Card
              key={plan.id}
              className={`relative ${styles.border} transition-all duration-200 hover:shadow-lg`}
            >
              {isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-purple-600 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1">
                    <Zap className="w-3 h-3" /> Más popular
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-2">
                <Badge className={`${styles.badge} self-center text-xs font-medium border-0`}>
                  {plan.name}
                </Badge>
                
                <div className="mt-3">
                  {esGratuito ? (
                    <p className="text-3xl font-bold">Gratis</p>
                  ) : (
                    <div>
                      <span className="text-3xl font-bold">${plan.price}</span>
                      <span className="text-muted-foreground text-sm"> / mes</span>
                    </div>
                  )}
                </div>
                
                {plan.description && (
                  <p className="text-xs text-muted-foreground mt-1">{plan.description}</p>
                )}
              </CardHeader>

              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span>{plan.maxProperties} propiedades publicadas</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span>{plan.maxImages} imágenes por propiedad</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    {plan.allowVirtualTour ? (
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    ) : (
                      <div className="w-4 h-4" />
                    )}
                    <span className={!plan.allowVirtualTour ? 'text-muted-foreground' : ''}>
                      Tour Virtual 360°
                    </span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    {plan.allowHighlight ? (
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    ) : (
                      <div className="w-4 h-4" />
                    )}
                    <span className={!plan.allowHighlight ? 'text-muted-foreground' : ''}>
                      Destacar propiedades
                    </span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    {plan.allowWhatsapp ? (
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    ) : (
                      <div className="w-4 h-4" />
                    )}
                    <span className={!plan.allowWhatsapp ? 'text-muted-foreground' : ''}>
                      Contacto por WhatsApp
                    </span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    {plan.allowStats ? (
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    ) : (
                      <div className="w-4 h-4" />
                    )}
                    <span className={!plan.allowStats ? 'text-muted-foreground' : ''}>
                      Estadísticas avanzadas
                    </span>
                  </li>
                </ul>

                {esPlanActual ? (
                  <Button className="w-full" variant="outline" disabled>
                    Plan actual ✓
                  </Button>
                ) : esGratuito ? (
                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={() => handleSubscribe(plan)}
                    disabled={loading === plan.id}
                  >
                    {loading === plan.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      'Activar plan gratuito'
                    )}
                  </Button>
                ) : (
                  <Button
                    className="w-full"
                    variant={styles.button as 'default' | 'outline'}
                    onClick={() => handleSubscribe(plan)}
                    disabled={loading === plan.id}
                  >
                    {loading === plan.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      `Suscribirse por $${plan.price}/mes`
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}