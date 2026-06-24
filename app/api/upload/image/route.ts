// app/api/upload/image/route.ts
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

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'La imagen no puede superar 10MB' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const result = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: 'casaya/propiedades',
          transformation: [{ quality: 'auto', fetch_format: 'auto' }],
          eager: [
            { width: 800, crop: 'limit', quality: 'auto', fetch_format: 'auto' },
            { width: 300, height: 200, crop: 'fill', quality: 'auto', fetch_format: 'auto' },
          ],
        },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        }
      ).end(buffer)
    })

    return NextResponse.json({
      id: result.public_id,
      originalPath: result.secure_url,
      webpPath: result.eager?.[0]?.secure_url || result.secure_url,
      thumbPath: result.eager?.[1]?.secure_url || result.secure_url,
      originalName: file.name,
      size: file.size,
      width: result.width,
      height: result.height,
      isPrimary: false,
      order: 0,
    }, { status: 201 })

  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Error al subir imagen' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID requerido' }, { status: 400 })
    }

    await cloudinary.uploader.destroy(id)

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Error al eliminar imagen' }, { status: 500 })
  }
}