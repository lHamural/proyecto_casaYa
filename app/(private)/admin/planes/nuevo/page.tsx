import PlanForm from '@/components/admin/planes/PlanForm'

  export default function NuevoPlanPage() {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Nuevo Plan</h1>
          <p className="text-gray-500 text-sm">
            Crea un nuevo plan de suscripción
          </p>
        </div>
        <PlanForm />
      </div>
    )
  }