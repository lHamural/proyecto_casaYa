import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Home, 
  Eye, 
  Heart, 
  MessageCircle, 
  Plus, 
  TrendingUp,
  Calendar,
  Clock,
  Award,
  Zap
} from 'lucide-react'

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
  
  // Propiedad más popular
  const propiedadMasVista = propiedades.length > 0 
    ? propiedades.reduce((max, p) => p.viewCount > max.viewCount ? p : max, propiedades[0])
    : null
  
  const propiedadMasLiked = propiedades.length > 0 
    ? propiedades.reduce((max, p) => p._count.likes > max._count.likes ? p : max, propiedades[0])
    : null

  // Últimas 5 propiedades
  const ultimasPropiedades = propiedades.slice(0, 5)

  // Días restantes del plan
  const daysLeft = subscription?.endDate
    ? Math.max(0, Math.ceil((new Date(subscription.endDate).getTime() - Date.now()) / (1000 * 3600 * 24)))
    : null

  // Porcentaje de uso del plan
  const usoPorcentaje = subscription?.plan?.maxProperties 
    ? Math.min(100, Math.round((totalPropiedades / subscription.plan.maxProperties) * 100))
    : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground text-sm">
            Bienvenido de vuelta, {session.user.name || session.user.email}
          </p>
        </div>
        <Button asChild>
          <Link href="/suscriptor/propiedades/nueva">
            <Plus className="w-4 h-4 mr-2" />
            Publicar Propiedad
          </Link>
        </Button>
      </div>

      {/* Stats principales */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{totalPropiedades}</p>
                <p className="text-xs text-muted-foreground">Propiedades</p>
              </div>
              <div className="bg-blue-50 p-2 rounded-full">
                <Home className="w-5 h-5 text-blue-500" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {totalPublicadas} publicadas
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{totalVistas}</p>
                <p className="text-xs text-muted-foreground">Visitas totales</p>
              </div>
              <div className="bg-green-50 p-2 rounded-full">
                <Eye className="w-5 h-5 text-green-500" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {totalPropiedades > 0 ? Math.round(totalVistas / totalPropiedades) : 0} por propiedad
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{totalLikes}</p>
                <p className="text-xs text-muted-foreground">Likes recibidos</p>
              </div>
              <div className="bg-red-50 p-2 rounded-full">
                <Heart className="w-5 h-5 text-red-500" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {totalPropiedades > 0 ? Math.round(totalLikes / totalPropiedades) : 0} por propiedad
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{totalComentarios}</p>
                <p className="text-xs text-muted-foreground">Comentarios</p>
              </div>
              <div className="bg-purple-50 p-2 rounded-full">
                <MessageCircle className="w-5 h-5 text-purple-500" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {totalPropiedades > 0 ? (totalComentarios / totalPropiedades).toFixed(1) : 0} por propiedad
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Estado del plan */}
      {subscription && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-primary" />
                  <p className="font-semibold">Plan {subscription.plan.name}</p>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {subscription.plan.maxProperties} propiedades máximas • {subscription.plan.maxImages} imágenes por propiedad
                </p>
                <div className="mt-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Uso del plan</span>
                    <span>{totalPropiedades} / {subscription.plan.maxProperties}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary rounded-full h-2 transition-all"
                      style={{ width: `${usoPorcentaje}%` }}
                    />
                  </div>
                </div>
              </div>
              {daysLeft !== null && (
                <Badge variant={daysLeft <= 7 ? 'destructive' : 'default'} className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {daysLeft} días restantes
                </Badge>
              )}
              <Button asChild variant="outline" size="sm">
                <Link href="/suscriptor/suscripcion">Gestionar Plan</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Propiedades destacadas */}
      {(propiedadMasVista || propiedadMasLiked) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {propiedadMasVista && propiedadMasVista.viewCount > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  Propiedad más vista
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Link href={`/propiedades/${propiedadMasVista.slug}`} className="block group">
                  <p className="font-semibold group-hover:text-primary transition-colors">
                    {propiedadMasVista.title}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">👁 {propiedadMasVista.viewCount} vistas</span>
                    <span>❤️ {propiedadMasVista._count.likes} likes</span>
                  </div>
                </Link>
              </CardContent>
            </Card>
          )}
          
          {propiedadMasLiked && propiedadMasLiked._count.likes > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-500" />
                  Propiedad más popular
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Link href={`/propiedades/${propiedadMasLiked.slug}`} className="block group">
                  <p className="font-semibold group-hover:text-primary transition-colors">
                    {propiedadMasLiked.title}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span>❤️ {propiedadMasLiked._count.likes} likes</span>
                    <span className="flex items-center gap-1">💬 {propiedadMasLiked._count.comments} comentarios</span>
                  </div>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Últimas propiedades */}
      <Card>
        <CardHeader>
          <CardTitle>Últimas Propiedades</CardTitle>
        </CardHeader>
        <CardContent>
          {ultimasPropiedades.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Home className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No tienes propiedades publicadas</p>
              <Button asChild variant="link" className="mt-2">
                <Link href="/suscriptor/propiedades/nueva">Publicar primera propiedad</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {ultimasPropiedades.map((p) => (
                <div key={p.id} className="flex items-center gap-3 p-2 hover:bg-muted/50 rounded-lg transition-colors">
                  <div className="w-12 h-12 rounded-md overflow-hidden bg-muted flex-shrink-0">
                    {p.images[0] ? (
                      <img src={p.images[0].thumbPath} alt={p.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Home className="w-5 h-5 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{p.title}</p>
                    <p className="text-xs text-muted-foreground">{p.propertyType.name}</p>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">👁 {p.viewCount}</span>
                    <span className="flex items-center gap-1">❤️ {p._count.likes}</span>
                    <span className="flex items-center gap-1">💬 {p._count.comments}</span>
                  </div>
                  <Button asChild variant="ghost" size="sm">
                    <Link href={`/suscriptor/propiedades/${p.id}/editar`}>Editar</Link>
                  </Button>
                </div>
              ))}
              {totalPropiedades > 5 && (
                <Button asChild variant="link" className="w-full mt-2">
                  <Link href="/suscriptor/propiedades">Ver todas las propiedades ({totalPropiedades})</Link>
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 