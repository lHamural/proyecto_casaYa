// app/api/admin/planes/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

export const runtime = 'nodejs'

// GET /api/admin/planes
export async function GET() {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'SUPERADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const planes = await prisma.plan.findMany({
      where: { isActive: true },
      orderBy: { price: 'asc' },
      include: {
        _count: {
          select: { subscriptions: true },
        },
      },
    })
    return NextResponse.json(planes)
  } catch (error) {
    console.error('Error GET planes:', error)
    return NextResponse.json(
      { error: 'Error al obtener planes' },
      { status: 500 }
    )
  }
}

// POST /api/admin/planes
export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'SUPERADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const {
      name,
      price,
      currency,
      description,
      maxProperties,
      maxImages,
      allowVirtualTour,
      allowHighlight,
      allowWhatsapp,
      allowStats,
      stripePriceId,
      durationDays,
      isActive,
    } = body

    if (!name || price === undefined) {
      return NextResponse.json(
        { error: 'Nombre y precio son requeridos' },
        { status: 400 }
      )
    }

    const plan = await prisma.plan.create({
      data: {
        name,
        price: Number(price),
        currency: currency || 'USD',
        description,
        maxProperties: Number(maxProperties) || 3,
        maxImages: Number(maxImages) || 5,
        allowVirtualTour: Boolean(allowVirtualTour),
        allowHighlight: Boolean(allowHighlight),
        allowWhatsapp: Boolean(allowWhatsapp),
        allowStats: Boolean(allowStats),
        stripePriceId,
        durationDays: Number(durationDays) || 30,
        isActive: isActive !== undefined ? Boolean(isActive) : true,
      },
    })

    return NextResponse.json(plan, { status: 201 })
  } catch (error: any) {
    console.error('Error POST planes:', error)
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Ya existe un plan con ese nombre' },
        { status: 409 }
      )
    }
    return NextResponse.json(
      { error: 'Error al crear el plan' },
      { status: 500 }
    )
  }
}