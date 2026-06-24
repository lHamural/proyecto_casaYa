import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { getPlanLimits } from '@/lib/plan-limits'
import PropiedadForm from '@/components/propiedades/PropiedadForm'

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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Publicar Propiedad</h1>
        <p className="text-gray-500 text-sm">
          Completa el formulario para publicar tu propiedad
        </p>
      </div>
      <PropiedadForm
        tipos={tipos}
        categorias={categorias}
        caracteristicas={caracteristicas}
        planLimits={limits}
      />
    </div>
  )
}