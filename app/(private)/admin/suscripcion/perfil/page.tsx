// app/(private)/perfil/page.tsx
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Shield, 
  Save,
  Camera,
  Building2,
  Home
} from 'lucide-react'
import PerfilForm from '@/components/perfil/PerfilForm'

export default async function PerfilPage() {
  const session = await auth()
  if (!session?.user) {
    redirect('/login')
  }

  // ✅ CORREGIDO: usar 'subscriptions' en lugar de 'subscription'
  const usuario = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      subscriptions: {  // ← Cambiado de 'subscription' a 'subscriptions'
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Mi Perfil</h1>
        <p className="text-muted-foreground text-sm">
          Gestiona tu información personal y configuración de cuenta
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna izquierda - Información del usuario */}
        <div className="lg:col-span-1 space-y-6">
          {/* Avatar y datos básicos */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="relative">
                  <Avatar className="w-24 h-24">
                    <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                      {getInitials(usuario.name || 'U')}
                    </AvatarFallback>
                  </Avatar>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                </div>
                <h3 className="text-lg font-semibold mt-4">{usuario.name}</h3>
                <p className="text-sm text-muted-foreground">{usuario.email}</p>
                <div className="mt-2">
                  <Badge className={rolColors[usuario.role]}>
                    <Shield className="w-3 h-3 mr-1" />
                    {usuario.role}
                  </Badge>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>Miembro desde: {new Date(usuario.createdAt).toLocaleDateString('es-ES')}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Building2 className="w-4 h-4 text-muted-foreground" />
                  <span>{usuario._count.properties} propiedades publicadas</span>
                </div>
                {subscriptionActiva && (
                  <div className="flex items-center gap-3 text-sm">
                    <Home className="w-4 h-4 text-muted-foreground" />
                    <span>Plan: <strong>{subscriptionActiva.plan.name}</strong></span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Plan actual */}
          {subscriptionActiva && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Plan Actual</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="font-semibold">{subscriptionActiva.plan.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {subscriptionActiva.plan.maxProperties} propiedades máximas
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {subscriptionActiva.plan.maxImages} imágenes por propiedad
                  </p>
                  {subscriptionActiva.endDate && (
                    <p className="text-xs text-muted-foreground">
                      Renovación: {new Date(subscriptionActiva.endDate).toLocaleDateString('es-ES')}
                    </p>
                  )}
                  <Button asChild variant="outline" size="sm" className="w-full mt-2">
                    <a href="/admin/suscripcion">Gestionar Plan</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Columna derecha - Formulario de edición */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Editar Información Personal</CardTitle>
            </CardHeader>
            <CardContent>
              <PerfilForm usuario={usuario} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}