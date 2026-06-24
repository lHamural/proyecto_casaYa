import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

// GET /api/admin/usuarios
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const role = searchParams.get('role')
    const estado = searchParams.get('estado')
    const buscar = searchParams.get('buscar')

    const usuarios = await prisma.user.findMany({
      where: {
        ...(role && { role: role as any }),
        ...(estado && { isActive: estado === 'activo' }),
        ...(buscar && {
          OR: [
            { name: { contains: buscar, mode: 'insensitive' } },
            { email: { contains: buscar, mode: 'insensitive' } },
          ],
        }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        isActive: true,
        createdAt: true,
        avatar: true,
        subscriptions: {
          select: {
            status: true,
            plan: {
              select: { name: true },
            },
          },
        },
        _count: {
          select: { properties: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(usuarios)
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al obtener usuarios' },
      { status: 500 }
    )
  }
}

// POST /api/admin/usuarios
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, password, phone, whatsapp, role } = body

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Nombre, email y contraseña son requeridos' },
        { status: 400 }
      )
    }

    const existe = await prisma.user.findUnique({ where: { email } })
    if (existe) {
      return NextResponse.json(
        { error: 'El email ya está registrado' },
        { status: 409 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const usuario = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone: phone || null,
        whatsapp: whatsapp || null,
        role: role || 'VISITANTE',
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    })

    // Asignar plan GRATUITO automáticamente
    const planGratuito = await prisma.plan.findUnique({
      where: { name: 'GRATUITO' },
    })

    if (planGratuito) {
      await prisma.subscription.create({
        data: {
          userId: usuario.id,
          planId: planGratuito.id,
          status: 'ACTIVE',
          startDate: new Date(),
        },
      })
    }

    return NextResponse.json(usuario, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al crear usuario' },
      { status: 500 }
    )
  }
}