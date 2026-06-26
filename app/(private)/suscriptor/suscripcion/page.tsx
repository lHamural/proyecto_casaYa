// app/(private)/admin/suscripcion/page.tsx
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { ensureSubscriptionFromSession } from '@/lib/services/subscription'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faCrown,
  faCheckCircle,
  faTimesCircle,
  faClock,
  faCalendarAlt,
  faCreditCard,
  faHistory,
  faGem,
  faRocket,
  faStar,
  faInfinity,
  faArrowRight,
  faBuilding,
  faUser,
  faEnvelope,
  faPhone,
  faEye,
  faList,
  faChartLine,
  faWallet,
  faCoins,
  faRepeat,
  faArrowUp,
  faArrowDown,
  faCircleCheck,
  faExclamationCircle,
  faExclamationTriangle,
  faInfoCircle,
  faBox,
  faLightbulb,
  faGift,
  faMedal,
  faTrophy
} from '@fortawesome/free-solid-svg-icons'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import SuscripcionActual from '@/components/suscripcion/SuscripcionActual'
import HistorialSuscripciones from '@/components/suscripcion/HistorialSuscripcion'
import PlanesDisponibles from '@/components/suscripcion/PlanesDisponibles'

export default async function SuscripcionPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; cancelled?: string; session_id?: string }>
}) {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const { success, cancelled, session_id } = await searchParams

  // Fallback manual si el webhook no se ejecutó
  if (session_id) {
    await ensureSubscriptionFromSession(session_id, session.user.id)
  }

  // Obtener suscripción activa
  const subscriptionActiva = await prisma.subscription.findFirst({
    where: { 
      userId: session.user.id,
      status: 'ACTIVE'
    },
    include: { plan: true },
    orderBy: { createdAt: 'desc' },
  })

  // Obtener historial
  const historial = await prisma.subscription.findMany({
    where: { 
      userId: session.user.id,
    },
    include: { plan: true },
    orderBy: { createdAt: 'desc' },
    take: 5,
  })

  // Obtener planes disponibles
  const planes = await prisma.plan.findMany({
    where: { isActive: true },
    orderBy: { price: 'asc' },
  })

  const planName = subscriptionActiva?.plan?.name || 'Sin plan activo'
  const daysLeft = subscriptionActiva?.endDate
    ? Math.max(0, Math.ceil((new Date(subscriptionActiva.endDate).getTime() - Date.now()) / (1000 * 3600 * 24)))
    : null

  const planColor = subscriptionActiva?.plan?.name?.toLowerCase().includes('premium') 
    ? 'from-amber-500 to-yellow-500' 
    : subscriptionActiva?.plan?.name?.toLowerCase().includes('empresarial')
    ? 'from-purple-500 to-indigo-500'
    : subscriptionActiva?.plan?.name?.toLowerCase().includes('vip')
    ? 'from-rose-500 to-pink-500'
    : 'from-blue-500 to-cyan-500'

  const getStatusBadge = (status: string) => {
    const styles = {
      ACTIVE: 'bg-green-100 text-green-700 border-green-200',
      EXPIRED: 'bg-gray-100 text-gray-700 border-gray-200',
      CANCELLED: 'bg-red-100 text-red-700 border-red-200',
      PENDING: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    }
    const icons = {
      ACTIVE: faCheckCircle,
      EXPIRED: faClock,
      CANCELLED: faTimesCircle,
      PENDING: faClock,
    }
    const labels = {
      ACTIVE: 'Activa',
      EXPIRED: 'Expirada',
      CANCELLED: 'Cancelada',
      PENDING: 'Pendiente',
    }
    return (
      <Badge className={cn("border-2 px-3 py-1", styles[status as keyof typeof styles] || styles.EXPIRED)}>
        <FontAwesomeIcon icon={icons[status as keyof typeof icons] || faClock} className="w-3 h-3 mr-1" />
        {labels[status as keyof typeof labels] || status}
      </Badge>
    )
  }

  const getPlanIcon = (planName: string) => {
    const name = planName?.toLowerCase() || ''
    if (name.includes('vip')) return faCrown
    if (name.includes('premium')) return faGem
    if (name.includes('empresarial')) return faStar
    if (name.includes('profesional')) return faRocket
    return faBuilding
  }

  const getPlanColor = (planName: string) => {
    const name = planName?.toLowerCase() || ''
    if (name.includes('vip')) return 'text-rose-500'
    if (name.includes('premium')) return 'text-amber-500'
    if (name.includes('empresarial')) return 'text-purple-500'
    if (name.includes('profesional')) return 'text-blue-500'
    return 'text-gray-500'
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="container-custom max-w-7xl mx-auto px-6">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 text-white rounded-3xl p-8 mb-8 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(at_top_right,#4f46e520_0%,transparent_50%)]" />
          
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-xl border border-white/20">
                  <FontAwesomeIcon icon={faCrown} className="w-8 h-8 text-amber-400" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold tracking-tight text-white">
                    Mi Suscripción
                  </h1>
                  <p className="text-slate-300">
                    Gestiona tu plan y revisa el uso de tu cuenta
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Badge className={cn(
                  "px-5 py-3 text-base backdrop-blur-xl border transition-all",
                  subscriptionActiva 
                    ? "bg-green-400/10 hover:bg-green-400/20 text-green-300 border-green-400/30"
                    : "bg-gray-400/10 hover:bg-gray-400/20 text-gray-300 border-gray-400/30"
                )}>
                  <FontAwesomeIcon icon={subscriptionActiva ? faCheckCircle : faTimesCircle} className="mr-2" />
                  {subscriptionActiva ? 'Activo' : 'Inactivo'}
                </Badge>
                {subscriptionActiva && (
                  <Badge className={cn(
                    "px-5 py-3 text-base backdrop-blur-xl border transition-all",
                    "bg-white/10 hover:bg-white/20 text-white border-white/30"
                  )}>
                    <FontAwesomeIcon icon={faGem} className="mr-2" />
                    {planName}
                  </Badge>
                )}
              </div>
            </div>

            {/* Barra de progreso del plan */}
            {subscriptionActiva && (
              <div className="mt-8 max-w-md">
                <div className="flex justify-between text-sm text-white/70 mb-2">
                  <span>Progreso del plan</span>
                  <span className="font-medium">{daysLeft} días restantes</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className={cn(
                      "h-full bg-gradient-to-r rounded-full transition-all duration-1000",
                      planColor
                    )}
                    style={{ width: `${Math.min(100, ((30 - (daysLeft || 0)) / 30) * 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Alertas */}
        {success && (
          <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-5 mb-6 flex items-center gap-4 animate-in slide-in-from-top-2 duration-300">
            <div className="p-2.5 bg-green-100 rounded-full">
              <FontAwesomeIcon icon={faCheckCircle} className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="font-semibold text-green-800">¡Pago exitoso!</p>
              <p className="text-sm text-green-700">Tu suscripción ha sido activada correctamente.</p>
            </div>
          </div>
        )}
        {cancelled && (
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-5 mb-6 flex items-center gap-4 animate-in slide-in-from-top-2 duration-300">
            <div className="p-2.5 bg-yellow-100 rounded-full">
              <FontAwesomeIcon icon={faClock} className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="font-semibold text-yellow-800">Pago cancelado</p>
              <p className="text-sm text-yellow-700">El pago fue cancelado. Tu plan actual sigue activo.</p>
            </div>
          </div>
        )}

        {/* Suscripción Actual */}
        {/* Planes Disponibles */}
        <div className="mb-8">
          <PlanesDisponibles
            planes={planes}
            planActual={subscriptionActiva?.plan?.name || 'GRATUITO'}
          />
        </div>

        {/* Historial de Suscripciones */}
      </div>
    </div>
  )
}