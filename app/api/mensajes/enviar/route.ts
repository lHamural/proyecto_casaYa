// app/api/mensajes/enviar/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { propertyId, ownerId, mensaje } = await request.json()

    if (!propertyId || !ownerId || !mensaje) {
      return NextResponse.json(
        { error: 'Faltan datos requeridos' },
        { status: 400 }
      )
    }

    // Verificar que la propiedad existe
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
    })

    if (!property) {
      return NextResponse.json(
        { error: 'Propiedad no encontrada' },
        { status: 404 }
      )
    }

    // Crear el contacto
    const contacto = await prisma.contactRequest.create({
      data: {
        propertyId,
        fromUserId: session.user.id,
        name: session.user.name || 'Usuario',
        email: session.user.email || '',
        message: mensaje,
        channel: 'EMAIL',
      },
    })

    // Crear notificación para el propietario
    await prisma.notification.create({
      data: {
        userId: ownerId,
        title: 'Nuevo mensaje en tu propiedad',
        message: `${session.user.name || 'Alguien'} está interesado en "${property.title}"`,
        type: 'CONTACT',
        relatedId: propertyId,
        relatedType: 'PROPERTY',
      },
    })

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