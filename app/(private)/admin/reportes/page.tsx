// app/(private)/admin/reportes/page.tsx
export const runtime = 'nodejs'

import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faDownload,
  faUsers,
  faHome,
  faDollarSign,
  faEye,
  faCalendarAlt,
  faArrowUp,
  faArrowDown,
  faCreditCard,
  faCrown,
  faBuilding,
  faFileInvoice,
  faChartPie,
  faRocket,
  faChartLine,
  faWallet,
  faCoins,
  faUserCheck,
  faRepeat,
  faArrowTrendUp,
  faArrowTrendDown,
  faCircleCheck,
  faClock,
  faList,
  faFilter,
  faPrint
} from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'
import { ReporteFiltros } from '@/components/admin/ReporteFiltros'
import { cn } from '@/lib/utils'

interface PageProps {
  searchParams: Promise<{
    fechaInicio?: string
    fechaFin?: string
    plan?: string
  }>
}

export default async function ReportesPage({ searchParams }: PageProps) {
  const session = await auth()
  if (!session?.user || session.user.role !== 'SUPERADMIN') {
    redirect('/login')
  }

  const params = await searchParams
  const fechaInicio = params.fechaInicio ? new Date(params.fechaInicio) : new Date(new Date().setDate(1))
  const fechaFin = params.fechaFin ? new Date(params.fechaFin) : new Date()
  const planFiltro = params.plan || 'todos'

  // Ajustar fecha fin al final del día
  fechaFin.setHours(23, 59, 59, 999)

  // Construir filtros
  const whereCondition: any = {
    status: 'ACTIVE',
    createdAt: {
      gte: fechaInicio,
      lte: fechaFin,
    },
  }

  if (planFiltro !== 'todos') {
    whereCondition.planId = planFiltro
  }

  // Obtener todos los planes para el filtro
  const planes = await prisma.plan.findMany({
    where: { isActive: true },
    orderBy: { price: 'asc' },
  })

  // Datos principales
  const [
    totalIngresos,
    ingresosPorMes,
    suscripcionesActivas,
    suscripcionesPorPlan,
    suscripcionesRecientes,
    totalSuscripciones,
    usuariosActivos,
    renovaciones,
  ] = await Promise.all([
    // Total ingresos
    prisma.$queryRaw`
      SELECT COALESCE(SUM(p.price), 0) as total
      FROM "subscriptions" s
      JOIN "plans" p ON s."planId" = p.id
      WHERE s.status = 'ACTIVE'
      AND s."createdAt" >= ${fechaInicio}
      AND s."createdAt" <= ${fechaFin}
    `,
    // Ingresos por mes
    prisma.$queryRaw`
      SELECT 
        DATE_TRUNC('month', s."createdAt") as mes,
        COALESCE(SUM(p.price), 0) as total
      FROM "subscriptions" s
      JOIN "plans" p ON s."planId" = p.id
      WHERE s.status = 'ACTIVE'
      AND s."createdAt" >= ${fechaInicio}
      AND s."createdAt" <= ${fechaFin}
      GROUP BY DATE_TRUNC('month', s."createdAt")
      ORDER BY mes DESC
      LIMIT 12
    `,
    // Suscripciones activas
    prisma.subscription.count({
      where: { status: 'ACTIVE' },
    }),
    // Suscripciones por plan en el período
    prisma.$queryRaw`
      SELECT 
        p.name as plan,
        p.id as planId,
        COUNT(*) as total,
        COALESCE(SUM(p.price), 0) as ingresos
      FROM "subscriptions" s
      JOIN "plans" p ON s."planId" = p.id
      WHERE s.status = 'ACTIVE'
      AND s."createdAt" >= ${fechaInicio}
      AND s."createdAt" <= ${fechaFin}
      GROUP BY p.name, p.id
      ORDER BY ingresos DESC
    `,
    // Suscripciones recientes
    prisma.subscription.findMany({
      where: whereCondition,
      include: {
        user: { select: { name: true, email: true } },
        plan: { select: { name: true, price: true, currency: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    }),
    // Total suscripciones en período
    prisma.subscription.count({
      where: {
        createdAt: {
          gte: fechaInicio,
          lte: fechaFin,
        },
      },
    }),
    // Usuarios activos
    prisma.user.count({
      where: {
        subscriptions: {
          some: {
            status: 'ACTIVE',
          },
        },
      },
    }),
    // Renovaciones (suscripciones con fecha de inicio en el período)
    prisma.subscription.count({
      where: {
        startDate: {
          gte: fechaInicio,
          lte: fechaFin,
        },
        status: 'ACTIVE',
      },
    }),
  ])

  const total = Array.isArray(totalIngresos) && totalIngresos.length > 0 
    ? Number(totalIngresos[0].total) 
    : 0

  const ingresosMensuales = Array.isArray(ingresosPorMes) ? ingresosPorMes : []
  const suscripcionesPorPlanData = Array.isArray(suscripcionesPorPlan) ? suscripcionesPorPlan : []

  // Calcular estadísticas adicionales
  const ingresosPromedio = totalSuscripciones > 0 ? total / totalSuscripciones : 0
  const planMasPopular = suscripcionesPorPlanData.length > 0 
    ? suscripcionesPorPlanData.reduce((max: any, item: any) => item.total > max.total ? item : max, suscripcionesPorPlanData[0])
    : null

  const stats = [
    {
      label: 'Ingresos Totales',
      value: `$${total.toLocaleString()}`,
      icon: faDollarSign,
      color: 'text-emerald-500',
      bg: 'bg-emerald-50',
      border: 'border-emerald-100',
      detail: `${totalSuscripciones} suscripciones`,
    },
    {
      label: 'Suscripciones Activas',
      value: suscripcionesActivas,
      icon: faUsers,
      color: 'text-blue-500',
      bg: 'bg-blue-50',
      border: 'border-blue-100',
      detail: `${usuariosActivos} usuarios activos`,
    },
    {
      label: 'Renovaciones',
      value: renovaciones,
      icon: faRepeat,
      color: 'text-purple-500',
      bg: 'bg-purple-50',
      border: 'border-purple-100',
      detail: `en el período seleccionado`,
    },
    {
      label: 'Ingreso Promedio',
      value: `$${ingresosPromedio.toFixed(2)}`,
      icon: faCoins,
      color: 'text-orange-500',
      bg: 'bg-orange-50',
      border: 'border-orange-100',
      detail: `por suscripción`,
    },
  ]

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
                  <FontAwesomeIcon icon={faFileInvoice} className="w-8 h-8 text-blue-400" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold tracking-tight text-white">
                    Reportes de Ingresos
                  </h1>
                  <p className="text-slate-300">
                    Análisis detallado de ingresos por suscripciones
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Badge className="bg-white/10 hover:bg-white/20 text-white border border-white/30 px-5 py-3 text-base backdrop-blur-xl">
                  <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                  {new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
                </Badge>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="bg-white/10 hover:bg-white/20 text-white border-white/30 backdrop-blur-xl"
                >
                  <FontAwesomeIcon icon={faDownload} className="mr-2" />
                  Exportar Reporte
                </Button>
              </div>
            </div>

            {/* Barra de progreso de ingresos */}
            <div className="mt-8 max-w-md">
              <div className="flex justify-between text-sm text-white/70 mb-2">
                <span>Ingresos del período</span>
                <span className="font-medium">${total.toLocaleString()}</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-400 via-green-400 to-emerald-400 rounded-full transition-all duration-1000"
                  style={{ width: `${Math.min(100, (total / 10000) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="mb-8">
          <ReporteFiltros 
            planes={planes}
            fechaInicio={fechaInicio}
            fechaFin={fechaFin}
            planFiltro={planFiltro}
          />
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

        {/* Ingresos por mes - CORREGIDO con key única */}
        <Card className="border-2 border-gray-100 mb-8">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="flex items-center gap-2">
              <FontAwesomeIcon icon={faChartLine} className="w-5 h-5 text-primary" />
              Ingresos Mensuales
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {ingresosMensuales.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No hay datos en el período seleccionado
                </p>
              ) : (
                ingresosMensuales.map((item: any, index: number) => {
                  const mes = new Date(item.mes)
                  const ingresos = Number(item.total)
                  const maxIngreso = ingresosMensuales.length > 0 
                    ? Math.max(...ingresosMensuales.map((i: any) => Number(i.total)))
                    : 1
                  const porcentaje = (ingresos / maxIngreso) * 100

                  return (
                    <div key={item.mes?.toString() || `mes-${index}`} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {mes.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
                        </span>
                        <span className="text-sm font-bold text-emerald-600">
                          ${ingresos.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full transition-all"
                          style={{ width: `${porcentaje}%` }}
                        />
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </CardContent>
        </Card>

        {/* Suscripciones por plan y Plan destacado */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Ingresos por Plan - CORREGIDO con key única */}
          <Card className="border-2 border-gray-100">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="flex items-center gap-2">
                <FontAwesomeIcon icon={faChartPie} className="w-5 h-5 text-primary" />
                Ingresos por Plan
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {suscripcionesPorPlanData.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No hay suscripciones en el período
                  </p>
                ) : (
                  suscripcionesPorPlanData.map((item: any, index: number) => {
                    const totalPlan = Number(item.ingresos)
                    const porcentaje = total > 0 ? (totalPlan / total) * 100 : 0

                    return (
                      <div key={item.planId || `plan-${index}`} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <FontAwesomeIcon 
                              icon={faBuilding} 
                              className="w-4 h-4 text-muted-foreground" 
                            />
                            <span className="font-medium">{item.plan}</span>
                            <Badge variant="secondary" className="ml-1 text-white">
                              {item.total} suscripciones
                            </Badge>
                          </div>
                          <span className="font-bold text-emerald-600">
                            ${totalPlan.toLocaleString()}
                          </span>
                        </div>
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-purple-400 to-purple-600 rounded-full transition-all"
                            style={{ width: `${porcentaje}%` }}
                          />
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </CardContent>
          </Card>

          {/* Plan más popular */}
          {planMasPopular && (
            <Card className="border-2 border-gray-100">
              <CardHeader className="border-b border-gray-100">
                <CardTitle className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faCrown} className="w-5 h-5 text-amber-500" />
                  Plan Destacado
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="text-center p-8 bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-xl border-2 border-amber-200">
                  <div className="text-5xl mb-3">👑</div>
                  <h3 className="text-2xl font-bold text-gray-800">{planMasPopular.plan}</h3>
                  <div className="flex items-center justify-center gap-8 mt-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Suscripciones</p>
                      <p className="text-3xl font-bold text-primary">{planMasPopular.total}</p>
                    </div>
                    <div className="w-px h-12 bg-gray-300" />
                    <div>
                      <p className="text-xs text-muted-foreground">Ingresos</p>
                      <p className="text-3xl font-bold text-emerald-600">
                        ${Number(planMasPopular.ingresos).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <Badge className="mt-4 bg-amber-500 text-white border-0 px-4 py-2">
                    <FontAwesomeIcon icon={faArrowUp} className="mr-1" />
                    Plan más popular
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Suscripciones recientes */}
        <Card className="border-2 border-gray-100">
          <CardHeader className="border-b border-gray-100">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FontAwesomeIcon icon={faCreditCard} className="w-5 h-5 text-primary" />
                Suscripciones Recientes
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  ({suscripcionesRecientes.length} registros)
                </span>
              </CardTitle>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                <FontAwesomeIcon icon={faList} className="mr-1" />
                Últimas 10
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold">
                      <FontAwesomeIcon icon={faUsers} className="mr-2" />
                      Usuario
                    </TableHead>
                    <TableHead className="font-semibold">
                      <FontAwesomeIcon icon={faBuilding} className="mr-2" />
                      Plan
                    </TableHead>
                    <TableHead className="font-semibold">
                      <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                      Fecha
                    </TableHead>
                    <TableHead className="font-semibold text-right">
                      <FontAwesomeIcon icon={faDollarSign} className="mr-2" />
                      Monto
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {suscripcionesRecientes.map((s) => (
                    <TableRow 
                      key={s.id} 
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <TableCell>
                        <div>
                          <p className="font-medium">{s.user.name || 'Usuario'}</p>
                          <p className="text-xs text-muted-foreground">{s.user.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-2">
                          {s.plan.name}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(s.createdAt).toLocaleDateString('es-ES', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </TableCell>
                      <TableCell className="text-right font-bold text-emerald-600">
                        ${s.plan.price} {s.plan.currency}
                      </TableCell>
                    </TableRow>
                  ))}
                  {suscripcionesRecientes.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-12">
                        <div className="flex flex-col items-center gap-2">
                          <FontAwesomeIcon icon={faFileInvoice} className="w-12 h-12 text-muted-foreground/50" />
                          <p className="text-muted-foreground">No hay suscripciones en el período seleccionado</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}