// app/api/propiedades/[id]/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

export const runtime = 'nodejs'

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()

    // 1. Verificar que la propiedad existe y pertenece al usuario
    const propiedadExistente = await prisma.property.findFirst({
      where: { id, userId: session.user.id }
    })

    if (!propiedadExistente) {
      return NextResponse.json({ error: 'Propiedad no encontrada' }, { status: 404 })
    }

    // 2. Actualizar datos principales de la propiedad
    await prisma.property.update({
      where: { id },
      data: {
        title: body.title,
        description: body.description,
        price: Number(body.price),
        currency: body.currency || 'USD',
        priceNegotiable: Boolean(body.priceNegotiable),
        area: body.area ? Number(body.area) : null,
        bedrooms: body.bedrooms ? Number(body.bedrooms) : null,
        bathrooms: body.bathrooms ? Number(body.bathrooms) : null,
        garage: Boolean(body.garage),
        floors: body.floors ? Number(body.floors) : null,
        antiquity: body.antiquity ? Number(body.antiquity) : null,
        furnished: Boolean(body.furnished),
        address: body.address,
        city: body.city,
        department: body.department,
        zone: body.zone,
        latitude: body.latitude ? Number(body.latitude) : null,
        longitude: body.longitude ? Number(body.longitude) : null,
        propertyTypeId: body.propertyTypeId,
        propertyCategoryId: body.propertyCategoryId,
        isHighlighted: Boolean(body.isHighlighted),
        status: body.status,
      },
    })

    // 3. Actualizar características (featureIds)
    if (body.featureIds !== undefined) {
      await prisma.propertyFeatureMap.deleteMany({
        where: { propertyId: id }
      })
      if (body.featureIds.length > 0) {
        await prisma.propertyFeatureMap.createMany({
          data: body.featureIds.map((featureId: string) => ({
            propertyId: id,
            featureId,
          })),
        })
      }
    }

    // 4. Actualizar imágenes (reemplazar todas)
    if (body.images !== undefined) {
      await prisma.propertyImage.deleteMany({
        where: { propertyId: id }
      })
      if (body.images.length > 0) {
        await prisma.propertyImage.createMany({
          data: body.images.map((img: any, index: number) => ({
            propertyId: id,
            originalPath: img.originalPath,
            webpPath: img.webpPath,
            thumbPath: img.thumbPath,
            originalName: img.originalName,
            size: img.size,
            width: img.width,
            height: img.height,
            isPrimary: index === 0,
            order: index,
          })),
        })
      }
    }

    // 5. Actualizar tours virtuales (múltiples)
    if (body.tours !== undefined) {
      // Eliminar tours existentes
      await prisma.virtualTour.deleteMany({
        where: { propertyId: id }
      })
      // Crear nuevos tours
      if (body.tours.length > 0) {
        await prisma.virtualTour.createMany({
          data: body.tours.map((t: any, index: number) => ({
            propertyId: id,
            imagePath: t.imagePath,
            originalPath: t.originalPath || t.imagePath,
            title: t.title || `Recorrido ${index + 1}`,
            order: t.order ?? index,
            provider: 'CUSTOM',
          })),
        })
      }
    }

    // 6. Obtener la propiedad actualizada con todas las relaciones
    const propiedadActualizada = await prisma.property.findUnique({
      where: { id },
      include: {
        images: { orderBy: { order: 'asc' } },
        virtualTours: { orderBy: { order: 'asc' } },  // ✅ plural y ordenado
        features: {
          include: { feature: true }
        },
        propertyType: true,
        propertyCategory: true,
      },
    })

    return NextResponse.json(propiedadActualizada, { status: 200 })

  } catch (error) {
    console.error('❌ Error en PUT:', error)
    return NextResponse.json(
      { error: 'Error al actualizar la propiedad' },
      { status: 500 }
    )
  }
}