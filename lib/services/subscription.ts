import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'

export async function ensureSubscriptionFromSession(
  sessionId: string,
  userId: string
) {
  try {
    const stripeSession = await stripe.checkout.sessions.retrieve(sessionId)
    const { userId: metaUserId, planId } = stripeSession.metadata || {}

    if (metaUserId !== userId || !planId) return

    const existingSub = await prisma.subscription.findFirst({
      where: { stripeSubscriptionId: stripeSession.subscription as string }
    })

    if (existingSub) return

    const plan = await prisma.plan.findUnique({ where: { id: planId } })
    if (!plan) return

    const endDate = new Date()
    endDate.setDate(endDate.getDate() + plan.durationDays)

    await prisma.subscription.updateMany({
      where: { userId, status: 'ACTIVE' },
      data: { status: 'EXPIRED' },
    })

    await prisma.subscription.create({
      data: {
        userId,
        planId,
        status: 'ACTIVE',
        stripeCustomerId: stripeSession.customer as string,
        stripeSubscriptionId: stripeSession.subscription as string,
        startDate: new Date(),
        endDate,
      },
    })
  } catch (e) {
    console.error('Error en ensureSubscriptionFromSession:', e)
  }
}
