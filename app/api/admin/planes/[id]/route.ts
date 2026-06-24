import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/admin/planes/:id
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const plan = await prisma.plan.findUnique({
      where: { id },
    })

    if (!plan) {
      return NextResponse.json(
        { error: 'Plan no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(plan)
  } catch {
    return NextResponse.json(
      { error: 'Error al obtener el plan' },
      { status: 500 }
    )
  }
}

// PUT /api/admin/planes/:id
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const plan = await prisma.plan.update({
      where: { id },
      data: {
        price: Number(body.price),
        currency: body.currency,
        description: body.description,
        maxProperties: Number(body.maxProperties),
        maxImages: Number(body.maxImages),
        allowVirtualTour: Boolean(body.allowVirtualTour),
        allowHighlight: Boolean(body.allowHighlight),
        allowWhatsapp: Boolean(body.allowWhatsapp),
        allowStats: Boolean(body.allowStats),
        stripePriceId: body.stripePriceId,
        durationDays: Number(body.durationDays),
        isActive: Boolean(body.isActive),
      },
    })

    return NextResponse.json(plan)
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Plan no encontrado' },
        { status: 404 }
      )
    }
    return NextResponse.json(
      { error: 'Error al actualizar el plan' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/planes/:id
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Verificar si tiene suscripciones activas
    const subscriptions = await prisma.subscription.count({
      where: { planId: id, status: 'ACTIVE' },
    })

    if (subscriptions > 0) {
      return NextResponse.json(
        { error: 'No se puede eliminar un plan con suscripciones activas' },
        { status: 409 }
      )
    }

    await prisma.plan.delete({ where: { id } })

    return NextResponse.json({ message: 'Plan eliminado correctamente' })
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Plan no encontrado' },
        { status: 404 }
      )
    }
    return NextResponse.json(
      { error: 'Error al eliminar el plan' },
      { status: 500 }
    )
  }
}