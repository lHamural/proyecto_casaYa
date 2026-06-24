// app/(private)/admin/propiedades/page.tsx
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faPlus,
  faPencil,
  faEye,
  faHome,
  faMapPin,
  faCalendarAlt,
  faHeart,
  faComment,
  faArrowUp,
  faBuilding,
  faDollarSign,
  faClock,
  faRocket,
  faStar,
  faFire,
  faCrown,
  faBed,
  faBath,
  faRulerCombined,
  faCar,
  faExclamationTriangle,
  faArrowRight,
  faList,
 faTableCells,
  faFilter,
  faSort,
  faSearch
} from '@fortawesome/free-solid-svg-icons'
import { cn } from '@/lib/utils'
import { getPlanLimits } from '@/lib/plan-limits'

const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; color: string }> = {
  PUBLISHED: { label: 'Publicado', variant: 'default', color: 'bg-green-100 text-green-700 border-green-200' },
  DRAFT: { label: 'Borrador', variant: 'secondary', color: 'bg-gray-100 text-gray-700 border-gray-200' },
  PAUSED: { label: 'Pausado', variant: 'outline', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  SOLD: { label: 'Vendido', variant: 'destructive', color: 'bg-red-100 text-red-700 border-red-200' },
  RENTED: { label: 'Alquilado', variant: 'outline', color: 'bg-blue-100 text-blue-700 border-blue-200' },
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
  const totalVistas = propiedades.reduce((sum, p) => sum + p.viewCount, 0)

  const stats = [
    {
      label: 'Total Propiedades',
      value: propiedades.length,
      icon: faBuilding,
      color: 'text-blue-500',
      bg: 'bg-blue-50',
      border: 'border-blue-100'
    },
    {
      label: 'Propiedades Activas',
      value: activeCount,
      icon: faArrowUp,
      color: 'text-emerald-500',
      bg: 'bg-emerald-50',
      border: 'border-emerald-100'
    },
    {
      label: 'Valor Total',
      value: `$${totalValue.toLocaleString()}`,
      icon: faDollarSign,
      color: 'text-amber-500',
      bg: 'bg-amber-50',
      border: 'border-amber-100'
    },
    {
      label: 'Visitas Totales',
      value: totalVistas,
      icon: faEye,
      color: 'text-purple-500',
      bg: 'bg-purple-50',
      border: 'border-purple-100'
    },
  ]

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
                  <FontAwesomeIcon icon={faBuilding} className="w-8 h-8 text-blue-400" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold tracking-tight text-white">
                    Mis Propiedades
                  </h1>
                  <p className="text-slate-300">
                    Administra tu portafolio inmobiliario
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Badge className="bg-white/10 hover:bg-white/20 text-white border border-white/30 px-5 py-3 text-base backdrop-blur-xl">
                  <FontAwesomeIcon icon={faHome} className="mr-2" />
                  {propiedades.length} propiedades
                </Badge>
                {limits?.canPublish && (
                  <Button asChild className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
                    <Link href="/suscriptor/propiedades/nueva">
                      <FontAwesomeIcon icon={faPlus} className="mr-2" />
                      Nueva Propiedad
                    </Link>
                  </Button>
                )}
              </div>
            </div>

            {/* Barra de progreso */}
            <div className="mt-8 max-w-md">
              <div className="flex justify-between text-sm text-white/70 mb-2">
                <span>Uso del plan</span>
                <span className="font-medium">{propiedades.length} / {limits?.plan.maxProperties || 0}</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 rounded-full transition-all duration-1000"
                  style={{ width: `${Math.min(100, (propiedades.length / (limits?.plan.maxProperties || 1)) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <Card key={stat.label} className={cn("border-2", stat.border, "hover:shadow-lg transition-shadow")}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                    <p className={cn("text-3xl font-bold mt-1", stat.color)}>{stat.value}</p>
                  </div>
                  <div className={cn("p-3 rounded-2xl", stat.bg)}>
                    <FontAwesomeIcon icon={stat.icon} className={cn("w-6 h-6", stat.color)} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Alerta límite */}
        {!limits?.canPublish && (
          <div className="bg-amber-50/80 backdrop-blur-sm border-2 border-amber-200 rounded-xl px-5 py-4 flex items-center justify-between flex-wrap gap-3 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                <FontAwesomeIcon icon={faExclamationTriangle} className="text-amber-600" />
              </div>
              <p className="text-sm text-amber-700">
                Has alcanzado el límite de {limits?.plan.maxProperties} propiedades de tu plan actual.
              </p>
            </div>
            <Button asChild size="sm" variant="outline" className="border-amber-300 text-amber-700 hover:bg-amber-50">
              <Link href="/dashboard/suscripcion">
                <FontAwesomeIcon icon={faArrowRight} className="mr-2" />
                Actualizar Plan
              </Link>
            </Button>
          </div>
        )}

        {/* Lista de propiedades */}
        {propiedades.length === 0 ? (
          <div className="text-center py-20 rounded-2xl bg-gradient-to-br from-muted/30 to-muted/10 border-2 border-dashed border-gray-200">
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 bg-gray-100 rounded-full">
                <FontAwesomeIcon icon={faHome} className="w-12 h-12 text-muted-foreground/50" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">No hay propiedades</h3>
                <p className="text-sm text-muted-foreground mb-5">
                  Comienza publicando tu primera propiedad
                </p>
              </div>
              <Button asChild className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
                <Link href="/suscriptor/propiedades/nueva">
                  <FontAwesomeIcon icon={faPlus} className="mr-2" />
                  Publicar Propiedad
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {propiedades.map((p) => {
              const daysLeft = getDaysLeft(p.expiresAt)
              const status = statusConfig[p.status] || statusConfig.DRAFT

              return (
                <div
                  key={p.id}
                  className="group bg-white rounded-2xl border-2 border-gray-100 hover:border-primary/30 hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary/0 via-primary/30 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="p-5">
                    <div className="flex flex-col md:flex-row gap-5">
                      {/* Imagen */}
                      <Link
                        href={`/admin/propiedades/${p.id}/editar`}
                        className="block md:w-48 lg:w-56 flex-shrink-0"
                      >
                        <div className="relative h-32 md:h-28 rounded-xl overflow-hidden bg-gradient-to-br from-muted to-muted/50 border-2 border-gray-100 group-hover:border-primary/30 transition-colors">
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
                              <FontAwesomeIcon icon={faHome} className="w-8 h-8 text-muted-foreground/30" />
                            </div>
                          )}
                          {p.isHighlighted && (
                            <div className="absolute top-2 left-2">
                              <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                                <FontAwesomeIcon icon={faStar} className="w-3 h-3" />
                                Destacada
                              </div>
                            </div>
                          )}
                        </div>
                      </Link>

                      {/* Información */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <Link href={`/suscriptor/propiedades/${p.id}/editar`}>
                              <h3 className="font-semibold text-lg hover:text-primary transition-colors line-clamp-1">
                                {p.title}
                              </h3>
                            </Link>
                            <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <FontAwesomeIcon icon={faMapPin} className="w-3.5 h-3.5" />
                                <span>{p.city}, {p.department}</span>
                              </div>
                              <span className="text-gray-300">•</span>
                              <span>{p.propertyType.name}</span>
                              <span className="text-gray-300">•</span>
                              <span>{p.propertyCategory.name.replace('_', ' ')}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-primary">
                              {p.price.toLocaleString()} <span className="text-sm font-normal">{p.currency}</span>
                            </div>
                            <Badge className={cn("border-2 mt-1", status.color)}>
                              {status.label}
                            </Badge>
                          </div>
                        </div>

                        {/* Características */}
                        <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-muted-foreground">
                          {p.bedrooms && (
                            <div className="flex items-center gap-1.5">
                              <FontAwesomeIcon icon={faBed} className="w-4 h-4" />
                              <span>{p.bedrooms} dormitorios</span>
                            </div>
                          )}
                          {p.bathrooms && (
                            <div className="flex items-center gap-1.5">
                              <FontAwesomeIcon icon={faBath} className="w-4 h-4" />
                              <span>{p.bathrooms} baños</span>
                            </div>
                          )}
                          {p.area && (
                            <div className="flex items-center gap-1.5">
                              <FontAwesomeIcon icon={faRulerCombined} className="w-4 h-4" />
                              <span>{p.area} m²</span>
                            </div>
                          )}
                          {p.garage && (
                            <div className="flex items-center gap-1.5">
                              <FontAwesomeIcon icon={faCar} className="w-4 h-4" />
                              <span>Garaje</span>
                            </div>
                          )}
                        </div>

                        {/* Footer */}
                        <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-3 border-t border-gray-100">
                          <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1.5">
                              <FontAwesomeIcon icon={faCalendarAlt} className="w-3.5 h-3.5" />
                              <span>{new Date(p.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-1">
                                <FontAwesomeIcon icon={faHeart} className="w-3.5 h-3.5 text-red-500" />
                                <span>{p._count.likes} likes</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <FontAwesomeIcon icon={faComment} className="w-3.5 h-3.5 text-purple-500" />
                                <span>{p._count.comments} comentarios</span>
                              </div>
                            </div>
                            {daysLeft && daysLeft <= 30 && (
                              <div className={`flex items-center gap-1.5 ${daysLeft <= 7 ? 'text-red-500' : 'text-amber-500'}`}>
                                <FontAwesomeIcon icon={faClock} className="w-3.5 h-3.5" />
                                <span>{daysLeft} días restantes</span>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            <Button asChild variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors">
                              <Link href={`/propiedades/${p.id}`}>
                                <FontAwesomeIcon icon={faEye} className="w-4 h-4" />
                              </Link>
                            </Button>
                            <Button asChild variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors">
                              <Link href={`/suscriptor/propiedades/${p.id}/editar`}>
                                <FontAwesomeIcon icon={faPencil} className="w-4 h-4" />
                              </Link>
                            </Button>
                          </div>
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
    </div>
  )
}