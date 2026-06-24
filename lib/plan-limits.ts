import { prisma } from '@/lib/prisma'

export async function getPlanLimits(userId: string) {
  // Obtener suscripción activa
  const subscription = await prisma.subscription.findFirst({
    where: { 
      userId,
      status: 'ACTIVE'
    },
    include: { plan: true },
    orderBy: { createdAt: 'desc' },
  })

  if (!subscription) {
    // Plan gratuito por defecto
    const freePlan = await prisma.plan.findFirst({
      where: { price: 0 }
    })
    
    if (!freePlan) {
      return null
    }

    const propertyCount = await prisma.property.count({
      where: { userId, status: { not: 'SOLD' } },
    })

    return {
      plan: freePlan,
      canPublish: propertyCount < freePlan.maxProperties,
      remainingProperties: freePlan.maxProperties - propertyCount,
      maxImages: freePlan.maxImages,
      allowVirtualTour: freePlan.allowVirtualTour,
      allowHighlight: freePlan.allowHighlight,
      allowWhatsapp: freePlan.allowWhatsapp,
      allowStats: freePlan.allowStats,
      propertyCount,
      subscriptionStatus: null,
      expiresAt: null,
    }
  }

  const propertyCount = await prisma.property.count({
    where: { userId, status: { not: 'SOLD' } },
  })

  return {
    plan: subscription.plan,
    canPublish: propertyCount < subscription.plan.maxProperties,
    remainingProperties: subscription.plan.maxProperties - propertyCount,
    maxImages: subscription.plan.maxImages,
    allowVirtualTour: subscription.plan.allowVirtualTour,
    allowHighlight: subscription.plan.allowHighlight,
    allowWhatsapp: subscription.plan.allowWhatsapp,
    allowStats: subscription.plan.allowStats,
    propertyCount,
    subscriptionStatus: subscription.status,
    expiresAt: subscription.endDate,
  }
}

export type PlanLimits = Awaited<ReturnType<typeof getPlanLimits>>