// app/api/propiedades/[id]/comentarios/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

export const runtime = 'nodejs'

// GET - Obtener comentarios de una propiedad
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const comentarios = await prisma.comment.findMany({
      where: {
        propertyId: id,
        isActive: true,
        parentId: null,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        replies: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
          where: { isActive: true },
        },
        _count: {
          select: {
            replies: true,  // ← Asegurar que se incluye
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    })

    return NextResponse.json(comentarios)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Error al obtener comentarios' }, { status: 500 })
  }
}

// POST - Crear comentario
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
    const { content, parentId } = await request.json()

    if (!content || content.trim().length === 0) {
      return NextResponse.json({ error: 'El comentario no puede estar vacío' }, { status: 400 })
    }

    const comentario = await prisma.comment.create({
      data: {
        content: content.trim(),
        userId: session.user.id,
        propertyId: id,
        parentId: parentId || null,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            replies: true,
          },
        },
      },
    })

    return NextResponse.json(comentario, { status: 201 })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Error al crear comentario' }, { status: 500 })
  }
}