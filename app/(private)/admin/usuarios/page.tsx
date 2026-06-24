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
import { Plus, Pencil, Mail, Phone, Users, UserCheck, Building, Home, Crown } from 'lucide-react'
import DeleteUsuarioButton from '@/components/ui/admin/usuarios/DeleteUsuarioButton'
import { cn } from '@/lib/utils'

const rolColors: Record<string, string> = {
  SUPERADMIN: 'bg-red-100 text-red-700',
  INMOBILIARIA: 'bg-blue-100 text-blue-700',
  PROPIETARIO: 'bg-green-100 text-green-700',
  VISITANTE: 'bg-gray-100 text-gray-700',
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
          plan: { select: { name: true } },
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

  const stats = [
    { label: 'Total Usuarios', value: usuarios.length },
    { label: 'Activos', value: usuarios.filter((u) => u.isActive).length },
    { label: 'Propietarios', value: usuarios.filter((u) => u.role === 'PROPIETARIO').length },
    { label: 'Inmobiliarias', value: usuarios.filter((u) => u.role === 'INMOBILIARIA').length },
  ]

  return (
    <div className="min-h-screen bg-gray-50">


      <div className="container-custom py-10">
        {/* Stats Cards - Igual que propiedades */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <Card key={stat.label} className="border-2 border-gray-100 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-primary/10">
                    {stat.label === 'Total Usuarios' && <Users className="w-6 h-6 text-primary" />}
                    {stat.label === 'Activos' && <UserCheck className="w-6 h-6 text-green-600" />}
                    {stat.label === 'Propietarios' && <Home className="w-6 h-6 text-emerald-600" />}
                    {stat.label === 'Inmobiliarias' && <Building className="w-6 h-6 text-purple-600" />}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabla de usuarios - Igual que propiedades */}
        <Card className="border-2 border-gray-100">
          <CardHeader className="border-b border-gray-100">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                Lista de Usuarios
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  ({usuarios.length} usuarios)
                </span>
              </CardTitle>
              <Button asChild className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
                <Link href="/admin/usuarios/nuevo">
                  <Plus className="w-4 h-4 mr-2" />
                  Nuevo Usuario
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">Usuario</TableHead>
                  <TableHead className="font-semibold">Rol</TableHead>
                  <TableHead className="font-semibold">Plan</TableHead>
                  <TableHead className="font-semibold text-center">Propiedades</TableHead>
                  <TableHead className="font-semibold text-center">Estado</TableHead>
                  <TableHead className="font-semibold">Registro</TableHead>
                  <TableHead className="font-semibold text-center">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {usuariosFormateados.map((usuario) => (
                  <TableRow 
                    key={usuario.id} 
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <TableCell>
                      <div>
                        <p className="font-medium">{usuario.name}</p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {usuario.email}
                          </span>
                          {usuario.phone && (
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {usuario.phone}
                            </span>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={cn("text-xs px-2 py-1 rounded-full font-medium", rolColors[usuario.role])}>
                        {usuario.role}
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
                    <TableCell className="text-center">
                      <Badge variant="outline" className="bg-gray-50">
                        {usuario._count.properties}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge 
                        variant={usuario.isActive ? 'default' : 'outline'}
                        className={cn(
                          usuario.isActive 
                            ? "bg-green-100 text-green-700 hover:bg-green-100 border-green-200" 
                            : "text-gray-500 border-gray-200"
                        )}
                      >
                        {usuario.isActive ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(usuario.createdAt).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-1">
                        <Button 
                          asChild 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary"
                        >
                          <Link href={`/admin/usuarios/${usuario.id}/editar`}>
                            <Pencil className="w-4 h-4" />
                          </Link>
                        </Button>
                        <DeleteUsuarioButton
                          usuarioId={usuario.id}
                          usuarioName={usuario.name || 'Usuario'}
                          usuarioEmail={usuario.email}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {usuarios.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-12">
                      <div className="flex flex-col items-center gap-2">
                        <Users className="w-12 h-12 text-muted-foreground/50" />
                        <p>No hay usuarios registrados</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}