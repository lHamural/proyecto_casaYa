import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

export const runtime = 'nodejs'

export async function POST() {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const subscription = await prisma.subscription.findUnique({
      where: { userId: session.user.id },
    })

    if (!subscription?.stripeSubscriptionId) {
      return NextResponse.json(
        { error: 'No tienes una suscripción activa' },
        { status: 400 }
      )
    }

    // Cancelar al final del período en Stripe
    await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
      cancel_at_period_end: true,
    })

    await prisma.subscription.update({
      where: { userId: session.user.id },
      data: { status: 'CANCELLED' },
    })

    return NextResponse.json({
      message: 'Suscripción cancelada. Seguirá activa hasta el fin del período.',
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al cancelar suscripción' },
      { status: 500 }
    )
  }
}