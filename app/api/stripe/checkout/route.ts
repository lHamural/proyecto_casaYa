import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { planId } = await request.json()

    const plan = await prisma.plan.findUnique({ where: { id: planId } })
    if (!plan) {
      return NextResponse.json({ error: 'Plan no encontrado' }, { status: 404 })
    }

    // ============================================================
    // PLAN GRATUITO
    // ============================================================
    if (plan.price === 0) {
      // Verificar si ya tuvo un plan gratuito antes
      const hadFreePlan = await prisma.subscription.findFirst({
        where: { 
          userId: session.user.id,
          plan: { price: 0 }
        }
      })

      if (hadFreePlan) {
        return NextResponse.json(
          { error: 'El plan gratuito solo puede activarse una vez. Contrata un plan de pago.' },
          { status: 400 }
        )
      }

      // Desactivar suscripciones activas anteriores
      await prisma.subscription.updateMany({
        where: { 
          userId: session.user.id,
          status: 'ACTIVE'
        },
        data: { status: 'EXPIRED' }
      })

      const endDate = new Date()
      endDate.setDate(endDate.getDate() + plan.durationDays)

      await prisma.subscription.create({
        data: {
          userId: session.user.id,
          planId: plan.id,
          status: 'ACTIVE',
          startDate: new Date(),
          endDate,
        },
      })

      return NextResponse.json({ 
        url: '/admin/suscripcion?success=true&plan=free' 
      })
    }

    // ============================================================
    // PLAN DE PAGO
    // ============================================================
    if (!plan.stripePriceId) {
      return NextResponse.json(
        { error: 'Plan no configurado correctamente' },
        { status: 400 }
      )
    }

    // Obtener suscripción activa actual
    const currentSubscription = await prisma.subscription.findFirst({
      where: { 
        userId: session.user.id,
        status: 'ACTIVE'
      },
      orderBy: { createdAt: 'desc' },
    })

    let stripeCustomerId = currentSubscription?.stripeCustomerId

    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: session.user.email!,
        name: session.user.name || undefined,
        metadata: { userId: session.user.id },
      })
      stripeCustomerId = customer.id
    }

    // Crear sesión de checkout
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: plan.stripePriceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXTAUTH_URL}/admin/suscripcion?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/admin/suscripcion?cancelled=true`,
      metadata: {
        userId: session.user.id,
        planId: plan.id,
      },
    })

    return NextResponse.json({ url: checkoutSession.url })
  } catch (error) {
    console.error('Error en checkout:', error)
    return NextResponse.json(
      { error: 'Error al crear sesión de pago' },
      { status: 500 }
    )
  }
}