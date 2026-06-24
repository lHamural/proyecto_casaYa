// components/propiedades/ImageUploader.tsx
'use client'

import { useState, useCallback } from 'react'
import Image from 'next/image'
import { X, Upload, Star } from 'lucide-react'

interface ImageData {
  id?: string
  originalPath: string
  webpPath: string
  thumbPath: string
  originalName: string
  size: number
  width: number
  height: number
  isPrimary: boolean
  order: number
}

interface ImageUploaderProps {
  maxImages: number
  onChange: (images: ImageData[]) => void
  value?: ImageData[]
}

export default function ImageUploader({
  maxImages,
  onChange,
  value = [],
}: ImageUploaderProps) {
  const [images, setImages] = useState<ImageData[]>(value)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  // ⚠️ IMPORTANTE: Esta función debe ser async y manejar los archivos
  const handleUpload = useCallback(
    async (files: FileList) => {
      console.log('🔴 1. handleUpload ejecutándose', files.length)
      
      if (images.length + files.length > maxImages) {
        setError(`Solo puedes subir máximo ${maxImages} imágenes con tu plan`)
        return
      }

      setUploading(true)
      setError('')

      const nuevasImagenes: ImageData[] = []

      for (const file of Array.from(files)) {
        console.log(`🔴 2. Subiendo: ${file.name}`)
        
        const formData = new FormData()
        formData.append('file', file)

        try {
          const res = await fetch('/api/upload/image', {
            method: 'POST',
            body: formData,
          })
          
          console.log('🔴 3. Respuesta status:', res.status)
          const data = await res.json()
          console.log('🔴 4. Datos recibidos:', data)

          if (!res.ok) {
            setError(data.error)
            continue
          }

          nuevasImagenes.push({
            id: data.id,
            originalPath: data.originalPath,
            webpPath: data.webpPath,
            thumbPath: data.thumbPath,
            originalName: data.originalName,
            size: data.size,
            width: data.width,
            height: data.height,
            isPrimary: images.length === 0 && nuevasImagenes.length === 0,
            order: images.length + nuevasImagenes.length,
          })
        } catch (error) {
          console.error('Error:', error)
          setError('Error al subir imagen')
        }
      }

      const updated = [...images, ...nuevasImagenes]
      setImages(updated)
      onChange(updated)
      setUploading(false)
    },
    [images, maxImages, onChange]
  )

  const handleRemove = async (index: number) => {
    const imageToRemove = images[index]
    
    if (imageToRemove.id) {
      try {
        await fetch(`/api/upload/imagen?id=${imageToRemove.id}`, {
          method: 'DELETE',
        })
      } catch (error) {
        console.error('Error al eliminar imagen:', error)
      }
    }

    const updated = images
      .filter((_, i) => i !== index)
      .map((img, i) => ({ ...img, isPrimary: i === 0, order: i }))
    setImages(updated)
    onChange(updated)
  }

  const handleSetPrimary = (index: number) => {
    const updated = images.map((img, i) => ({
      ...img,
      isPrimary: i === index,
    }))
    setImages(updated)
    onChange(updated)
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="text-sm text-red-600 bg-red-50 p-3 rounded">{error}</div>
      )}

      <label className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center gap-2 cursor-pointer hover:border-blue-400 transition-colors">
        <Upload className="w-8 h-8 text-gray-400" />
        <p className="text-sm text-gray-600">
          {uploading
            ? 'Procesando imágenes...'
            : `Arrastra imágenes aquí o haz clic para seleccionar`}
        </p>
        <p className="text-xs text-gray-400">
          {images.length}/{maxImages} imágenes — JPG, PNG, WebP — Máx 10MB c/u
        </p>
        <input
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          disabled={uploading || images.length >= maxImages}
          onChange={(e) => {
            console.log('🔴 onChange triggered', e.target.files)
            if (e.target.files && e.target.files.length > 0) {
              console.log('🔴 Llamando a handleUpload')
              handleUpload(e.target.files)
            }
          }}
        />
      </label>

      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {images.map((img, index) => (
            <div key={img.id || index} className="relative group rounded-lg overflow-hidden border">
              {img.thumbPath ? (
                <Image
                  src={img.thumbPath}
                  alt={`Imagen ${index + 1}`}
                  width={200}
                  height={150}
                  className="w-full h-32 object-cover"
                  onError={(e) => console.error('Error cargando imagen:', img.thumbPath, e)}
                />
              ) : (
                <div className="w-full h-32 bg-gray-100 flex items-center justify-center">
                  <span className="text-xs text-gray-400">Sin previsualización</span>
                </div>
              )}
              {img.isPrimary && (
                <span className="absolute top-1 left-1 bg-blue-600 text-white text-xs px-2 py-0.5 rounded">
                  Principal
                </span>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {!img.isPrimary && (
                  <button
                    type="button"
                    onClick={() => handleSetPrimary(index)}
                    className="bg-white rounded-full p-1.5"
                    title="Establecer como principal"
                  >
                    <Star className="w-4 h-4 text-yellow-500" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="bg-white rounded-full p-1.5"
                  title="Eliminar"
                >
                  <X className="w-4 h-4 text-red-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}