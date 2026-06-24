// components/ui/ImageUpload.tsx
'use client'

import { useState, useEffect } from 'react'
import { UploadDropzone } from '@uploadthing/react'
import { X, Image as ImageIcon, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Image from 'next/image'
import type { OurFileRouter } from '@/lib/updaloadting'

interface ImageUploadProps {
  onImagesChange: (urls: string[]) => void
  initialImages?: string[]
  maxImages?: number
}

export function ImageUpload({
  onImagesChange,
  initialImages = [],
  maxImages = 10
}: ImageUploadProps) {
  const [images, setImages] = useState<string[]>(initialImages)
  const [isUploading, setIsUploading] = useState(false)

  useEffect(() => {
    onImagesChange(images)
  }, [images, onImagesChange])

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-4">
      {/* Grid de imágenes subidas */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((url, index) => (
            <Card key={index} className="relative group overflow-hidden">
              <div className="aspect-square relative">
                <Image
                  src={url}
                  alt={`Imagen ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
            </Card>
          ))}
        </div>
      )}

      {/* Dropzone para subir nuevas imágenes */}
      {images.length < maxImages && (
        <UploadDropzone<OurFileRouter, "propertyImage">
          endpoint="propertyImage"
          onClientUploadComplete={(res) => {
            const urls = res?.map(r => r.url) || []
            setImages(prev => [...prev, ...urls])
            setIsUploading(false)
          }}
          onUploadError={(error) => {
            console.error(error)
            setIsUploading(false)
          }}
          onUploadBegin={() => {
            setIsUploading(true)
          }}
          className="border-2 border-dashed rounded-lg p-6 cursor-pointer hover:border-primary transition-colors"
        />
      )}

      {isUploading && (
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Subiendo imagen...</span>
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        Máximo {maxImages} imágenes. Formatos: JPG, PNG, WEBP. Máx 4MB por imagen.
      </p>
    </div>
  )
}