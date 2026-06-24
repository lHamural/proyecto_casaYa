'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faTrash, faVrCardboard } from '@fortawesome/free-solid-svg-icons'
import Image from 'next/image'

interface TourUploaderProps {
  value: any[]
  onChange: (tours: any[]) => void
  maxTours?: number
}

export default function TourUploader({ value = [], onChange, maxTours = 5 }: TourUploaderProps) {
  const [tours, setTours] = useState<any[]>(value)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (files: FileList) => {
    const remaining = maxTours - tours.length
    if (files.length > remaining) {
      setError(`Solo puedes subir ${remaining} tours más.`)
      return
    }

    setUploading(true)
    setError('')
    const newTours: any[] = []

    for (const file of Array.from(files)) {
      try {
        const formData = new FormData()
        formData.append('file', file)

        const res = await fetch('/api/upload/tour', {
          method: 'POST',
          body: formData,
        })

        if (!res.ok) {
          const text = await res.text()
          throw new Error(text || 'Error al subir tour')
        }

        const data = await res.json()
        newTours.push({
          imagePath: data.path,
          originalPath: data.originalPath || data.path,
          title: data.title || 'Recorrido Virtual',
          order: tours.length + newTours.length,
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al subir')
      }
    }

    if (newTours.length > 0) {
      const updated = [...tours, ...newTours]
      setTours(updated)
      onChange(updated)
    }

    setUploading(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const removeTour = (index: number) => {
    const updated = [...tours]
    updated.splice(index, 1)
    setTours(updated)
    onChange(updated)
  }

  const updateTitle = (index: number, title: string) => {
    const updated = [...tours]
    updated[index].title = title
    setTours(updated)
    onChange(updated)
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="text-sm text-red-600 bg-red-50 p-3 rounded">{error}</div>
      )}

      {tours.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {tours.map((tour, index) => (
            <div key={index} className="relative group border-2 border-purple-100 rounded-xl p-3 bg-purple-50/30">
              <div className="relative h-32 rounded-lg overflow-hidden bg-gray-100">
                {tour.imagePath ? (
                  <Image
                    src={tour.imagePath}
                    alt={tour.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <FontAwesomeIcon icon={faVrCardboard} className="text-4xl" />
                  </div>
                )}
                <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                  <FontAwesomeIcon icon={faVrCardboard} />
                  360°
                </div>
                <button
                  type="button"
                  onClick={() => removeTour(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                >
                  <FontAwesomeIcon icon={faTrash} className="text-xs" />
                </button>
              </div>
              <div className="mt-2">
                <Input
                  value={tour.title || ''}
                  onChange={(e) => updateTitle(index, e.target.value)}
                  placeholder="Título del recorrido"
                  className="h-8 text-sm bg-white border-0 focus:ring-2 focus:ring-purple-300 rounded"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {tours.length < maxTours && (
        <>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => {
              if (e.target.files?.length) handleUpload(e.target.files)
              e.target.value = ''
            }}
            className="hidden"
            id="tour-upload"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="w-full border-dashed border-2 border-purple-300 hover:bg-purple-50 transition-colors py-8"
          >
            {uploading ? (
              'Subiendo...'
            ) : (
              <>
                <FontAwesomeIcon icon={faPlus} className="mr-2 text-purple-500" />
                Subir recorrido virtual (360°)
              </>
            )}
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            {tours.length} de {maxTours} tours subidos
          </p>
        </>
      )}
    </div>
  )
}