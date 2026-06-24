// app/(private)/admin/usuarios/page.tsx
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPlus,
  faUser,
  faUsers,
  faCheckCircle,
  faTimesCircle,
  faBuilding,
  faCrown,
  faEnvelope,
  faPhone,
  faCalendarAlt,
  faIdCard,
  faUserCheck,
} from '@fortawesome/free-solid-svg-icons'
import { AsignarPlanButton } from '@/components/usuarios/AsignarPlanButton'

const rolColors: Record<string, string> = {
  SUPERADMIN: 'bg-red-100 text-red-700',
  INMOBILIARIA: 'bg-blue-100 text-blue-700',
  PROPIETARIO: 'bg-green-100 text-green-700',
  VISITANTE: 'bg-gray-100 text-gray-700',
}

const rolLabels: Record<string, string> = {
  SUPERADMIN: 'Super Admin',
  INMOBILIARIA: 'Inmobiliaria',
  PROPIETARIO: 'Propietario',
  VISITANTE: 'Visitante',
}

export default async function UsuariosPage() {
  const session = await auth()
  if (!session?.user || session.user.role !== 'SUPERADMIN') {
    redirect('/login')
  }

  const usuarios = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      isActive: true,
      createdAt: true,
      subscriptions: {
        select: {
          status: true,
          plan: { select: { name: true, id: true } },
        },
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

  const usuariosFormateados = usuarios.map(user => ({
    ...user,
    subscription: user.subscriptions[0] || null,
  }))

  // Estadísticas
  const totalUsuarios = usuarios.length
  const activos = usuarios.filter(u => u.isActive).length
  const propietarios = usuarios.filter(u => u.role === 'PROPIETARIO').length
  const inmobiliarias = usuarios.filter(u => u.role === 'INMOBILIARIA').length

  const stats = [
    {
      label: 'Total Usuarios',
      value: totalUsuarios,
      icon: faUsers,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-100',
    },
    {
      label: 'Usuarios Activos',
      value: activos,
      icon: faUserCheck,
      color: 'text-green-600',
      bg: 'bg-green-50',
      border: 'border-green-100',
    },
    {
      label: 'Propietarios',
      value: propietarios,
      icon: faBuilding,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      border: 'border-emerald-100',
    },
    {
      label: 'Inmobiliarias',
      value: inmobiliarias,
      icon: faCrown,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      border: 'border-purple-100',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header manual */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Usuarios</h1>
          <p className="text-muted-foreground text-sm">
            Gestiona todos los usuarios de la plataforma
          </p>
        </div>
        <Button asChild className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
          <Link href="/admin/usuarios/nuevo">
            <FontAwesomeIcon icon={faPlus} className="w-4 h-4 mr-2" />
            Nuevo Usuario
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card
            key={stat.label}
            className={`border-2 ${stat.border} hover:shadow-lg transition-shadow`}
          >
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </p>
                  <p className={`text-3xl font-bold mt-1 ${stat.color}`}>
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-2xl ${stat.bg}`}>
                  <FontAwesomeIcon icon={stat.icon} className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabla de usuarios */}
      <Card className="border-2 border-gray-100">
        <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          <CardTitle className="flex items-center gap-2 text-lg">
            <FontAwesomeIcon icon={faUser} className="w-5 h-5 text-primary" />
            Lista de Usuarios
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              ({usuarios.length} registros)
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">
                    <FontAwesomeIcon icon={faUser} className="mr-2" />
                    Usuario
                  </TableHead>
                  <TableHead className="font-semibold">
                    <FontAwesomeIcon icon={faIdCard} className="mr-2" />
                    Rol
                  </TableHead>
                  <TableHead className="font-semibold">Plan</TableHead>
                  <TableHead className="font-semibold">
                    <FontAwesomeIcon icon={faBuilding} className="mr-2" />
                    Propiedades
                  </TableHead>
                  <TableHead className="font-semibold">Estado</TableHead>
                  <TableHead className="font-semibold">
                    <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                    Registro
                  </TableHead>
                  <TableHead className="font-semibold text-center">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {usuariosFormateados.map((usuario) => (
                  <TableRow key={usuario.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell>
                      <div>
                        <p className="font-medium">{usuario.name}</p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <FontAwesomeIcon icon={faEnvelope} className="w-3 h-3" />
                            {usuario.email}
                          </span>
                          {usuario.phone && (
                            <span className="flex items-center gap-1">
                              <FontAwesomeIcon icon={faPhone} className="w-3 h-3" />
                              {usuario.phone}
                            </span>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${rolColors[usuario.role]}`}>
                        {rolLabels[usuario.role]}
                      </span>
                    </TableCell>
                    <TableCell>
                      {usuario.subscription ? (
                        <Badge variant="outline" className="border-2">
                          {usuario.subscription.plan.name}
                        </Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">Sin plan</span>
                      )}
                    </TableCell>
                    <TableCell>{usuario._count.properties}</TableCell>
                    <TableCell>
                      {usuario.isActive ? (
                        <Badge className="bg-green-100 text-green-700 border-0 flex items-center gap-1 px-3 py-1">
                          <FontAwesomeIcon icon={faCheckCircle} className="w-3 h-3" />
                          Activo
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="border-gray-300 text-gray-500 flex items-center gap-1 px-3 py-1">
                          <FontAwesomeIcon icon={faTimesCircle} className="w-3 h-3" />
                          Inactivo
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(usuario.createdAt).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-1">
                        <AsignarPlanButton
                          usuarioId={usuario.id}
                          usuarioName={usuario.name || 'Usuario'}
                          planActual={usuario.subscription?.plan?.name || null}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {usuarios.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12">
                      <div className="flex flex-col items-center gap-2">
                        <FontAwesomeIcon icon={faUsers} className="w-12 h-12 text-muted-foreground/50" />
                        <p className="text-muted-foreground">No hay usuarios registrados</p>
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
  )
}