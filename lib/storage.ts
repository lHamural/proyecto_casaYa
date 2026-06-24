// lib/storage.ts
import path from 'path'
import fs from 'fs'
import sharp from 'sharp'
import { v4 as uuidv4 } from 'uuid'

// En desarrollo usa public/uploads, en producción usa ruta externa del VPS
const BASE_UPLOAD_DIR =
  process.env.UPLOAD_DIR || path.join(process.cwd(), 'public', 'uploads')

const DIRS = {
  original: path.join(BASE_UPLOAD_DIR, 'original'),
  webp: path.join(BASE_UPLOAD_DIR, 'webp'),
  tours: path.join(BASE_UPLOAD_DIR, 'tours'),
  thumbs: path.join(BASE_UPLOAD_DIR, 'thumbs'),
}

// Crear directorios si no existen
export function ensureDirectories() {
  Object.values(DIRS).forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
  })
}

export interface ProcessedImage {
  originalPath: string  // ruta relativa para guardar en BD
  webpPath: string
  thumbPath: string
  originalName: string
  size: number
  width: number
  height: number
}

// Procesar imagen normal: guarda original + convierte a webp + genera thumb
export async function processImage(
  buffer: Buffer,
  originalFilename: string
): Promise<ProcessedImage> {
  ensureDirectories()

  const uuid = uuidv4()
  const ext = path.extname(originalFilename).toLowerCase()
  const originalFilename_ = `${uuid}${ext}`
  const webpFilename = `${uuid}.webp`
  const thumbFilename = `${uuid}_thumb.webp`

  // Guardar imagen original sin modificar
  const originalFullPath = path.join(DIRS.original, originalFilename_)
  fs.writeFileSync(originalFullPath, buffer)

  // Obtener metadata
  const metadata = await sharp(buffer).metadata()
  const width = metadata.width || 800
  const height = metadata.height || 600

  // Convertir a WebP optimizado (calidad 85)
  const webpFullPath = path.join(DIRS.webp, webpFilename)
  await sharp(buffer)
    .webp({ quality: 85 })
    .resize({ width: 1200, withoutEnlargement: true })
    .toFile(webpFullPath)

  // Generar thumbnail WebP (400x300)
  const thumbFullPath = path.join(DIRS.thumbs, thumbFilename)
  await sharp(buffer)
    .webp({ quality: 75 })
    .resize({ width: 400, height: 300, fit: 'cover' })
    .toFile(thumbFullPath)

  return {
    originalPath: `/uploads/original/${originalFilename_}`,
    webpPath: `/uploads/webp/${webpFilename}`,
    thumbPath: `/uploads/thumbs/${thumbFilename}`,
    originalName: originalFilename,
    size: buffer.length,
    width,
    height,
  }
}

// Procesar imagen 360° para tour virtual
// lib/storage.ts - Agrega logs para verificar
export async function processTourImage(
  buffer: Buffer,
  originalFilename: string
): Promise<{ path: string; originalPath: string }> {
  ensureDirectories()

  const uuid = uuidv4()
  const ext = path.extname(originalFilename).toLowerCase()

  console.log('📁 Guardando tour con UUID:', uuid)
  console.log('📁 Directorio tours:', DIRS.tours)

  // Guardar original
  const originalFilename_ = `tour_${uuid}${ext}`
  const originalFullPath = path.join(DIRS.tours, originalFilename_)
  fs.writeFileSync(originalFullPath, buffer)
  console.log('✅ Original guardado:', originalFullPath)

  // Convertir a WebP
  const webpFilename = `tour_${uuid}.webp`
  const webpFullPath = path.join(DIRS.tours, webpFilename)
  await sharp(buffer)
    .webp({ quality: 90 })
    .toFile(webpFullPath)
  console.log('✅ WebP guardado:', webpFullPath)

  return {
    path: `/uploads/tours/${webpFilename}`,
    originalPath: `/uploads/tours/${originalFilename_}`,
  }
}
// Eliminar archivos de una imagen
export function deleteImageFiles(webpPath: string) {
  try {
    // Eliminar webp
    const webpFull = path.join(process.cwd(), 'public', webpPath)
    if (fs.existsSync(webpFull)) fs.unlinkSync(webpFull)

    // Eliminar original (inferir nombre)
    const uuid = path.basename(webpPath, '.webp')
    const originalDir = path.join(BASE_UPLOAD_DIR, 'original')
    const files = fs.readdirSync(originalDir)
    const originalFile = files.find((f) => f.startsWith(uuid))
    if (originalFile) {
      fs.unlinkSync(path.join(originalDir, originalFile))
    }

    // Eliminar thumb
    const thumbPath = path.join(BASE_UPLOAD_DIR, 'thumbs', `${uuid}_thumb.webp`)
    if (fs.existsSync(thumbPath)) fs.unlinkSync(thumbPath)
  } catch (error) {
    console.error('Error eliminando archivos:', error)
  }
}