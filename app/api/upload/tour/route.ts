// app/api/upload/tour/route.ts (versión sin Sharp)
import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { auth } from '@/auth'

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
      return NextResponse.json({ 
        error: `Tipo no válido: ${file.type}` 
      }, { status: 400 })
    }

    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json({ 
        error: 'La imagen 360° no puede superar 50MB' 
      }, { status: 400 })
    }

    // Guardar archivo sin procesar con Sharp
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'tours')
    await mkdir(uploadDir, { recursive: true })
    
    const timestamp = Date.now()
    const extension = file.name.split('.').pop()
    const fileName = `tour_${timestamp}.${extension}`
    const filePath = path.join(uploadDir, fileName)
    
    await writeFile(filePath, buffer)
    
    console.log('✅ Tour guardado:', filePath)

    return NextResponse.json({
      path: `/uploads/tours/${fileName}`,
      originalPath: `/uploads/tours/${fileName}`,
      title: file.name,
    }, { status: 201 })
    
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Error al procesar el tour' }, { status: 500 })
  }
}