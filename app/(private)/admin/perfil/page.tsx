// app/(private)/perfil/page.tsx
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faUser, 
  faEnvelope, 
  faPhone, 
  faCalendarAlt, 
  faShieldAlt, 
  faSave,
  faBuilding,
  faHome,
  faCrown,
  faUserCog,
  faUserCheck,
  faClock,
  faGem,
  faRocket,
  faStar,
  faEdit,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons'
import PerfilForm from '@/components/perfil/PerfilForm'
import AvatarUpload from '@/components/perfil/AvatarUpload'
import { cn } from '@/lib/utils'

export default async function PerfilPage() {
  const session = await auth()
  if (!session?.user) {
    redirect('/login')
  }

  const usuario = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      subscriptions: {
        include: { plan: true },
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
      _count: {
        select: {
          properties: true,
        },
      },
    },
  })

  if (!usuario) {
    redirect('/login')
  }

  const subscriptionActiva = usuario.subscriptions[0] || null

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const rolColors: Record<string, string> = {
    SUPERADMIN: 'bg-red-100 text-red-700 border-red-200',
    INMOBILIARIA: 'bg-blue-100 text-blue-700 border-blue-200',
    PROPIETARIO: 'bg-green-100 text-green-700 border-green-200',
    VISITANTE: 'bg-gray-100 text-gray-700 border-gray-200',
  }

  const rolIcons: Record<string, any> = {
    SUPERADMIN: faShieldAlt,
    INMOBILIARIA: faBuilding,
    PROPIETARIO: faHome,
    VISITANTE: faUser,
  }

  const getPlanIcon = (planName: string) => {
    const name = planName?.toLowerCase() || ''
    if (name.includes('vip')) return faCrown
    if (name.includes('premium')) return faGem
    if (name.includes('empresarial')) return faStar
    if (name.includes('profesional')) return faRocket
    return faUserCog
  }

  const getPlanColor = (planName: string) => {
    const name = planName?.toLowerCase() || ''
    if (name.includes('vip')) return 'from-rose-500 to-pink-500'
    if (name.includes('premium')) return 'from-amber-500 to-yellow-500'
    if (name.includes('empresarial')) return 'from-purple-500 to-indigo-500'
    if (name.includes('profesional')) return 'from-blue-500 to-cyan-500'
    return 'from-gray-500 to-gray-600'
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="container-custom max-w-7xl mx-auto px-6">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 text-white rounded-3xl p-10 mb-8 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(at_top_right,#4f46e520_0%,transparent_50%)]" />
          
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-xl border border-white/20">
                  <FontAwesomeIcon icon={faUser} className="w-8 h-8 text-blue-400" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold tracking-tight text-white">
                    Mi Perfil
                  </h1>
                  <p className="text-slate-300">
                    Gestiona tu información personal y configuración de cuenta
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Badge className="bg-white/10 hover:bg-white/20 text-white border border-white/30 px-5 py-3 text-base backdrop-blur-xl">
                  <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                  Miembro desde {new Date(usuario.createdAt).toLocaleDateString('es-ES', {
                    month: 'long',
                    year: 'numeric'
                  })}
                </Badge>
                <Badge className={cn(
                  "px-5 py-3 text-base backdrop-blur-xl border transition-all",
                  subscriptionActiva 
                    ? "bg-green-400/10 hover:bg-green-400/20 text-green-300 border-green-400/30"
                    : "bg-gray-400/10 hover:bg-gray-400/20 text-gray-300 border-gray-400/30"
                )}>
                  <FontAwesomeIcon icon={subscriptionActiva ? faUserCheck : faClock} className="mr-2" />
                  {subscriptionActiva ? 'Suscripción activa' : 'Sin suscripción'}
                </Badge>
              </div>
            </div>

            {/* Barra de progreso */}
            <div className="mt-8 max-w-md">
              <div className="flex justify-between text-sm text-white/70 mb-2">
                <span>Completitud del perfil</span>
                <span className="font-medium">85%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 rounded-full transition-all duration-1000"
                  style={{ width: '85%' }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna izquierda - Información del usuario */}
          <div className="lg:col-span-1 space-y-6">
            {/* Avatar y datos básicos */}
            <Card className="border-2 border-gray-100">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="relative">
                    <AvatarUpload
                      avatarUrl={usuario.avatar}
                      userName={usuario.name || 'U'}
                      initials={getInitials(usuario.name || 'U')}
                    />
                  </div>
                  <h3 className="text-xl font-bold mt-4">{usuario.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    <FontAwesomeIcon icon={faEnvelope} className="w-3 h-3" />
                    <span>{usuario.email}</span>
                  </div>
                  <div className="mt-3">
                    <Badge className={cn("px-3 py-1.5 border-2", rolColors[usuario.role])}>
                      <FontAwesomeIcon icon={rolIcons[usuario.role]} className="w-3 h-3 mr-1.5" />
                      {usuario.role}
                    </Badge>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="p-2 bg-blue-50 rounded-full">
                      <FontAwesomeIcon icon={faCalendarAlt} className="w-4 h-4 text-blue-500" />
                    </div>
                    <span className="text-muted-foreground">
                      Miembro desde: <strong>{new Date(usuario.createdAt).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                      })}</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="p-2 bg-emerald-50 rounded-full">
                      <FontAwesomeIcon icon={faBuilding} className="w-4 h-4 text-emerald-500" />
                    </div>
                    <span className="text-muted-foreground">
                      <strong>{usuario._count.properties}</strong> propiedades publicadas
                    </span>
                  </div>
                  {subscriptionActiva && (
                    <div className="flex items-center gap-3 text-sm">
                      <div className="p-2 bg-amber-50 rounded-full">
                        <FontAwesomeIcon icon={faCrown} className="w-4 h-4 text-amber-500" />
                      </div>
                      <span className="text-muted-foreground">
                        Plan: <strong>{subscriptionActiva.plan.name}</strong>
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Plan actual */}
            {subscriptionActiva && (
              <Card className="border-2 border-gray-100 overflow-hidden">
                <div className={cn("h-1.5 bg-gradient-to-r", getPlanColor(subscriptionActiva.plan.name))} />
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm font-medium">
                    <FontAwesomeIcon icon={faCrown} className="w-4 h-4 text-amber-500" />
                    Plan Actual
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon 
                      icon={getPlanIcon(subscriptionActiva.plan.name)} 
                      className={cn("w-5 h-5", getPlanColor(subscriptionActiva.plan.name).replace('from-', 'text-').replace(' to-', ' text-').split(' ')[0])}
                    />
                    <p className="font-bold text-lg">{subscriptionActiva.plan.name}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="p-2 bg-gray-50 rounded-lg">
                      <p className="text-xs text-muted-foreground">Propiedades</p>
                      <p className="font-semibold">{subscriptionActiva.plan.maxProperties}</p>
                    </div>
                    <div className="p-2 bg-gray-50 rounded-lg">
                      <p className="text-xs text-muted-foreground">Imágenes</p>
                      <p className="font-semibold">{subscriptionActiva.plan.maxImages}</p>
                    </div>
                  </div>
                  {subscriptionActiva.endDate && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <FontAwesomeIcon icon={faClock} className="w-3 h-3" />
                      <span>Renovación: {new Date(subscriptionActiva.endDate).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                      })}</span>
                    </div>
                  )}
                  <Button asChild variant="outline" size="sm" className="w-full mt-2 border-2 hover:border-primary/50 hover:bg-primary/5">
                    <a href="/admin/suscripcion">
                      <FontAwesomeIcon icon={faEdit} className="w-3 h-3 mr-2" />
                      Gestionar Plan
                      <FontAwesomeIcon icon={faArrowRight} className="w-3 h-3 ml-2" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Columna derecha - Formulario de edición */}
          <div className="lg:col-span-2">
            <Card className="border-2 border-gray-100">
              <CardHeader className="border-b border-gray-100">
                <CardTitle className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faUserCog} className="w-5 h-5 text-primary" />
                  Editar Información Personal
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <PerfilForm usuario={usuario} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}