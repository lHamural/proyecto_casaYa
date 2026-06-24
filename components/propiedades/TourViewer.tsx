// components/propiedades/TourViewer.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { Viewer } from '@photo-sphere-viewer/core'
import '@photo-sphere-viewer/core/index.css'

interface TourViewerProps {
  imageUrl: string
  title?: string
  height?: string
}

export default function TourViewer({ imageUrl, title, height = '100%' }: TourViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const viewerRef = useRef<Viewer | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Si no hay URL, salir
    if (!imageUrl) {
      setLoading(false)
      return
    }

    // Función para crear el viewer
    const createViewer = () => {
      if (!containerRef.current) return

      // Verificar que el contenedor tenga dimensiones
      const rect = containerRef.current.getBoundingClientRect()
      if (rect.width === 0 || rect.height === 0) {
        console.warn('⏳ Contenedor sin dimensiones, esperando...')
        // Intentar de nuevo después de un breve retraso
        setTimeout(createViewer, 100)
        return
      }

      // Destruir viewer anterior si existe
      if (viewerRef.current) {
        viewerRef.current.destroy()
        viewerRef.current = null
      }

      console.log('📸 Creando viewer con:', imageUrl)

      try {
        const viewer = new Viewer({
          container: containerRef.current,
          panorama: imageUrl,
          defaultZoomLvl: 0,
          navbar: ['zoom', 'fullscreen', 'caption'],
          lang: {
            zoom: 'Zoom',
            fullscreen: 'Pantalla completa',
            caption: 'Título',
          },
          size: {
            width: '100%',
            height: '100%',
          },
        })

        viewerRef.current = viewer
        setError(null)

        // El viewer ya está creado, ocultamos el spinner
        setLoading(false)
        console.log('✅ Viewer creado exitosamente')

      } catch (err) {
        console.error('❌ Error al crear el viewer:', err)
        setError('Error al inicializar el visor 360°')
        setLoading(false)
      }
    }

    // Precargar la imagen antes de crear el viewer
    const img = new Image()
    img.crossOrigin = 'anonymous' // por si hay CORS
    img.onload = () => {
      console.log('✅ Imagen precargada correctamente')
      // La imagen está cargada, crear viewer
      createViewer()
    }
    img.onerror = () => {
      console.error('❌ Error al precargar la imagen:', imageUrl)
      setError('No se pudo cargar la imagen 360°. Verifica que exista y sea accesible.')
      setLoading(false)
    }
    img.src = imageUrl

    // Cleanup al desmontar o cambiar URL
    return () => {
      if (viewerRef.current) {
        viewerRef.current.destroy()
        viewerRef.current = null
      }
      // Cancelar la precarga si aún no terminó
      img.onload = null
      img.onerror = null
    }
  }, [imageUrl])

  if (error) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-900 text-white p-4">
        <div className="text-center">
          <p className="text-red-400 font-medium">⚠️ {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-blue-500 rounded hover:bg-blue-600 transition"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-full bg-black">
      <div
        ref={containerRef}
        className="w-full h-full"
        style={{ minHeight: '400px' }}
      />
      {title && (
        <div className="absolute bottom-4 left-4 bg-black/60 text-white px-4 py-2 rounded-lg text-sm font-medium backdrop-blur-sm z-10">
          {title}
        </div>
      )}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin" />
        </div>
      )}
    </div>
  )
}