// app/api/propiedades/[id]/like/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

export const runtime = 'nodejs'

// POST - Dar like a una propiedad
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { id } = await params

    // Verificar si el usuario ya dio like
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_propertyId: {
          userId: session.user.id,
          propertyId: id,
        },
      },
    })

    if (existingLike) {
      // Si ya existe, eliminarlo (unlike)
      await prisma.like.delete({
        where: {
          userId_propertyId: {
            userId: session.user.id,
            propertyId: id,
          },
        },
      })
      return NextResponse.json({ liked: false })
    } else {
      // Si no existe, crearlo (like)
      await prisma.like.create({
        data: {
          userId: session.user.id,
          propertyId: id,
        },
      })
      return NextResponse.json({ liked: true })
    }
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Error al procesar like' }, { status: 500 })
  }
}

// GET - Verificar si el usuario dio like
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ liked: false })
    }

    const { id } = await params

    const like = await prisma.like.findUnique({
      where: {
        userId_propertyId: {
          userId: session.user.id,
          propertyId: id,
        },
      },
    })

    return NextResponse.json({ liked: !!like })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ liked: false })
  }
}