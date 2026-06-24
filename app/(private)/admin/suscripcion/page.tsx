// app/(private)/admin/suscripcion/page.tsx
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import SuscripcionActual from '@/components/suscripcion/SuscripcionActual'
import PlanesDisponibles from '@/components/suscripcion/PlanesDisponibles'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faCrown,
  faCheckCircle,
  faExclamationTriangle,
  faCreditCard,
  faRocket
} from '@fortawesome/free-solid-svg-icons'
import { Badge } from '@/components/ui/badge'

export default async function SuscripcionPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; cancelled?: string; session_id?: string }>
}) {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const { success, cancelled } = await searchParams

  // Obtener suscripción activa
  const subscriptionActiva = await prisma.subscription.findFirst({
    where: { 
      userId: session.user.id,
      status: 'ACTIVE'
    },
    include: { plan: true },
    orderBy: { createdAt: 'desc' },
  })

  // Obtener planes disponibles
  const planes = await prisma.plan.findMany({
    where: { isActive: true },
    orderBy: { price: 'asc' },
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 text-white py-16 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(at_top_right,#4f46e520_0%,transparent_50%)]" />
        
        <div className="container-custom relative z-10 max-w-6xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="p-4 bg-white/10 rounded-3xl backdrop-blur-xl border border-white/20">
                  <FontAwesomeIcon icon={faCrown} className="w-9 h-9 text-yellow-400" />
                </div>
                <h1 className="text-4xl lg:text-5xl font-bold tracking-tighter">
                  Mi Suscripción
                </h1>
              </div>
              <p className="text-xl text-slate-300">
                Gestiona tu plan y revisa el uso de tu cuenta
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {subscriptionActiva ? (
                <Badge className="bg-green-500/20 text-green-300 border border-green-500/30 px-6 py-3 text-sm backdrop-blur-sm">
                  <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
                  Plan activo: {subscriptionActiva.plan.name}
                </Badge>
              ) : (
                <Badge className="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-6 py-3 text-sm backdrop-blur-sm">
                  <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" />
                  Sin plan activo
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container-custom max-w-6xl mx-auto px-6 py-10">
        {/* Alertas */}
        {success && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 mb-8 flex items-center gap-4 shadow-sm">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <FontAwesomeIcon icon={faCheckCircle} className="text-green-600 text-2xl" />
            </div>
            <div>
              <p className="font-semibold text-green-800">¡Pago exitoso!</p>
              <p className="text-sm text-green-700">Tu suscripción ha sido activada correctamente.</p>
            </div>
          </div>
        )}
        {cancelled && (
          <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-2xl p-6 mb-8 flex items-center gap-4 shadow-sm">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <FontAwesomeIcon icon={faExclamationTriangle} className="text-amber-600 text-2xl" />
            </div>
            <div>
              <p className="font-semibold text-amber-800">Pago cancelado</p>
              <p className="text-sm text-amber-700">Tu plan actual sigue activo.</p>
            </div>
          </div>
        )}

        {/* Suscripción actual */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3 mb-6">
            <span className="w-1 h-8 bg-primary rounded-full" />
            <FontAwesomeIcon icon={faCreditCard} className="text-primary" />
            Suscripción Actual
          </h2>
          <SuscripcionActual subscription={subscriptionActiva}  />
        </div>

        {/* Planes disponibles */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3 mb-6">
            <span className="w-1 h-8 bg-primary rounded-full" />
            <FontAwesomeIcon icon={faRocket} className="text-primary" />
            Planes Disponibles
          </h2>
          <PlanesDisponibles
            planes={planes}
            planActual={subscriptionActiva?.plan?.name || 'GRATUITO'}
          />
        </div>
      </div>
    </div>
  )
}