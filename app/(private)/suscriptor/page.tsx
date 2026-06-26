// app/(private)/suscriptor/page.tsx
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faHome,
  faEye,
  faHeart,
  faComment,
  faPlus,
  faChartLine,
  faCalendarAlt,
  faClock,
  faAward,
  faBolt,
  faEnvelope,
  faUser,
  faPhone,
  faBuilding,
  faStar,
  faRocket,
  faCrown,
  faArrowRight,
  faThumbsUp,
  faCircleCheck,
  faExclamationTriangle,
  faArrowUp,
  faImage,
  faList,
  faCamera
} from '@fortawesome/free-solid-svg-icons'
import { cn } from '@/lib/utils'

export default async function SuscriptorDashboard() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const [propiedades, subscription] = await Promise.all([
    prisma.property.findMany({
      where: { userId: session.user.id },
      include: {
        images: { where: { isPrimary: true }, take: 1 },
        propertyType: true,
        _count: { select: { likes: true, comments: true } },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.subscription.findFirst({
      where: { userId: session.user.id, status: 'ACTIVE' },
      include: { plan: true },
    }),
  ])

  // Estadísticas generales
  const totalPropiedades = propiedades.length
  const totalPublicadas = propiedades.filter(p => p.status === 'PUBLISHED').length
  const totalVistas = propiedades.reduce((sum, p) => sum + p.viewCount, 0)
  const totalLikes = propiedades.reduce((sum, p) => sum + p._count.likes, 0)
  const totalComentarios = propiedades.reduce((sum, p) => sum + p._count.comments, 0)
  
  const propiedadMasVista = propiedades.length > 0 
    ? propiedades.reduce((max, p) => p.viewCount > max.viewCount ? p : max, propiedades[0])
    : null
  
  const propiedadMasLiked = propiedades.length > 0 
    ? propiedades.reduce((max, p) => p._count.likes > max._count.likes ? p : max, propiedades[0])
    : null

  const ultimasPropiedades = propiedades.slice(0, 5)

  const daysLeft = subscription?.endDate
    ? Math.max(0, Math.ceil((new Date(subscription.endDate).getTime() - Date.now()) / (1000 * 3600 * 24)))
    : null

  const usoPorcentaje = subscription?.plan?.maxProperties 
    ? Math.min(100, Math.round((totalPropiedades / subscription.plan.maxProperties) * 100))
    : 0

  const stats = [
    {
      label: 'Propiedades',
      value: totalPropiedades,
      icon: faHome,
      color: 'text-blue-500',
      bg: 'bg-blue-50',
      border: 'border-blue-100',
      detail: `${totalPublicadas} publicadas`
    },
    {
      label: 'Visitas',
      value: totalVistas,
      icon: faEye,
      color: 'text-green-500',
      bg: 'bg-green-50',
      border: 'border-green-100',
      detail: `${totalPropiedades > 0 ? Math.round(totalVistas / totalPropiedades) : 0} por propiedad`
    },
    {
      label: 'Likes',
      value: totalLikes,
      icon: faHeart,
      color: 'text-red-500',
      bg: 'bg-red-50',
      border: 'border-red-100',
      detail: `${totalPropiedades > 0 ? Math.round(totalLikes / totalPropiedades) : 0} por propiedad`
    },
    {
      label: 'Comentarios',
      value: totalComentarios,
      icon: faComment,
      color: 'text-purple-500',
      bg: 'bg-purple-50',
      border: 'border-purple-100',
      detail: `${totalPropiedades > 0 ? (totalComentarios / totalPropiedades).toFixed(1) : 0} por propiedad`
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
                  <FontAwesomeIcon icon={faChartLine} className="w-8 h-8 text-blue-400" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold tracking-tight text-white">
                    Dashboard
                  </h1>
                  <p className="text-slate-300">
                    Bienvenido de vuelta, {session.user.name || session.user.email}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Badge className="bg-white/10 hover:bg-white/20 text-white border border-white/30 px-5 py-3 text-base backdrop-blur-xl">
                  <FontAwesomeIcon icon={faBuilding} className="mr-2" />
                  {totalPropiedades} propiedades
                </Badge>
                <Button asChild className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
                  <Link href="/suscriptor/propiedades/nueva">
                    <FontAwesomeIcon icon={faPlus} className="mr-2" />
                    Publicar Propiedad
                  </Link>
                </Button>
              </div>
            </div>

            {/* Barra de progreso */}
            <div className="mt-8 max-w-md">
              <div className="flex justify-between text-sm text-white/70 mb-2">
                <span>Actividad general</span>
                <span className="font-medium">{totalPropiedades} propiedades</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 rounded-full transition-all duration-1000"
                  style={{ width: `${Math.min(100, (totalPropiedades / 20) * 100)}%` }}
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
                <p className="text-xs text-muted-foreground mt-2">{stat.detail}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Estado del plan */}
        {subscription && (
          <Card className="border-2 border-primary/20 bg-primary/5 mb-8 overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-blue-500 to-purple-500" />
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex-1 w-full">
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faCrown} className="w-5 h-5 text-amber-500" />
                    <p className="font-semibold text-lg">Plan {subscription.plan.name}</p>
                    {daysLeft !== null && daysLeft <= 7 && (
                      <Badge variant="destructive" className="flex items-center gap-1">
                        <FontAwesomeIcon icon={faClock} className="w-3 h-3" />
                        {daysLeft} días restantes
                      </Badge>
                    )}
                    {daysLeft !== null && daysLeft > 7 && (
                      <Badge variant="default" className="bg-green-100 text-green-700 border-green-200 flex items-center gap-1">
                        <FontAwesomeIcon icon={faCircleCheck} className="w-3 h-3" />
                        {daysLeft} días restantes
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    <FontAwesomeIcon icon={faBuilding} className="w-3 h-3 mr-1" />
                    {subscription.plan.maxProperties} propiedades máximas • 
                    <FontAwesomeIcon icon={faImage} className="w-3 h-3 mx-1" />
                    {subscription.plan.maxImages} imágenes por propiedad
                  </p>
                  <div className="mt-3 max-w-md">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Uso del plan</span>
                      <span className="font-medium">{totalPropiedades} / {subscription.plan.maxProperties}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                      <div 
                        className={cn(
                          "h-full rounded-full transition-all duration-500",
                          usoPorcentaje > 80 ? "bg-red-500" : "bg-primary"
                        )}
                        style={{ width: `${usoPorcentaje}%` }}
                      />
                    </div>
                  </div>
                </div>
                <Button asChild variant="outline" size="sm" className="border-2 hover:border-primary/50 hover:bg-primary/5 whitespace-nowrap">
                  <Link href="/suscriptor/suscripcion">
                    <FontAwesomeIcon icon={faArrowRight} className="mr-2" />
                    Gestionar Plan
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Propiedades destacadas */}
        {(propiedadMasVista || propiedadMasLiked) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {propiedadMasVista && propiedadMasVista.viewCount > 0 && (
              <Card className="border-2 border-gray-100 hover:border-green-200 transition-all">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <FontAwesomeIcon icon={faArrowUp} className="w-4 h-4 text-green-500" />
                    Propiedad más vista
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Link href={`/propiedades/${propiedadMasVista.slug}`} className="block group">
                    <p className="font-semibold text-lg group-hover:text-primary transition-colors">
                      {propiedadMasVista.title}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <FontAwesomeIcon icon={faEye} className="w-3 h-3" />
                        {propiedadMasVista.viewCount} vistas
                      </span>
                      <span className="flex items-center gap-1">
                        <FontAwesomeIcon icon={faHeart} className="w-3 h-3 text-red-500" />
                        {propiedadMasVista._count.likes} likes
                      </span>
                    </div>
                  </Link>
                </CardContent>
              </Card>
            )}
            
            {propiedadMasLiked && propiedadMasLiked._count.likes > 0 && (
              <Card className="border-2 border-gray-100 hover:border-amber-200 transition-all">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <FontAwesomeIcon icon={faAward} className="w-4 h-4 text-amber-500" />
                    Propiedad más popular
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Link href={`/propiedades/${propiedadMasLiked.slug}`} className="block group">
                    <p className="font-semibold text-lg group-hover:text-primary transition-colors">
                      {propiedadMasLiked.title}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <FontAwesomeIcon icon={faHeart} className="w-3 h-3 text-red-500" />
                        {propiedadMasLiked._count.likes} likes
                      </span>
                      <span className="flex items-center gap-1">
                        <FontAwesomeIcon icon={faComment} className="w-3 h-3 text-purple-500" />
                        {propiedadMasLiked._count.comments} comentarios
                      </span>
                    </div>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Últimas propiedades */}
        <Card className="border-2 border-gray-100">
          <CardHeader className="border-b border-gray-100">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FontAwesomeIcon icon={faClock} className="w-5 h-5 text-primary" />
                Últimas Propiedades
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  ({ultimasPropiedades.length} registros)
                </span>
              </CardTitle>
              {totalPropiedades > 5 && (
                <Button asChild variant="ghost" size="sm" className="text-primary">
                  <Link href="/suscriptor/propiedades">
                    Ver todas
                    <FontAwesomeIcon icon={faArrowRight} className="ml-2 w-3 h-3" />
                  </Link>
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {ultimasPropiedades.length === 0 ? (
              <div className="text-center py-12">
                <div className="flex flex-col items-center gap-4">
                  <div className="p-4 bg-gray-100 rounded-full">
                    <FontAwesomeIcon icon={faHome} className="w-12 h-12 text-muted-foreground/50" />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-gray-800">No tienes propiedades</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Publica tu primera propiedad y comienza a recibir visitas
                    </p>
                  </div>
                  <Button asChild className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
                    <Link href="/suscriptor/propiedades/nueva">
                      <FontAwesomeIcon icon={faPlus} className="mr-2" />
                      Publicar primera propiedad
                    </Link>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {ultimasPropiedades.map((p) => (
                  <div 
                    key={p.id} 
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition-all group"
                  >
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0 border-2 border-gray-100 group-hover:border-primary/30 transition-colors">
                      {p.images[0] ? (
                        <img 
                          src={p.images[0].thumbPath} 
                          alt={p.title} 
                          loading="lazy"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                          <FontAwesomeIcon icon={faCamera} className="w-6 h-6 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{p.title}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                        <span className="flex items-center gap-1">
                          <FontAwesomeIcon icon={faEye} className="w-3 h-3" />
                          {p.viewCount}
                        </span>
                        <span className="flex items-center gap-1">
                          <FontAwesomeIcon icon={faHeart} className="w-3 h-3 text-red-500" />
                          {p._count.likes}
                        </span>
                        <span className="flex items-center gap-1">
                          <FontAwesomeIcon icon={faComment} className="w-3 h-3 text-purple-500" />
                          {p._count.comments}
                        </span>
                        <Badge variant={p.status === 'PUBLISHED' ? 'default' : 'outline'} className="text-xs">
                          {p.status === 'PUBLISHED' ? 'Publicada' : 'Borrador'}
                        </Badge>
                      </div>
                    </div>
                    <Button asChild variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link href={`/suscriptor/propiedades/${p.id}/editar`}>
                        <FontAwesomeIcon icon={faArrowRight} />
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}