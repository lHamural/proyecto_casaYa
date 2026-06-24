import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

// GET /api/admin/usuarios/:id
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
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
        avatar: true,
        createdAt: true,
        subscription: {
          select: {
            status: true,
            startDate: true,
            endDate: true,
            plan: { select: { name: true, price: true } },
          },
        },
        _count: {
          select: { properties: true, likes: true, comments: true },
        },
      },
    })

    if (!usuario) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(usuario)
  } catch {
    return NextResponse.json(
      { error: 'Error al obtener usuario' },
      { status: 500 }
    )
  }
}

// PUT /api/admin/usuarios/:id
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { name, email, phone, whatsapp, role, isActive, password } = body

    const data: any = {
      name,
      email,
      phone: phone || null,
      whatsapp: whatsapp || null,
      role,
      isActive,
    }

    // Solo actualizar contraseña si se envió una nueva
    if (password && password.length >= 6) {
      data.password = await bcrypt.hash(password, 12)
    }

    const usuario = await prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
      },
    })

    return NextResponse.json(usuario)
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'El email ya está en uso' },
        { status: 409 }
      )
    }
    return NextResponse.json(
      { error: 'Error al actualizar usuario' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/usuarios/:id
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Proteger al superadmin
    const usuario = await prisma.user.findUnique({
      where: { id },
      select: { role: true },
    })

    if (usuario?.role === 'SUPERADMIN') {
      return NextResponse.json(
        { error: 'No se puede eliminar al superadmin' },
        { status: 403 }
      )
    }

    await prisma.user.delete({ where: { id } })

    return NextResponse.json({ message: 'Usuario eliminado correctamente' })
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }
    return NextResponse.json(
      { error: 'Error al eliminar usuario' },
      { status: 500 }
    )
  }
}