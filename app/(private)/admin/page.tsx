// app/(private)/admin/page.tsx
export const runtime = 'nodejs'

import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Users,
  Home,
  DollarSign,
  TrendingUp,
  Eye,
  Heart,
  Calendar,
  Building2,
  Crown,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  BarChart3,
  PieChart,
} from 'lucide-react'

export default async function AdminDashboard() {
  const session = await auth()
  if (!session?.user || session.user.role !== 'SUPERADMIN') {
    redirect('/dashboard')
  }

  // ✅ Obtener ingresos con query raw
  const ingresosQuery = await prisma.$queryRaw`
    SELECT COALESCE(SUM(p.price), 0) as total
    FROM "subscriptions" s
    JOIN "plans" p ON s."planId" = p.id
    WHERE s.status = 'ACTIVE'
  `

  const ingresosMesQuery = await prisma.$queryRaw`
    SELECT COALESCE(SUM(p.price), 0) as total
    FROM "subscriptions" s
    JOIN "plans" p ON s."planId" = p.id
    WHERE s.status = 'ACTIVE'
    AND s."createdAt" >= DATE_TRUNC('month', NOW())
  `

  const totalIngresos = Array.isArray(ingresosQuery) && ingresosQuery.length > 0 
    ? Number(ingresosQuery[0].total) 
    : 0

  const ingresosMes = Array.isArray(ingresosMesQuery) && ingresosMesQuery.length > 0 
    ? Number(ingresosMesQuery[0].total) 
    : 0

  const [totalLikes] = await Promise.all([
    prisma.like.count(),
  ])

  const [
    totalUsuarios,
    totalPropiedades,
    totalSuscripcionesActivas,
    propiedadesPublicadas,
    usuariosActivos,
    totalVistas,
    propiedadesDestacadas,
    nuevosUsuariosMes,
    nuevasPropiedadesMes,
    propiedadesPorEstado,
    ultimasPropiedades,
    ultimosUsuarios,
    suscripcionesPorPlan
  ] = await Promise.all([
    prisma.user.count(),
    prisma.property.count(),
    prisma.subscription.count({ where: { status: 'ACTIVE' } }),
    prisma.property.count({ where: { status: 'PUBLISHED' } }),
    prisma.user.count({ 
      where: { 
        subscriptions: { 
          some: { 
            status: 'ACTIVE' 
          } 
        } 
      } 
    }),
    prisma.property.aggregate({ _sum: { viewCount: true } }),
    prisma.property.count({ where: { isHighlighted: true } }),
    prisma.user.count({
      where: {
        createdAt: {
          gte: new Date(new Date().setDate(1))
        }
      }
    }),
    prisma.property.count({
      where: {
        createdAt: {
          gte: new Date(new Date().setDate(1))
        }
      }
    }),
    prisma.property.groupBy({
      by: ['status'],
      _count: true,
    }),
    prisma.property.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true } },
        _count: { select: { likes: true, comments: true } }
      }
    }),
    prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        subscriptions: {
          include: { plan: true },
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    }),
    prisma.subscription.groupBy({
      by: ['planId'],
      _count: true,
      where: { status: 'ACTIVE' }
    })
  ])

  const planesIds = suscripcionesPorPlan.map(s => s.planId)
  const planesNombres = await prisma.plan.findMany({
    where: { id: { in: planesIds } },
    select: { id: true, name: true }
  })

  const suscripcionesConNombre = suscripcionesPorPlan.map(s => ({
    ...s,
    planName: planesNombres.find(p => p.id === s.planId)?.name || 'Desconocido'
  }))

  const totalVistasCount = totalVistas._sum?.viewCount || 0

  const stats = [
    { 
      label: 'Usuarios', 
      value: totalUsuarios, 
      icon: Users, 
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      detail: `${usuariosActivos} activos`,
      change: `+${nuevosUsuariosMes} este mes`,
      trend: 'up'
    },
    { 
      label: 'Propiedades', 
      value: totalPropiedades, 
      icon: Home, 
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      detail: `${propiedadesPublicadas} publicadas`,
      change: `+${nuevasPropiedadesMes} este mes`,
      trend: 'up'
    },
    { 
      label: 'Ingresos', 
      value: `$${totalIngresos.toLocaleString()}`, 
      icon: DollarSign, 
      color: 'text-violet-600',
      bg: 'bg-violet-50',
      detail: `${totalSuscripcionesActivas} suscripciones`,
      change: `+$${ingresosMes} este mes`,
      trend: 'up'
    },
    { 
      label: 'Visitas', 
      value: totalVistasCount.toLocaleString(), 
      icon: Eye, 
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      detail: `${totalLikes} likes`,
      change: `${propiedadesDestacadas} destacadas`,
      trend: 'up'
    },
  ]

  const statusColors: Record<string, string> = {
    PUBLISHED: 'bg-green-500',
    DRAFT: 'bg-gray-400',
    PAUSED: 'bg-yellow-500',
    SOLD: 'bg-blue-500',
    RENTED: 'bg-purple-500',
  }

  const statusLabels: Record<string, string> = {
    PUBLISHED: 'Publicadas',
    DRAFT: 'Borradores',
    PAUSED: 'Pausadas',
    SOLD: 'Vendidas',
    RENTED: 'Alquiladas',
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
        <div>
          <h1 className="text-5xl font-bold tracking-tighter text-gray-900">Dashboard</h1>
          <p className="text-xl text-muted-foreground mt-2">Resumen en tiempo real de la plataforma</p>
        </div>
        <Button asChild size="lg" className="shadow-lg hover:shadow-xl transition-all">
          <Link href="/admin/reportes">
            <BarChart3 className="w-5 h-5 mr-2" />
            Ver Reportes
          </Link>
        </Button>
      </div>

      {/* Stats Cards Mejorados */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-gray-100">
            <CardContent className="p-8">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-5xl font-bold tracking-tighter text-gray-900">{stat.value}</p>
                  <p className="text-lg text-gray-600 mt-3">{stat.label}</p>
                </div>
                <div className={`p-4 rounded-3xl ${stat.bg} shadow-inner`}>
                  <stat.icon className={`w-9 h-9 ${stat.color}`} />
                </div>
              </div>

              <div className="mt-8 flex items-center justify-between text-sm">
                <p className="text-gray-600">{stat.detail}</p>
                <span className="flex items-center gap-1 text-emerald-600 font-medium">
                  <ArrowUpRight className="w-4 h-4" />
                  {stat.change}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Sección Secundaria */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <Card className="lg:col-span-5 border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl">
              <PieChart className="w-6 h-6 text-primary" />
              Propiedades por Estado
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-6">
            {propiedadesPorEstado.map((estado) => (
              <div key={estado.status} className="flex items-center gap-4">
                <div className={`w-4 h-4 rounded-full ${statusColors[estado.status]}`} />
                <div className="flex-1">
                  <div className="flex justify-between mb-2 text-sm">
                    <span>{statusLabels[estado.status] || estado.status}</span>
                    <span className="font-semibold">{estado._count}</span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${statusColors[estado.status]}`}
                      style={{ width: `${(estado._count / totalPropiedades) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="lg:col-span-4 border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl">
              <Crown className="w-6 h-6 text-amber-500" />
              Suscripciones por Plan
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-6">
            {suscripcionesConNombre.map((s, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex justify-between mb-2 text-sm">
                    <span className="font-medium">{s.planName}</span>
                    <span className="font-semibold">{s._count}</span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-amber-500 to-orange-500"
                      style={{ width: `${(s._count / totalSuscripcionesActivas) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl">
              <Activity className="w-6 h-6 text-primary" />
              Actividad Reciente
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-2">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Últimas Propiedades</p>
              {ultimasPropiedades.slice(0, 3).map((prop) => (
                <div key={prop.id} className="flex justify-between py-2 text-sm border-b last:border-0">
                  <span className="line-clamp-1 pr-2">{prop.title}</span>
                  <span className="text-muted-foreground text-xs whitespace-nowrap">
                    {new Date(prop.createdAt).toLocaleDateString('es-ES')}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Últimos Usuarios</p>
              {ultimosUsuarios.slice(0, 3).map((user) => (
                <div key={user.id} className="flex justify-between py-2 text-sm border-b last:border-0">
                  <span>{user.name || user.email}</span>
                  <span className="text-muted-foreground text-xs">
                    {user.subscriptions?.[0]?.plan?.name || 'Sin plan'}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Accesos Rápidos */}
      <Card className="border-0 shadow-xl">
        <CardHeader>
          <CardTitle>Accesos Rápidos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button 
  asChild 
  variant="outline" 
  className="group h-32 flex flex-col items-center justify-center gap-4 border border-gray-200 hover:border-primary/30 hover:bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1 rounded-3xl p-6"
>
  <Link href="/admin/usuarios" className="flex flex-col items-center justify-center gap-3 w-full h-full">
    <div className="w-14 h-14 flex items-center justify-center bg-blue-50 rounded-2xl group-hover:bg-blue-100 transition-colors">
      <Users className="w-8 h-8 text-blue-600" />
    </div>
    <span className="font-semibold text-gray-700 group-hover:text-gray-900 transition-colors">Usuarios</span>
  </Link>
</Button>

<Button 
  asChild 
  variant="outline" 
  className="group h-32 flex flex-col items-center justify-center gap-4 border border-gray-200 hover:border-emerald-300 hover:bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1 rounded-3xl p-6"
>
  <Link href="/admin/propiedades" className="flex flex-col items-center justify-center gap-3 w-full h-full">
    <div className="w-14 h-14 flex items-center justify-center bg-emerald-50 rounded-2xl group-hover:bg-emerald-100 transition-colors">
      <Home className="w-8 h-8 text-emerald-600" />
    </div>
    <span className="font-semibold text-gray-700 group-hover:text-gray-900 transition-colors">Propiedades</span>
  </Link>
</Button>

<Button 
  asChild 
  variant="outline" 
  className="group h-32 flex flex-col items-center justify-center gap-4 border border-gray-200 hover:border-amber-300 hover:bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1 rounded-3xl p-6"
>
  <Link href="/admin/planes" className="flex flex-col items-center justify-center gap-3 w-full h-full">
    <div className="w-14 h-14 flex items-center justify-center bg-amber-50 rounded-2xl group-hover:bg-amber-100 transition-colors">
      <Crown className="w-8 h-8 text-amber-600" />
    </div>
    <span className="font-semibold text-gray-700 group-hover:text-gray-900 transition-colors">Planes</span>
  </Link>
</Button>

<Button 
  asChild 
  variant="outline" 
  className="group h-32 flex flex-col items-center justify-center gap-4 border border-gray-200 hover:border-violet-300 hover:bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1 rounded-3xl p-6"
>
  <Link href="/admin/suscripcion" className="flex flex-col items-center justify-center gap-3 w-full h-full">
    <div className="w-14 h-14 flex items-center justify-center bg-violet-50 rounded-2xl group-hover:bg-violet-100 transition-colors">
      <CreditCard className="w-8 h-8 text-violet-600" />
    </div>
    <span className="font-semibold text-gray-700 group-hover:text-gray-900 transition-colors">Suscripciones</span>
  </Link>
</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}