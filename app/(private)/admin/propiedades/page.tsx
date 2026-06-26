// app/(private)/admin/propiedades/page.tsx
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faHome, 
  faMapMarkerAlt, 
  faEye, 
  faHeart, 
  faComment, 
  faCalendarAlt,
  faBed,
  faBath,
  faRulerCombined,
  faCar,
  faStar,
  faPencilAlt,
  faClock,
  faBuilding,
  faChartLine,
  faDollarSign,
  faCrown,
  faPlus,
  faList
} from '@fortawesome/free-solid-svg-icons'
import { getPlanLimits } from '@/lib/plan-limits'

const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  PUBLISHED: { label: 'Publicado', variant: 'default' },
  DRAFT: { label: 'Borrador', variant: 'secondary' },
  PAUSED: { label: 'Pausado', variant: 'outline' },
  SOLD: { label: 'Vendido', variant: 'destructive' },
  RENTED: { label: 'Alquilado', variant: 'outline' },
}

export default async function MisPropiedadesPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const [propiedades, limits] = await Promise.all([
    prisma.property.findMany({
      where: { userId: session.user.id },
      include: {
        images: { where: { isPrimary: true }, take: 1 },
        propertyType: true,
        propertyCategory: true,
        _count: { select: { likes: true, comments: true } },
      },
      orderBy: { createdAt: 'desc' },
    }),
    getPlanLimits(session.user.id),
  ])

  const getDaysLeft = (expiresAt: Date | null) => {
    if (!expiresAt) return null
    const days = Math.ceil((new Date(expiresAt).getTime() - new Date().getTime()) / (1000 * 3600 * 24))
    return days > 0 ? days : 0
  }

  const activeCount = propiedades.filter((p) => p.status === 'PUBLISHED').length
  const totalValue = propiedades.reduce((sum, p) => sum + p.price, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
            <FontAwesomeIcon icon={faBuilding} className="text-primary text-xl" />
            Mis Propiedades
          </h1>
          <p className="text-muted-foreground text-sm">Gestiona y publica tu portafolio inmobiliario</p>
        </div>
        {limits?.canPublish && (
          <Button asChild className="shadow-sm hover:shadow transition-all">
            <Link href="/admin/propiedades/nueva">
              <FontAwesomeIcon icon={faPlus} className="mr-2" />
              Nueva Propiedad
            </Link>
          </Button>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Total Propiedades</p>
              <p className="text-2xl font-bold mt-1">{propiedades.length}</p>
            </div>
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
              <FontAwesomeIcon icon={faBuilding} className="text-blue-600 text-lg" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Propiedades Activas</p>
              <p className="text-2xl font-bold mt-1 text-emerald-600">{activeCount}</p>
            </div>
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
              <FontAwesomeIcon icon={faChartLine} className="text-emerald-600 text-lg" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Valor Total Estimado</p>
              <p className="text-2xl font-bold mt-1">${totalValue.toLocaleString()}</p>
            </div>
            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
              <FontAwesomeIcon icon={faDollarSign} className="text-amber-600 text-lg" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Límite del Plan</p>
              <p className="text-2xl font-bold mt-1">{limits?.plan.maxProperties || 0}</p>
            </div>
            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
              <FontAwesomeIcon icon={faCrown} className="text-purple-600 text-lg" />
            </div>
          </div>
        </div>
      </div>

      {/* Alerta Límite */}
      {!limits?.canPublish && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0 text-xl">
            ⚠️
          </div>
          <div className="flex-1">
            <p className="font-medium text-amber-800 text-sm">Límite de propiedades alcanzado</p>
            <p className="text-xs text-amber-700 mt-0.5">
              Has alcanzado el máximo de {limits?.plan.maxProperties} propiedades de tu plan actual.
            </p>
          </div>
          <Button asChild variant="outline" className="border-amber-300 text-amber-700 hover:bg-amber-50 whitespace-nowrap">
            <Link href="/admin/suscripcion">Actualizar Plan</Link>
          </Button>
        </div>
      )}

      {/* Lista de Propiedades */}
      {propiedades.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-200">
          <div className="mx-auto w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center mb-4">
            <FontAwesomeIcon icon={faHome} className="text-gray-400 text-3xl" />
          </div>
          <h3 className="text-lg font-semibold mb-1">No tienes propiedades aún</h3>
          <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">Publica tu primera propiedad y comienza a vender o alquilar</p>
          <Button asChild>
            <Link href="/admin/propiedades/nueva">
              <FontAwesomeIcon icon={faPlus} className="mr-2" />
              Publicar Primera Propiedad
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {propiedades.map((p) => {
            const daysLeft = getDaysLeft(p.expiresAt)
            const status = statusConfig[p.status] || statusConfig.DRAFT

            return (
              <div
                key={p.id}
                className="group bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex flex-col sm:flex-row gap-4 p-4">
                  {/* Imagen */}
                  <Link
                    href={`/admin/propiedades/${p.id}/editar`}
                    className="sm:w-48 md:w-56 flex-shrink-0"
                  >
                    <div className="relative h-36 sm:h-40 rounded-lg overflow-hidden bg-gray-50">
                      {p.images[0] ? (
                        <Image
                          src={p.images[0].thumbPath}
                          alt={p.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, 224px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FontAwesomeIcon icon={faHome} className="text-gray-300 text-3xl" />
                        </div>
                      )}
                      {p.isHighlighted && (
                        <div className="absolute top-2 left-2">
                          <span className="inline-flex items-center gap-1 bg-amber-500 text-white text-[10px] font-medium px-2.5 py-1 rounded-full shadow-lg">
                            <FontAwesomeIcon icon={faStar} className="text-xs" />
                            Destacada
                          </span>
                        </div>
                      )}
                      <div className="absolute bottom-2 right-2">
                        <span className="inline-flex items-center gap-1 bg-black/60 backdrop-blur-sm text-white text-[10px] font-medium px-2.5 py-1 rounded-full">
                          <FontAwesomeIcon icon={faEye} className="text-xs" />
                          {p.viewCount}
                        </span>
                      </div>
                    </div>
                  </Link>

                  {/* Información */}
                  <div className="flex-1 min-w-0 flex flex-col">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <Link href={`/admin/propiedades/${p.id}/editar`}>
                            <h3 className="font-semibold text-base leading-tight hover:text-primary transition-colors line-clamp-2">
                              {p.title}
                            </h3>
                          </Link>
                          <div className="flex items-center gap-1.5 mt-1 text-xs text-gray-500">
                            <FontAwesomeIcon icon={faMapMarkerAlt} className="text-gray-400" />
                            <span>{p.city}, {p.department}</span>
                            <span className="w-0.5 h-0.5 rounded-full bg-gray-300" />
                            <span className="text-gray-400">{p.propertyType?.name}</span>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="text-lg font-bold text-primary">
                            {p.price.toLocaleString()}
                            <span className="text-xs font-normal text-gray-400 ml-0.5">{p.currency}</span>
                          </div>
                          <Badge variant={status.variant} className="text-[10px] text-white px-2 py-0.5 mt-1">
                            {status.label}
                          </Badge>
                        </div>
                      </div>

                      {/* Características */}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2.5 text-xs text-gray-500">
                        {p.bedrooms && (
                          <span className="inline-flex items-center gap-1">
                            <FontAwesomeIcon icon={faBed} className="text-gray-400" />
                            {p.bedrooms}
                          </span>
                        )}
                        {p.bathrooms && (
                          <span className="inline-flex items-center gap-1">
                            <FontAwesomeIcon icon={faBath} className="text-gray-400" />
                            {p.bathrooms}
                          </span>
                        )}
                        {p.area && (
                          <span className="inline-flex items-center gap-1">
                            <FontAwesomeIcon icon={faRulerCombined} className="text-gray-400" />
                            {p.area} m²
                          </span>
                        )}
                        {p.garage && (
                          <span className="inline-flex items-center gap-1">
                            <FontAwesomeIcon icon={faCar} className="text-gray-400" />
                            Garaje
                          </span>
                        )}
                        {daysLeft !== null && daysLeft <= 30 && (
                          <span className={`inline-flex items-center gap-1 text-xs font-medium ${
                            daysLeft <= 7 ? 'text-red-500' : 'text-amber-500'
                          }`}>
                            <FontAwesomeIcon icon={faClock} className="text-xs" />
                            {daysLeft} días
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        <span className="inline-flex items-center gap-1">
                          <FontAwesomeIcon icon={faCalendarAlt} className="text-xs" />
                          {new Date(p.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <FontAwesomeIcon icon={faHeart} className="text-xs" />
                          {p._count.likes}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <FontAwesomeIcon icon={faComment} className="text-xs" />
                          {p._count.comments}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <Button asChild variant="ghost" size="sm" className="h-7 w-7 p-0 rounded-md text-gray-400 hover:text-primary hover:bg-primary/5">
                          <Link href={`/propiedades/${p.id}`}>
                            <FontAwesomeIcon icon={faEye} className="text-sm" />
                          </Link>
                        </Button>
                        <Button asChild variant="ghost" size="sm" className="h-7 w-7 p-0 rounded-md text-gray-400 hover:text-primary hover:bg-primary/5">
                          <Link href={`/admin/propiedades/${p.id}/editar`}>
                            <FontAwesomeIcon icon={faPencilAlt} className="text-sm" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}