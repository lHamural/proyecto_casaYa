// app/api/upload/image/route.ts (versión sin Sharp)
import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { auth } from '@/auth'
import { v4 as uuidv4 } from 'uuid'

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

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ 
        error: 'La imagen no puede superar 10MB' 
      }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'original')
    await mkdir(uploadDir, { recursive: true })
    
    const uuid = uuidv4()
    const extension = file.name.split('.').pop()
    const fileName = `${uuid}.${extension}`
    const filePath = path.join(uploadDir, fileName)
    
    await writeFile(filePath, buffer)
    
    // Copiar a webp y thumbs (sin Sharp, solo copia)
    const webpDir = path.join(process.cwd(), 'public', 'uploads', 'webp')
    const thumbsDir = path.join(process.cwd(), 'public', 'uploads', 'thumbs')
    await mkdir(webpDir, { recursive: true })
    await mkdir(thumbsDir, { recursive: true })
    
    // Copiar el mismo archivo a webp y thumbs (como fallback)
    const webpPath = path.join(webpDir, `${uuid}.webp`)
    const thumbPath = path.join(thumbsDir, `${uuid}_thumb.webp`)
    await writeFile(webpPath, buffer)
    await writeFile(thumbPath, buffer)

    return NextResponse.json({
      id: uuid,
      originalPath: `/uploads/original/${fileName}`,
      webpPath: `/uploads/webp/${uuid}.webp`,
      thumbPath: `/uploads/thumbs/${uuid}_thumb.webp`,
      originalName: file.name,
      size: file.size,
      width: 800,
      height: 600,
      isPrimary: false,
      order: 0,
    }, { status: 201 })
    
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Error al subir imagen' }, { status: 500 })
  }
}   