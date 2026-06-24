import { prisma } from '@/lib/prisma'
import PlanForm from '@/components/ui/admin/planes/PlanForm'
import { notFound } from 'next/navigation'

export default async function EditarPlanPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const plan = await prisma.plan.findUnique({
    where: { id },
  })

  if (!plan) notFound()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Editar Plan {plan.name}</h1>
        <p className="text-gray-500 text-sm">
          Modifica las condiciones del plan
        </p>
      </div>
      <PlanForm initialData={plan} planName={plan.name} isEditing />
    </div>
  )
}