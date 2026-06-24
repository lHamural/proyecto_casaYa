// components/propiedades/TourModal.tsx
'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import TourViewer from './TourViewer'

export default function TourModal({ isOpen, onClose, imageUrl, title }: any) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!mounted || !isOpen) return null

  return createPortal(
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      <div className="flex items-center justify-between p-4 bg-black/80 backdrop-blur-sm z-10 flex-shrink-0">
        <h2 className="text-white font-semibold text-lg truncate">
          {title || 'Tour Virtual 360°'}
        </h2>
        <button
          onClick={onClose}
          className="text-white/80 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
        >
          <FontAwesomeIcon icon={faXmark} className="w-6 h-6" />
        </button>
      </div>
      <div className="flex-1 min-h-0">
        <TourViewer imageUrl={imageUrl} title={title} height="100%" />
      </div>
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 text-white/40 text-xs text-center pointer-events-none">
        Arrastra para mover · Rueda para zoom
      </div>
    </div>,
    document.body
  )
}