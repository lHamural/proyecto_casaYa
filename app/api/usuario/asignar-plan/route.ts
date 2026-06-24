// app/api/admin/usuarios/asignar-plan/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'SUPERADMIN') {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const body = await request.json()
    console.log('📦 Body recibido:', body)

    const { usuarioId, planId } = body

    if (!usuarioId || !planId) {
      return NextResponse.json(
        { error: 'Faltan datos: usuarioId y planId son requeridos' },
        { status: 400 }
      )
    }

    // Verificar que el usuario existe
    const usuario = await prisma.user.findUnique({
      where: { id: usuarioId },
    })

    if (!usuario) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    // Verificar que el plan existe
    const plan = await prisma.plan.findUnique({
      where: { id: planId },
    })

    if (!plan) {
      return NextResponse.json(
        { error: 'Plan no encontrado' },
        { status: 404 }
      )
    }

    // Desactivar suscripciones activas anteriores
    await prisma.subscription.updateMany({
      where: {
        userId: usuarioId,
        status: 'ACTIVE',
      },
      data: { status: 'EXPIRED' },
    })

    // Calcular fecha de expiración
    const endDate = new Date()
    endDate.setDate(endDate.getDate() + plan.durationDays)

    // Crear nueva suscripción
    const subscription = await prisma.subscription.create({
      data: {
        userId: usuarioId,
        planId: plan.id,
        status: 'ACTIVE',
        startDate: new Date(),
        endDate,
      },
      include: {
        plan: true,
      },
    })

    console.log('✅ Suscripción creada:', subscription.id)

    return NextResponse.json({
      success: true,
      subscription,
      message: `Plan ${plan.name} asignado correctamente a ${usuario.name || usuario.email}`,
    })
  } catch (error) {
    console.error('❌ Error detallado:', error)
    return NextResponse.json(
      { 
        error: 'Error al asignar plan',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    )
  }
} 