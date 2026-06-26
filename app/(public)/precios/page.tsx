import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { PricingPlans } from './PricingPlans'

export const dynamic = 'force-dynamic'

export default async function PreciosPage() {
  const session = await auth()
  const planes = await prisma.plan.findMany({
    where: { isActive: true },
    orderBy: { price: 'asc' },
  })

  return <PricingPlans planes={planes} isLoggedIn={!!session?.user} />
}
