// app/(private)/admin/propiedades/nueva/page.tsx
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { getPlanLimits } from '@/lib/plan-limits'
import PropiedadForm from '@/components/propiedades/PropiedadForm'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faPlus,
  faBuilding,
  faHome,
  faInfoCircle
} from '@fortawesome/free-solid-svg-icons'

export default async function NuevaPropiedadPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const limits = await getPlanLimits(session.user.id)

  if (!limits) {
    redirect('/dashboard/suscripcion')
  }

  if (!limits.canPublish) {
    redirect('/dashboard/propiedades?error=limite_alcanzado')
  }

  const [tipos, categorias, caracteristicas] = await Promise.all([
    prisma.propertyType.findMany(),
    prisma.propertyCategory.findMany(),
    prisma.propertyFeature.findMany({ orderBy: { name: 'asc' } }),
  ])

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="container-custom py-12 max-w-6xl mx-auto px-6">
        {/* Tarjeta de información del plan */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                <FontAwesomeIcon icon={faInfoCircle} className="text-primary text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Plan actual</p>
                <p className="font-semibold text-gray-900">{limits.plan.name}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-6">
              <div>
                <p className="text-xs text-gray-400">Propiedades máximas</p>
                <p className="font-semibold">{limits.plan.maxProperties}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Imágenes por propiedad</p>
                <p className="font-semibold">{limits.maxImages}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Tour virtual</p>
                <p className="font-semibold">{limits.allowVirtualTour ? '✅ Disponible' : '❌ No disponible'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Destacar propiedades</p>
                <p className="font-semibold">{limits.allowHighlight ? '✅ Disponible' : '❌ No disponible'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Formulario */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <FontAwesomeIcon icon={faHome} className="text-primary" />
              Información de la propiedad
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Completa todos los campos requeridos para publicar tu propiedad
            </p>
          </div>
          <div className="p-6 lg:p-8">
            <PropiedadForm
              tipos={tipos}
              categorias={categorias}
              caracteristicas={caracteristicas}
              planLimits={limits}
            />
          </div>
        </div>
      </div>
    </div>
  )
}