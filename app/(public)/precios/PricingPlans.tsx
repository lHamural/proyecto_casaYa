'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCheck,
  faTimes,
  faCrown,
  faRocket,
  faStar,
  faArrowRight,
  faSpinner,
  faHome,
  faImage,
  faCube,
  faChartLine,
  faPhone,
  faStar as faStarSolid,
} from '@fortawesome/free-solid-svg-icons'

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

interface PricingPlansProps {
  planes: Plan[]
  isLoggedIn: boolean
}

const planMeta: Record<string, { icon: any; color: string; gradient: string; badge?: string }> = {
  GRATUITO: {
    icon: faStar,
    color: 'text-gray-500',
    gradient: 'from-gray-50 to-gray-100',
  },
  BASICO: {
    icon: faHome,
    color: 'text-blue-600',
    gradient: 'from-blue-50 to-blue-100',
  },
  PLATINO: {
    icon: faCrown,
    color: 'text-purple-600',
    gradient: 'from-purple-50 to-purple-100',
    badge: 'Más popular',
  },
  PREMIUM: {
    icon: faRocket,
    color: 'text-amber-600',
    gradient: 'from-amber-50 to-amber-100',
    badge: 'Máximo beneficio',
  },
}

const features = [
  { key: 'maxProperties' as const, label: 'Propiedades publicadas', suffix: '' },
  { key: 'maxImages' as const, label: 'Imágenes por propiedad', suffix: '' },
  { key: 'allowVirtualTour' as const, label: 'Tour Virtual 360°', suffix: '', bool: true },
  { key: 'allowHighlight' as const, label: 'Destacar propiedades', suffix: '', bool: true },
  { key: 'allowWhatsapp' as const, label: 'Contacto por WhatsApp', suffix: '', bool: true },
  { key: 'allowStats' as const, label: 'Estadísticas avanzadas', suffix: '', bool: true },
]

export function PricingPlans({ planes, isLoggedIn }: PricingPlansProps) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const orden: Record<string, number> = { GRATUITO: 0, BASICO: 1, PLATINO: 2, PREMIUM: 3 }
  const ordenados = [...planes].sort((a, b) => orden[a.name] - orden[b.name])

  const handleSubscribe = async (plan: Plan) => {
    if (!isLoggedIn) {
      router.push('/login')
      return
    }

    if (plan.price === 0) {
      setLoading(plan.id)
      setError(null)
      try {
        const res = await fetch('/api/stripe/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ planId: plan.id }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Error al procesar')
        if (data.url) window.location.href = data.url
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al procesar')
        setTimeout(() => setError(null), 5000)
      } finally {
        setLoading(null)
      }
      return
    }

    setLoading(plan.id)
    setError(null)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId: plan.id }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error al procesar el pago')
      if (data.url) window.location.href = data.url
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al procesar el pago')
      setTimeout(() => setError(null), 5000)
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* HERO */}
      <div className="bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 text-white">
        <div className="max-w-6xl mx-auto px-6 py-20 md:py-28 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 rounded-full px-5 py-2 mb-8 text-sm">
            <FontAwesomeIcon icon={faCrown} className="w-4 h-4 text-amber-400" />
            <span>Planes para cada necesidad</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tighter mb-6">
            Encuentra el plan perfecto
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Desde gratis hasta premium. Elige el plan que mejor se adapte a tus necesidades y comienza a publicar propiedades hoy.
          </p>
        </div>
      </div>

      {/* ERROR */}
      {error && (
        <div className="max-w-6xl mx-auto px-6 -mt-8 mb-8">
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">
            {error}
          </div>
        </div>
      )}

      {/* PLANES */}
      <div className="max-w-6xl mx-auto px-6 -mt-12 pb-24">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {ordenados.map((plan) => {
            const meta = planMeta[plan.name] || planMeta.GRATUITO
            const isPopular = plan.name === 'PLATINO'
            const isFree = plan.price === 0
            const btnLabel = isFree
              ? 'Comenzar gratis'
              : `Suscribirse por $${plan.price}/mes`

            return (
              <div
                key={plan.id}
                className={`relative bg-white rounded-2xl shadow-sm border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col ${
                  isPopular ? 'border-purple-300 shadow-purple-100 ring-2 ring-purple-400/20' : 'border-gray-100'
                }`}
              >
                {meta.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                    <span className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-semibold px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
                      <FontAwesomeIcon icon={faStarSolid} className="w-3 h-3" />
                      {meta.badge}
                    </span>
                  </div>
                )}

                <div className={`p-6 rounded-t-2xl bg-gradient-to-br ${meta.gradient}`}>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{plan.name}</h3>
                      {plan.description && (
                        <p className="text-sm text-gray-500 mt-0.5">{plan.description}</p>
                      )}
                    </div>
                    <div className={`w-10 h-10 rounded-xl ${isPopular ? 'bg-purple-100' : 'bg-white/80'} flex items-center justify-center ${meta.color}`}>
                      <FontAwesomeIcon icon={meta.icon} className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="mt-2">
                    {isFree ? (
                      <p className="text-3xl font-bold text-gray-900">Gratis</p>
                    ) : (
                      <div>
                        <span className="text-3xl font-bold text-gray-900">${plan.price}</span>
                        <span className="text-gray-500 text-sm ml-1">/mes</span>
                      </div>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      {plan.durationDays} días de duración
                    </p>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <ul className="space-y-3 flex-1">
                    {features.map((feat) => {
                      const value = plan[feat.key]
                      const enabled = typeof value === 'boolean' ? value : true
                      const displayValue = typeof value === 'boolean' ? '' : `${value}${feat.suffix}`

                      return (
                        <li key={feat.key} className="flex items-start gap-3 text-sm">
                          {enabled ? (
                            <span className="mt-0.5 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                              <FontAwesomeIcon icon={faCheck} className="w-2.5 h-2.5 text-green-600" />
                            </span>
                          ) : (
                            <span className="mt-0.5 w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                              <FontAwesomeIcon icon={faTimes} className="w-2.5 h-2.5 text-gray-300" />
                            </span>
                          )}
                          <span className={enabled ? 'text-gray-700' : 'text-gray-400'}>
                            {displayValue && <strong>{displayValue} </strong>}
                            {feat.label}
                          </span>
                        </li>
                      )
                    })}
                  </ul>

                  <button
                    onClick={() => handleSubscribe(plan)}
                    disabled={loading === plan.id}
                    className={`mt-6 w-full py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                      isPopular
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-200 hover:shadow-xl hover:-translate-y-0.5'
                        : isFree
                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        : 'bg-primary text-white hover:bg-primary/90'
                    } disabled:opacity-60`}
                  >
                    {loading === plan.id ? (
                      <FontAwesomeIcon icon={faSpinner} className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        {btnLabel}
                        <FontAwesomeIcon icon={faArrowRight} className="w-3 h-3" />
                      </>
                    )}
                  </button>

                  {!isLoggedIn && (
                    <p className="text-xs text-center text-gray-400 mt-3">
                      Inicia sesión para suscribirte
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <p className="text-gray-500 mb-4">¿Tienes dudas sobre qué plan elegir?</p>
          <a
            href="/faq"
            className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
          >
            Ver preguntas frecuentes
            <FontAwesomeIcon icon={faArrowRight} className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  )
}
