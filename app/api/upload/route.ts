// app/api/propiedades/upload/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const formData = await req.formData()
    const files = formData.getAll('files') as File[]

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No se recibieron archivos' }, { status: 400 })
    }

    for (const file of files) {
      const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
      if (!validTypes.includes(file.type)) {
        return NextResponse.json({ error: `Tipo de archivo no válido: ${file.name}` }, { status: 400 })
      }
      if (file.size > 4 * 1024 * 1024) {
        return NextResponse.json({ error: `Archivo demasiado grande: ${file.name}` }, { status: 400 })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error al subir imágenes:', error)
    return NextResponse.json({ error: 'Error al procesar las imágenes' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const imagePath = searchParams.get('path')

    if (!imagePath) {
      return NextResponse.json({ error: 'No se especificó la imagen' }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Error al eliminar imagen' }, { status: 500 })
  }
}