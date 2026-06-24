'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faVrCardboard,
  faEye,
  faPlay,
} from '@fortawesome/free-solid-svg-icons'
import TourModal from './TourModal'

interface VirtualToursSectionProps {
  tours: {
    id: string
    imagePath: string
    title: string | null
    order: number
  }[]
}

export default function VirtualToursSection({ tours }: VirtualToursSectionProps) {
  const [selectedTour, setSelectedTour] = useState<string | null>(null)
  const [selectedTourTitle, setSelectedTourTitle] = useState<string | undefined>()

  if (!tours || tours.length === 0) return null

  return (
    <>
      <Card className="border-0 shadow-xl rounded-2xl md:rounded-3xl overflow-hidden border-l-4 border-l-purple-500">
        <CardContent className="p-5 sm:p-6 md:p-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2 mb-3 sm:mb-4">
            <span className="w-1 h-5 sm:h-6 bg-purple-500 rounded-full" />
            <FontAwesomeIcon icon={faVrCardboard} className="text-purple-600 w-5 h-5 sm:w-6 sm:h-6" />
            Recorridos Virtuales 360°
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">
            Haz clic en un tour para explorarlo en pantalla completa con controles interactivos
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {tours.map((tour) => (
              <div
                key={tour.id}
                onClick={() => {
                  setSelectedTour(tour.imagePath)
                  setSelectedTourTitle(tour.title || 'Tour Virtual')
                }}
                className="relative aspect-video rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer group bg-gradient-to-br from-gray-900 to-gray-800 hover:ring-2 hover:ring-purple-500 transition-all"
              >
                <Image
                  src={tour.imagePath}
                  alt={tour.title || 'Tour Virtual'}
                  fill
                  className="object-contain opacity-90 group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/40 group-hover:bg-black/30 transition-all p-4">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FontAwesomeIcon icon={faPlay} className="text-white w-5 h-5" />
                  </div>
                  <span className="text-white text-sm font-medium text-center line-clamp-1 px-2">
                    {tour.title || 'Tour Virtual'}
                  </span>
                  <span className="text-white/60 text-xs">Haz clic para explorar</span>
                </div>
              </div>
            ))}
          </div>
          <p className="text-[10px] sm:text-xs text-gray-400 mt-3 text-center">
            Haz clic en cualquier tour para abrirlo en pantalla completa
          </p>
        </CardContent>
      </Card>

      {/* Modal del tour */}
      {selectedTour && (
        <TourModal
          isOpen={!!selectedTour}
          onClose={() => setSelectedTour(null)}
          imageUrl={selectedTour}
          title={selectedTourTitle}
        />
      )}
      
    </>
    
  )

}