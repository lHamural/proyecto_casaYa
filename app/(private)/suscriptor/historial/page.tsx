// app/(private)/admin/suscripcion/page.tsx
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { getPlanLimits } from '@/lib/plan-limits'
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
  faInfoCircle
} from '@fortawesome/free-solid-svg-icons'
import { cn } from '@/lib/utils'
import Link from 'next/link'

export default async function SuscripcionPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; cancelled?: string; session_id?: string }>
}) {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const { success, cancelled } = await searchParams

  const [subscriptionActiva, historial] = await Promise.all([
    prisma.subscription.findFirst({
      where: {
        userId: session.user.id,
        status: 'ACTIVE'
      },
      include: { plan: true },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.subscription.findMany({
      where: {
        userId: session.user.id,
      },
      include: { plan: true },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
  ])

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
      <div className="container-custom max-w-6xl mx-auto px-6">
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
                    Revisa el estado de tu suscripción actual
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
        {subscriptionActiva ? (
          <Card className="border-2 border-gray-100 overflow-hidden mb-8 hover:shadow-lg transition-all">
            <div className={cn("h-1.5 bg-gradient-to-r", planColor)} />
            <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <FontAwesomeIcon icon={faCrown} className="text-amber-500" />
                  Suscripción Actual
                </CardTitle>
                {getStatusBadge(subscriptionActiva.status)}
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="p-2 bg-amber-100 rounded-lg">
                      <FontAwesomeIcon icon={faGem} className={cn("w-5 h-5", getPlanColor(subscriptionActiva.plan.name))} />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Plan</p>
                      <p className="font-bold text-lg">{subscriptionActiva.plan.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FontAwesomeIcon icon={faCalendarAlt} className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Fecha de inicio</p>
                      <p className="font-medium">
                        {new Date(subscriptionActiva.createdAt).toLocaleDateString('es-ES', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-red-50 rounded-xl">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <FontAwesomeIcon icon={faCalendarAlt} className="w-5 h-5 text-red-500" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Fecha de expiración</p>
                      <p className="font-medium">
                        {subscriptionActiva.endDate
                          ? new Date(subscriptionActiva.endDate).toLocaleDateString('es-ES', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric'
                          }) : 'Sin fecha'}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <FontAwesomeIcon icon={faCreditCard} className="w-5 h-5 text-purple-500" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Precio</p>
                      <p className="font-bold text-2xl text-primary">
                        ${subscriptionActiva.plan.price}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl">
                    <div className="p-2 bg-emerald-100 rounded-lg">
                      <FontAwesomeIcon icon={faInfinity} className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Duración</p>
                      <p className="font-medium">{subscriptionActiva.plan.durationDays} días</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl">
                    <div className="p-2 bg-amber-100 rounded-lg">
                      <FontAwesomeIcon icon={faClock} className="w-5 h-5 text-amber-500" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Días restantes</p>
                      <p className={cn(
                        "font-bold text-lg",
                        daysLeft && daysLeft <= 7 ? "text-red-500" : "text-emerald-500"
                      )}>
                        {daysLeft} días
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100">
                <Button asChild className="w-full bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
                  <Link href="/admin/planes">
                    <FontAwesomeIcon icon={faArrowRight} className="mr-2" />
                    Cambiar Plan
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-2 border-gray-100 mb-8">
            <CardContent className="pt-12 pb-12 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="p-4 bg-gray-100 rounded-full">
                  <FontAwesomeIcon icon={faTimesCircle} className="w-12 h-12 text-gray-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">Sin suscripción activa</h3>
                  <p className="text-gray-500 mt-1 max-w-sm">
                    No tienes ninguna suscripción activa actualmente.
                    Adquiere un plan para publicar tus propiedades.
                  </p>
                </div>
                <Button asChild className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
                  <Link href="/admin/planes">
                    <FontAwesomeIcon icon={faRocket} className="mr-2" />
                    Ver Planes Disponibles
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Historial de Suscripciones */}
        {historial.length > 0 && (
          <Card className="border-2 border-gray-100">
            <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <FontAwesomeIcon icon={faHistory} className="w-5 h-5 text-primary" />
                  Historial de Suscripciones
                  <span className="ml-2 text-sm font-normal text-muted-foreground">
                    (últimas {historial.length})
                  </span>
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {historial.map((item) => {
                  const isActive = item.status === 'ACTIVE'
                  return (
                    <div
                      key={item.id}
                      className={cn(
                        "flex flex-col md:flex-row md:items-center justify-between p-4 rounded-xl border-2 transition-all hover:shadow-md",
                        isActive
                          ? "border-green-200 bg-green-50/30 hover:border-green-300"
                          : "border-gray-100 hover:border-gray-200"
                      )}
                    >
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "p-2.5 rounded-lg",
                          isActive ? "bg-green-100" : "bg-gray-100"
                        )}>
                          <FontAwesomeIcon
                            icon={getPlanIcon(item.plan.name)}
                            className={cn("w-5 h-5", getPlanColor(item.plan.name))}
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-3">
                            <p className="font-semibold text-lg">{item.plan.name}</p>
                            {getStatusBadge(item.status)}
                          </div>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mt-1">
                            <span className="flex items-center gap-1.5">
                              <FontAwesomeIcon icon={faCalendarAlt} className="w-3.5 h-3.5" />
                              Inicio: {new Date(item.createdAt).toLocaleDateString('es-ES', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <FontAwesomeIcon icon={faCalendarAlt} className="w-3.5 h-3.5" />
                              Expira: {item.endDate
                                ? new Date(item.endDate).toLocaleDateString('es-ES', {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric'
                                }) : 'Sin fecha'}
                            </span>
                            {item.status === 'CANCELLED' && (
                              <span className="flex items-center gap-1.5 text-red-500">
                                <FontAwesomeIcon icon={faTimesCircle} className="w-3.5 h-3.5" />
                                Cancelada
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 mt-3 md:mt-0">
                        <span className="font-bold text-2xl text-primary">
                          ${item.plan.price}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {item.plan.durationDays} días
                        </span>
                        {isActive && (
                          <Badge className="bg-green-500 text-white border-0 px-3 py-1">
                            <FontAwesomeIcon icon={faCheckCircle} className="w-3 h-3 mr-1.5" />
                            Actual
                          </Badge>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}