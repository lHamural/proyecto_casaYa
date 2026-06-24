import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const suscripciones = await prisma.subscription.findMany({
      where: { userId: session.user.id },
      include: {
        plan: {
          select: {
            name: true,
            price: true,
            currency: true,
          }
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(suscripciones)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Error al obtener historial' },
      { status: 500 }
    )
  }
}