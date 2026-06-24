// app/(private)/admin/propiedades/[id]/editar/page.tsx
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { getPlanLimits } from '@/lib/plan-limits'
import PropiedadForm from '@/components/propiedades/PropiedadForm'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditarPropiedadPage({ params }: PageProps) {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const { id } = await params

  // Obtener la propiedad con todas sus relaciones (incluyendo virtualTours)
  const propiedad = await prisma.property.findUnique({
    where: { id },
    include: {
      images: { orderBy: { order: 'asc' } },
      virtualTours: { orderBy: { order: 'asc' } }, // ✅ campo correcto (plural)
      features: { include: { feature: true } },
      propertyType: true,
      propertyCategory: true,
    },
  })

  if (!propiedad) {
    redirect('/admin/propiedades?error=no_encontrada')
  }

  // Verificar que el usuario es el dueño
  if (propiedad.userId !== session.user.id) {
    redirect('/admin/propiedades?error=no_autorizado')
  }

  const limits = await getPlanLimits(session.user.id)

  const [tipos, categorias, caracteristicas] = await Promise.all([
    prisma.propertyType.findMany(),
    prisma.propertyCategory.findMany(),
    prisma.propertyFeature.findMany({ orderBy: { name: 'asc' } }),
  ])

  // Preparar datos para el formulario
  const initialData = {
    id: propiedad.id,
    title: propiedad.title,
    description: propiedad.description,
    price: propiedad.price,
    currency: propiedad.currency,
    priceNegotiable: propiedad.priceNegotiable,
    area: propiedad.area,
    bedrooms: propiedad.bedrooms,
    bathrooms: propiedad.bathrooms,
    garage: propiedad.garage,
    floors: propiedad.floors,
    antiquity: propiedad.antiquity,
    furnished: propiedad.furnished,
    address: propiedad.address,
    city: propiedad.city,
    department: propiedad.department,
    zone: propiedad.zone,
    latitude: propiedad.latitude,
    longitude: propiedad.longitude,
    propertyTypeId: propiedad.propertyTypeId,
    propertyCategoryId: propiedad.propertyCategoryId,
    isHighlighted: propiedad.isHighlighted,
    status: propiedad.status,
    images: propiedad.images.map(img => ({
      id: img.id,
      originalPath: img.originalPath,
      webpPath: img.webpPath,
      thumbPath: img.thumbPath,
      originalName: img.originalName,
      size: img.size,
      width: img.width,
      height: img.height,
      isPrimary: img.isPrimary,
      order: img.order,
    })),
    features: propiedad.features.map(f => ({
      id: f.id,
      featureId: f.featureId,
      feature: f.feature,
    })),
    virtualTours: propiedad.virtualTours.map(tour => ({  // ✅ array de tours
      id: tour.id,
      imagePath: tour.imagePath,
      originalPath: tour.originalPath,
      title: tour.title,
      description: tour.description,
      order: tour.order,
    })),
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Editar Propiedad</h1>
        <p className="text-muted-foreground text-sm">
          Actualiza la información de tu propiedad
        </p>
      </div>
      <PropiedadForm
        tipos={tipos}
        categorias={categorias}
        caracteristicas={caracteristicas}
        planLimits={limits}
        initialData={initialData}
        isEditing={true}
      />
    </div>
  )
}