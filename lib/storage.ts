// lib/storage.ts
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export interface ProcessedImage {
  originalPath: string
  webpPath: string
  thumbPath: string
  originalName: string
  size: number
  width: number
  height: number
}

export async function processImage(
  buffer: Buffer,
  originalFilename: string
): Promise<ProcessedImage> {
  const result = await new Promise<any>((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder: 'casaya/propiedades',
        eager: [
          { width: 1200, crop: 'limit', quality: 'auto', fetch_format: 'auto' },
          { width: 400, height: 300, crop: 'fill', quality: 'auto', fetch_format: 'auto' },
        ],
      },
      (error, result) => {
        if (error) reject(error)
        else resolve(result)
      }
    ).end(buffer)
  })

  return {
    originalPath: result.secure_url,
    webpPath: result.eager?.[0]?.secure_url || result.secure_url,
    thumbPath: result.eager?.[1]?.secure_url || result.secure_url,
    originalName: originalFilename,
    size: buffer.length,
    width: result.width,
    height: result.height,
  }
}

export async function processTourImage(
  buffer: Buffer,
  originalFilename: string
): Promise<{ path: string; originalPath: string }> {
  const result = await new Promise<any>((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder: 'casaya/tours',
        resource_type: 'image',
      },
      (error, result) => {
        if (error) reject(error)
        else resolve(result)
      }
    ).end(buffer)
  })

  return {
    path: result.secure_url,
    originalPath: result.secure_url,
  }
}

export function deleteImageFiles(publicId: string) {
  cloudinary.uploader.destroy(publicId).catch(err =>
    console.error('Error eliminando imagen:', err)
  )
}