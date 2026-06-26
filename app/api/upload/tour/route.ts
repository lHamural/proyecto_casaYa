import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { processTourImage } from '@/lib/storage'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file' }, { status: 400 })
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: `Tipo no válido: ${file.type}` }, { status: 400 })
    }

    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json({ error: 'La imagen 360° no puede superar 50MB' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const result = await processTourImage(buffer, file.name)

    return NextResponse.json({
      path: result.path,
      originalPath: result.originalPath,
      publicId: result.path.replace('/uploads/tours/', '').replace(/\.[^.]+$/, ''),
      title: file.name.replace(/\.[^/.]+$/, ''),
    }, { status: 201 })

  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Error al procesar el tour' }, { status: 500 })
  }
}
