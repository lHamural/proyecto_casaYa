// app/api/usuario/perfil/route.ts
import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

export async function PUT(request: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { name, phone } = await request.json()

    // Validar datos
    if (!name || name.trim().length < 2) {
      return NextResponse.json(
        { error: 'El nombre debe tener al menos 2 caracteres' },
        { status: 400 }
      )
    }

    // Actualizar usuario
    const usuario = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: name.trim(),
        phone: phone || null,
      },
    })

    return NextResponse.json({
      success: true,
      usuario: {
        id: usuario.id,
        name: usuario.name,
        email: usuario.email,
        phone: usuario.phone,
      },
    })
  } catch (error) {
    console.error('Error al actualizar perfil:', error)
    return NextResponse.json(
      { error: 'Error al actualizar perfil' },
      { status: 500 }
    )
  }
}