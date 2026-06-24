import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import Stripe from 'stripe'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  const body = await request.text()
  const signature = (await headers()).get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Error verificando webhook:', err)
    return NextResponse.json({ error: 'Webhook signature inválida' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.userId
        const planId = session.metadata?.planId

        if (!userId || !planId) break

        const plan = await prisma.plan.findUnique({ where: { id: planId } })
        if (!plan) break

        const endDate = new Date()
        endDate.setDate(endDate.getDate() + plan.durationDays)

        // Desactivar suscripciones activas anteriores
        await prisma.subscription.updateMany({
          where: { 
            userId, 
            status: 'ACTIVE' 
          },
          data: { status: 'EXPIRED' },
        })

        // Crear nueva suscripción
        await prisma.subscription.create({
          data: {
            userId,
            planId,
            status: 'ACTIVE',
            stripeCustomerId: session.customer as string,
            stripeSubscriptionId: session.subscription as string,
            startDate: new Date(),
            endDate,
          },
        })

        console.log('✅ Nueva suscripción creada para usuario:', userId)
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        await prisma.subscription.updateMany({
          where: { stripeSubscriptionId: subscription.id },
          data: { status: 'CANCELLED' },
        })
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Error en webhook:', error)
    return NextResponse.json({ error: 'Error procesando webhook' }, { status: 500 })
  }
}