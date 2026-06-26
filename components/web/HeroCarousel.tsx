'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'

interface HeroImage {
  webpPath: string
  title: string
  id: string
}

interface HeroCarouselProps {
  images: HeroImage[]
}

export function HeroCarousel({ images }: HeroCarouselProps) {
  const [current, setCurrent] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % images.length)
  }, [images.length])

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + images.length) % images.length)
  }, [images.length])

  useEffect(() => {
    if (isPaused || images.length <= 1) return
    const timer = setInterval(next, 5000)
    return () => clearInterval(timer)
  }, [isPaused, next, images.length])

  if (images.length === 0) {
    return (
      <section className="relative h-[90vh] min-h-[600px] bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 flex items-center justify-center">
        <div className="absolute inset-0 bg-[radial-gradient(at_top_right,#4f46e520_0%,transparent_60%)]" />
        <div className="relative z-10 text-center px-6">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tighter">
            Encuentra tu hogar ideal
          </h1>
          <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
            Las mejores propiedades en Bolivia, con la confianza de siempre
          </p>
          <SearchBar />
        </div>
      </section>
    )
  }

  const image = images[current]

  return (
    <section
      className="relative h-[90vh] min-h-[600px] overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {images.map((img, index) => (
        <div
          key={img.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === current ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image
            src={img.webpPath}
            alt={img.title}
            fill
            className="object-cover"
            priority={index === 0}
          />
        </div>
      ))}

      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/50 to-slate-950/30" />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/40 to-transparent" />

      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white flex items-center justify-center hover:bg-white/20 transition-all"
          >
            <FontAwesomeIcon icon={faChevronLeft} className="w-5 h-5" />
          </button>
          <button
            onClick={next}
            className="absolute right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white flex items-center justify-center hover:bg-white/20 transition-all"
          >
            <FontAwesomeIcon icon={faChevronRight} className="w-5 h-5" />
          </button>
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrent(index)}
                className={`h-2 rounded-full transition-all duration-500 ${
                  index === current ? 'w-8 bg-white' : 'w-2 bg-white/40 hover:bg-white/60'
                }`}
              />
            ))}
          </div>
        </>
      )}

      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <div className="text-center px-6 max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-tighter drop-shadow-lg">
            Encuentra tu hogar ideal
          </h1>
          <p className="text-xl text-slate-200 mb-10 max-w-2xl mx-auto drop-shadow">
            Las mejores propiedades en Bolivia, con la confianza de siempre
          </p>
          <SearchBar />
        </div>
      </div>
    </section>
  )
}

function SearchBar() {
  return (
    <div className="flex items-center max-w-2xl mx-auto bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-2 shadow-2xl">
      <div className="flex-1 flex items-center gap-3 px-4">
        <FontAwesomeIcon icon={faSearch} className="w-5 h-5 text-white/60" />
        <input
          type="text"
          placeholder="Buscar por ciudad, zona o tipo de propiedad..."
          className="w-full bg-transparent text-white placeholder-white/50 text-lg outline-none"
        />
      </div>
      <Link
        href="/full-propiedades"
        className="bg-white text-slate-900 px-8 py-3 rounded-xl font-semibold hover:bg-white/90 transition-all flex items-center gap-2"
      >
        <FontAwesomeIcon icon={faSearch} className="w-4 h-4" />
        Buscar
      </Link>
    </div>
  )
}
