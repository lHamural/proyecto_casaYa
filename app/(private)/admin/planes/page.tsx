// app/(private)/admin/planes/page.tsx
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
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
  faPencil,
  faCrown,
  faDollarSign,
  faBuilding,
  faImage,
  faVrCardboard,
  faStar,
  faChartLine,
  faUsers,
  faCheckCircle,
  faTimesCircle,
  faBoxes,
} from '@fortawesome/free-solid-svg-icons'
// ✅ Importar faWhatsapp desde brands
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons'
import DeletePlanButton from '@/components/admin/planes/DeletePlanButton'

export default async function PlanesPage() {
  const planes = await prisma.plan.findMany({
    orderBy: { price: 'asc' },
    include: {
      _count: { select: { subscriptions: true } },
    },
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Planes de Suscripción</h1>
          <p className="text-gray-500 text-sm">
            Gestiona los planes disponibles para los publicadores
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/planes/nuevo">
            <FontAwesomeIcon icon={faPlus} className="w-4 h-4 mr-2" />
            Nuevo Plan
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FontAwesomeIcon icon={faBoxes} className="text-primary" />
            Planes ({planes.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold">
                  <FontAwesomeIcon icon={faCrown} className="mr-2" />
                  Plan
                </TableHead>
                <TableHead className="font-semibold">
                  <FontAwesomeIcon icon={faDollarSign} className="mr-2" />
                  Precio
                </TableHead>
                <TableHead className="font-semibold">
                  <FontAwesomeIcon icon={faBuilding} className="mr-2" />
                  Propiedades
                </TableHead>
                <TableHead className="font-semibold">
                  <FontAwesomeIcon icon={faImage} className="mr-2" />
                  Imágenes
                </TableHead>
                <TableHead className="font-semibold">Funciones</TableHead>
                <TableHead className="font-semibold">
                  <FontAwesomeIcon icon={faUsers} className="mr-2" />
                  Suscriptores
                </TableHead>
                <TableHead className="font-semibold">Estado</TableHead>
                <TableHead className="font-semibold text-center">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {planes.map((plan) => (
                <TableRow key={plan.id}>
                  <TableCell className="font-medium">{plan.name}</TableCell>
                  <TableCell>
                    {plan.price === 0 ? (
                      <Badge variant="outline" className="border-green-200 text-green-700 bg-green-50">
                        Gratis
                      </Badge>
                    ) : (
                      <span className="font-semibold text-primary">
                        {plan.price} {plan.currency}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>{plan.maxProperties}</TableCell>
                  <TableCell>{plan.maxImages}</TableCell>
                  <TableCell>
                    <div className="flex gap-1 flex-wrap">
                      {plan.allowVirtualTour && (
                        <Badge className="bg-purple-100 text-purple-700 border-0 text-xs flex items-center gap-1">
                          <FontAwesomeIcon icon={faVrCardboard} className="w-3 h-3" />
                          Tour
                        </Badge>
                      )}
                      {plan.allowHighlight && (
                        <Badge className="bg-amber-100 text-amber-700 border-0 text-xs flex items-center gap-1">
                          <FontAwesomeIcon icon={faStar} className="w-3 h-3" />
                          Destacar
                        </Badge>
                      )}
                      {plan.allowWhatsapp && (
                        <Badge className="bg-green-100 text-green-700 border-0 text-xs flex items-center gap-1">
                          <FontAwesomeIcon icon={faWhatsapp} className="w-3 h-3" />
                          WhatsApp
                        </Badge>
                      )}
                      {plan.allowStats && (
                        <Badge className="bg-blue-100 text-blue-700 border-0 text-xs flex items-center gap-1">
                          <FontAwesomeIcon icon={faChartLine} className="w-3 h-3" />
                          Stats
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{plan._count.subscriptions}</TableCell>
                  <TableCell>
                    {plan.isActive ? (
                      <Badge className="bg-green-100 text-green-700 border-0 flex items-center gap-1">
                        <FontAwesomeIcon icon={faCheckCircle} className="w-3 h-3" />
                        Activo
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="border-gray-300 text-gray-500 flex items-center gap-1">
                        <FontAwesomeIcon icon={faTimesCircle} className="w-3 h-3" />
                        Inactivo
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-2">
                      <Button asChild variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors">
                        <Link href={`/admin/planes/${plan.id}/editar`}>
                          <FontAwesomeIcon icon={faPencil} className="w-4 h-4" />
                        </Link>
                      </Button>
                      <DeletePlanButton planId={plan.id} planName={plan.name} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {planes.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-gray-500 py-8">
                    No hay planes creados aún
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}