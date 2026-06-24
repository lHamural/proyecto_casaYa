// app/(public)/components/PropertyGallery.tsx
'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { Dialog, DialogContent } from '@/components/ui/dialog'

interface PropertyGalleryProps {
  images: { id: string; webpPath: string; thumbPath: string }[]
}

export function PropertyGallery({ images }: PropertyGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)

  if (images.length === 0) {
    return (
      <div className="h-96 bg-muted rounded-xl flex items-center justify-center">
        <p className="text-muted-foreground">Sin imágenes</p>
      </div>
    )
  }

  const currentImage = images[currentIndex]

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <>
      {/* Imagen principal */}
      <div className="relative h-[400px] md:h-[500px] rounded-xl overflow-hidden bg-muted">
        <Image
          src={currentImage.webpPath}
          alt="Propiedad"
          fill
          className="object-cover cursor-pointer"
          onClick={() => setIsModalOpen(true)}
        />
        
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              {currentIndex + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {/* Miniaturas */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2 mt-2">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setCurrentIndex(index)}
              className={`relative h-20 rounded-lg overflow-hidden ${
                index === currentIndex ? 'ring-2 ring-primary' : ''
              }`}
            >
              <Image
                src={image.thumbPath}
                alt={`Miniatura ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Modal fullscreen */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-[95vw] w-[95vw] h-[90vh] p-0 bg-black">
          <button
            onClick={() => setIsModalOpen(false)}
            className="absolute top-4 right-4 text-white bg-black/50 p-2 rounded-full hover:bg-black/70 z-10"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="relative w-full h-full">
            <Image
              src={currentImage.webpPath}
              alt="Propiedad"
              fill
              className="object-contain"
            />
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}