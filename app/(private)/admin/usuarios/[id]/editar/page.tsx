import { prisma } from '@/lib/prisma'
import UsuarioForm from '@/components/ui/admin/usuarios/UsuarioForm'
import { notFound } from 'next/navigation'

export default async function EditarUsuarioPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const usuario = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      whatsapp: true,
      role: true,
      isActive: true,
    },
  })

  if (!usuario) notFound()

  return (
    <div className="space-y-6">

      <UsuarioForm initialData={usuario} isEditing />
    </div>
  )
}