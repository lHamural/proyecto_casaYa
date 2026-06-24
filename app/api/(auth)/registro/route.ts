import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, password, phone, role } = body

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Nombre, email y contraseña son requeridos' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'La contraseña debe tener al menos 6 caracteres' },
        { status: 400 }
      )
    }

    // Verificar si el email ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'El email ya está registrado' },
        { status: 409 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone: phone || null,
        role: role || 'VISITANTE',
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
          userId: user.id,
          planId: planGratuito.id,
          status: 'ACTIVE',
          startDate: new Date(),
        },
      })
    }

    return NextResponse.json(
      { message: 'Usuario creado correctamente', user },
      { status: 201 }
    )
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Error al crear el usuario' },
      { status: 500 }
    )
  }
}