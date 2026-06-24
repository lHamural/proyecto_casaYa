// app/(private)/admin/suscripciones/page.tsx
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
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
  faCrown,
  faCheckCircle,
  faTimesCircle,
  faClock,
  faCalendarAlt,
  faCreditCard,
  faHistory,
  faUsers,
  faDollarSign,
  faChartLine,
  faArrowUp,
  faArrowDown,
  faGem,
  faRocket,
  faStar,
  faBuilding,
  faUser,
  faEnvelope,
  faPhone,
  faEye
} from '@fortawesome/free-solid-svg-icons'
import { cn } from '@/lib/utils'
import Link from 'next/link'

export default async function AdminSuscripcionesPage() {
  const session = await auth()
  if (!session?.user || session.user.role !== 'SUPERADMIN') {
    redirect('/login')
  }

  // Obtener todas las suscripciones con información del usuario y plan
  const suscripciones = await prisma.subscription.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
        }
      },
      plan: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  // Estadísticas
  const totalSuscripciones = suscripciones.length
  const activas = suscripciones.filter(s => s.status === 'ACTIVE').length
  const expiradas = suscripciones.filter(s => s.status === 'EXPIRED').length
  const canceladas = suscripciones.filter(s => s.status === 'CANCELLED').length

  // Ingresos totales
  const ingresosTotales = suscripciones
    .filter(s => s.status === 'ACTIVE' || s.status === 'EXPIRED')
    .reduce((sum, s) => sum + (s.plan?.price || 0), 0)

  // Ingresos del mes actual
  const ahora = new Date()
  const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1)
  const ingresosMes = suscripciones
    .filter(s => (s.status === 'ACTIVE' || s.status === 'EXPIRED') && s.createdAt >= inicioMes)
    .reduce((sum, s) => sum + (s.plan?.price || 0), 0)

  // Suscripciones por plan
  const suscripcionesPorPlan = suscripciones.reduce((acc: any, s) => {
    const planName = s.plan?.name || 'Sin plan'
    if (!acc[planName]) {
      acc[planName] = { count: 0, ingresos: 0 }
    }
    acc[planName].count++
    if (s.status === 'ACTIVE' || s.status === 'EXPIRED') {
      acc[planName].ingresos += s.plan?.price || 0
    }
    return acc
  }, {})

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

  const stats = [
    {
      label: 'Total Suscripciones',
      value: totalSuscripciones,
      icon: faHistory,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-100'
    },
    {
      label: 'Activas',
      value: activas,
      icon: faCheckCircle,
      color: 'text-green-600',
      bg: 'bg-green-50',
      border: 'border-green-100'
    },
    {
      label: 'Ingresos Totales',
      value: `$${ingresosTotales.toFixed(2)}`,
      icon: faDollarSign,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      border: 'border-emerald-100'
    },
    {
      label: 'Ingresos del Mes',
      value: `$${ingresosMes.toFixed(2)}`,
      icon: faChartLine,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      border: 'border-purple-100'
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="container-custom max-w-7xl mx-auto px-6">


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

        {/* Suscripciones por Plan */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {Object.entries(suscripcionesPorPlan).map(([planName, data]: [string, any]) => (
            <Card key={planName} className="border-2 border-gray-100 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <FontAwesomeIcon icon={getPlanIcon(planName)} className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{planName}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{data.count} suscripciones</span>
                      <span className="font-medium text-primary">${data.ingresos.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabla de Suscripciones */}
        <Card className="border-2 border-gray-100">
          <CardHeader className="border-b border-gray-100">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FontAwesomeIcon icon={faHistory} className="w-5 h-5 text-primary" />
                Lista de Suscripciones
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  ({totalSuscripciones} registros)
                </span>
              </CardTitle>
              <div className="flex gap-2">
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  {activas} activas
                </Badge>
                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                  {canceladas} canceladas
                </Badge>
                <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                  {expiradas} expiradas
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold">Usuario</TableHead>
                    <TableHead className="font-semibold">Plan</TableHead>
                    <TableHead className="font-semibold">Precio</TableHead>
                    <TableHead className="font-semibold">Estado</TableHead>
                    <TableHead className="font-semibold">Inicio</TableHead>
                    <TableHead className="font-semibold">Expira</TableHead>
                    <TableHead className="font-semibold text-center">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {suscripciones.map((suscripcion) => (
                    <TableRow
                      key={suscripcion.id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <TableCell>
                        <div>
                          <p className="font-medium">{suscripcion.user.name}</p>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <FontAwesomeIcon icon={faEnvelope} className="w-3 h-3" />
                              {suscripcion.user.email}
                            </span>
                            {suscripcion.user.phone && (
                              <span className="flex items-center gap-1">
                                <FontAwesomeIcon icon={faPhone} className="w-3 h-3" />
                                {suscripcion.user.phone}
                              </span>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <FontAwesomeIcon
                            icon={getPlanIcon(suscripcion.plan?.name)}
                            className={cn("w-4 h-4", getPlanColor(suscripcion.plan?.name))}
                          />
                          <span className="font-medium">{suscripcion.plan?.name || 'Sin plan'}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-bold text-primary">${suscripcion.plan?.price || 0}</span>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(suscripcion.status)}
                      </TableCell>
                      <TableCell className="text-sm">
                        {new Date(suscripcion.createdAt).toLocaleDateString('es-ES', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </TableCell>
                      <TableCell className="text-sm">
                        {suscripcion.endDate
                          ? new Date(suscripcion.endDate).toLocaleDateString('es-ES', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          }) : 'Sin fecha'}
                      </TableCell>
                      <TableCell className="text-center">
                        {/* <Button 
                          asChild 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary"
                        >
                          <Link href={`/admin/usuarios/${suscripcion.user.id}`}>
                            <FontAwesomeIcon icon={faEye} className="w-4 h-4" />
                          </Link>
                        </Button> */}
                      </TableCell>
                    </TableRow>
                  ))}
                  {suscripciones.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-12">
                        <div className="flex flex-col items-center gap-2">
                          <FontAwesomeIcon icon={faHistory} className="w-12 h-12 text-muted-foreground/50" />
                          <p className="text-muted-foreground">No hay suscripciones registradas</p>
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