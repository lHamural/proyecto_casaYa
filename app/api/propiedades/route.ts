// app/api/propiedades/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { getPlanLimits } from '@/lib/plan-limits'
import slugify from 'slugify'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const limits = await getPlanLimits(session.user.id)
    if (!limits?.canPublish) {
      return NextResponse.json({ error: 'No puedes publicar más propiedades' }, { status: 403 })
    }

    const body = await request.json()
    console.log('📦 Body recibido:', { 
      toursCount: body.tours?.length || 0, 
      imagesCount: body.images?.length || 0 
    })

    const {
      title,
      description,
      price,
      currency,
      priceNegotiable,
      area,
      bedrooms,
      bathrooms,
      garage,
      floors,
      antiquity,
      furnished,
      address,
      city,
      department,
      zone,
      latitude,
      longitude,
      propertyTypeId,
      propertyCategoryId,
      featureIds,
      images,
      tours,            // ← ahora es un array de tours
      isHighlighted,
      status,
    } = body

    // Generar slug
    const baseSlug = slugify(title, { lower: true, strict: true })
    const slug = `${baseSlug}-${Date.now()}`

    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + (limits.plan.durationDays || 30))

    // Crear la propiedad (sin tours todavía)
    const propiedad = await prisma.property.create({
      data: {
        userId: session.user.id,
        planId: limits.plan.id,
        propertyTypeId,
        propertyCategoryId,
        title,
        slug,
        description,
        price: Number(price),
        currency: currency || 'USD',
        priceNegotiable: Boolean(priceNegotiable),
        area: area ? Number(area) : null,
        bedrooms: bedrooms ? Number(bedrooms) : null,
        bathrooms: bathrooms ? Number(bathrooms) : null,
        garage: Boolean(garage),
        floors: floors ? Number(floors) : null,
        antiquity: antiquity ? Number(antiquity) : null,
        furnished: Boolean(furnished),
        address,
        city,
        department,
        zone,
        latitude: latitude ? Number(latitude) : null,
        longitude: longitude ? Number(longitude) : null,
        isHighlighted: Boolean(isHighlighted) && limits.allowHighlight,
        status: status || 'PUBLISHED',
        expiresAt,
        // Características
        features: featureIds?.length ? {
          create: featureIds.map((featureId: string) => ({ featureId })),
        } : undefined,
        // Imágenes
        images: images?.length ? {
          create: images.map((img: any, index: number) => ({
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
        } : undefined,
      },
    })

    console.log('✅ Propiedad creada:', propiedad.id)

    // ── Crear tours virtuales (múltiples) ──
    if (tours && tours.length > 0) {
      console.log(`🎯 Creando ${tours.length} tours virtuales...`)
      
      try {
        await prisma.virtualTour.createMany({
          data: tours.map((t: any, index: number) => ({
            propertyId: propiedad.id,
            imagePath: t.imagePath,
            originalPath: t.originalPath || t.imagePath,
            title: t.title || `Recorrido ${index + 1}`,
            order: t.order ?? index,
            provider: 'CUSTOM',
          })),
        })
        console.log('✅ Tours virtuales creados exitosamente')
      } catch (tourError) {
        console.error('❌ Error al crear tours:', tourError)
        // No fallamos la creación de la propiedad
      }
    } else {
      console.log('⚠️ No se recibieron tours para crear')
    }

    // ── Obtener la propiedad completa con todos los tours ──
    const propiedadCompleta = await prisma.property.findUnique({
      where: { id: propiedad.id },
      include: {
        images: { orderBy: { order: 'asc' } },
        virtualTours: { orderBy: { order: 'asc' } },  // ✅ plural
        features: { include: { feature: true } },
        propertyType: true,
        propertyCategory: true,
      },
    })

    console.log('🎯 Tours en respuesta:', propiedadCompleta?.virtualTours?.length || 0)

    return NextResponse.json(propiedadCompleta, { status: 201 })
    
  } catch (error) {
    console.error('❌ Error:', error)
    return NextResponse.json({ error: 'Error al crear propiedad' }, { status: 500 })
  }
}

// GET /api/propiedades (sin cambios)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const tipo = searchParams.get('tipo')
    const categoria = searchParams.get('categoria')
    const ciudad = searchParams.get('ciudad')
    const pagina = Number(searchParams.get('pagina') || 1)
    const limite = Number(searchParams.get('limite') || 12)

    const propiedades = await prisma.property.findMany({
      where: {
        status: 'PUBLISHED',
        ...(tipo && { propertyType: { name: tipo as any } }),
        ...(categoria && { propertyCategory: { name: categoria as any } }),
        ...(ciudad && { city: { contains: ciudad, mode: 'insensitive' } }),
      },
      include: {
        images: { where: { isPrimary: true }, take: 1 },
        propertyType: true,
        propertyCategory: true,
        user: { select: { name: true, phone: true, email: true } },
        _count: { select: { likes: true } },
      },
      skip: (pagina - 1) * limite,
      take: limite,
    })

    const total = await prisma.property.count({ where: { status: 'PUBLISHED' } })

    return NextResponse.json({ propiedades, total, pagina, limite })
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener propiedades' }, { status: 500 })
  }
}