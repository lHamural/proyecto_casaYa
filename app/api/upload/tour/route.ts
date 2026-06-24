// app/api/upload/tour/route.ts
import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { v2 as cloudinary } from 'cloudinary'

export const runtime = 'nodejs'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

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

    const result = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: 'casaya/tours',
          resource_type: 'image',
          // Sin transformaciones para preservar la imagen 360° intacta
        },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        }
      ).end(buffer)
    })

    return NextResponse.json({
      path: result.secure_url,
      originalPath: result.secure_url,
      publicId: result.public_id,
      title: file.name.replace(/\.[^/.]+$/, ''), // nombre sin extensión
    }, { status: 201 })

  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Error al procesar el tour' }, { status: 500 })
  }
}