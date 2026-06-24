// app/api/contacto/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    const session = await auth()
    const { nombre, email, telefono, asunto, mensaje } = await request.json()

    // Validación básica
    if (!nombre || !email || !mensaje) {
      return NextResponse.json(
        { error: 'Nombre, email y mensaje son obligatorios' },
        { status: 400 }
      )
    }

    // Guardar mensaje de contacto
    const contacto = await prisma.contactMessage.create({
      data: {
        nombre,
        email,
        telefono: telefono || null,
        asunto: asunto || 'Consulta general',
        mensaje,
        userId: session?.user?.id || null,
      },
    })

    // Aquí podrías agregar envío de email (con nodemailer, resend, etc.)

    return NextResponse.json({
      success: true,
      message: 'Mensaje enviado correctamente',
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Error al enviar mensaje' },
      { status: 500 }
    )
  }
}