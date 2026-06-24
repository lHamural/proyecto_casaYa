'use client'

import { useState } from 'react'
import TourViewer from './TourViewer'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight, faVrCardboard } from '@fortawesome/free-solid-svg-icons'
import { cn } from '@/lib/utils'

interface Tour {
  id: string
  imagePath: string
  title: string | null
  description: string | null
  order: number
}

interface TourGalleryProps {
  tours: Tour[]
}

export default function TourGallery({ tours }: TourGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)

  if (!tours || tours.length === 0) {
    return null
  }

  const selectedTour = tours[selectedIndex]

  const goToPrevious = () => {
    setSelectedIndex((prev) => (prev === 0 ? tours.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setSelectedIndex((prev) => (prev === tours.length - 1 ? 0 : prev + 1))
  }

  return (
    <div className="space-y-4">
      {/* Visor principal */}
      <div className="relative">
        <TourViewer
          imageUrl={selectedTour.imagePath}
          height="500px"
          title={selectedTour.title || undefined}
        />
        
        {tours.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all backdrop-blur-sm"
            >
              <FontAwesomeIcon icon={faChevronLeft} className="w-5 h-5" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all backdrop-blur-sm"
            >
              <FontAwesomeIcon icon={faChevronRight} className="w-5 h-5" />
            </button>
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 bg-black/60 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full">
              {selectedIndex + 1} / {tours.length}
            </div>
          </>
        )}
      </div>

      {/* Miniaturas */}
      {tours.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {tours.map((tour, index) => (
            <button
              key={tour.id}
              onClick={() => setSelectedIndex(index)}
              className={cn(
                'flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden border-2 transition-all relative group',
                selectedIndex === index 
                  ? 'border-primary shadow-md' 
                  : 'border-gray-200 hover:border-gray-400'
              )}
            >
              <div 
                className="w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url(${tour.imagePath})` }}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
              {selectedIndex === index && (
                <div className="absolute inset-0 border-2 border-primary rounded-lg pointer-events-none" />
              )}
              <div className="absolute bottom-1 right-1 bg-black/60 text-white rounded-full p-0.5">
                <FontAwesomeIcon icon={faVrCardboard} className="w-3 h-3" />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}