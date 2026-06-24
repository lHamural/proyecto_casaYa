// components/web/PropertyCard.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faHeart,
  faBed,
  faBath,
  faRulerCombined,
  faEye,
  faMapPin,
  faMessage,
  faShare,
  faEllipsisVertical,
  faClock,
  faPaperPlane,
  faStar,
  faChevronLeft,
  faChevronRight,
  faEnvelope,
  faPhone,
} from '@fortawesome/free-solid-svg-icons'
import {
  faFacebook,
  faTwitter,
  faWhatsapp,
} from '@fortawesome/free-brands-svg-icons'
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useSession } from 'next-auth/react'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import { cn } from '@/lib/utils'

interface Comentario {
  id: string
  content: string
  createdAt: string
  user: {
    id: string
    name: string
    avatar: string | null
  }
}

interface PropertyCardProps {
  property: {
    id: string
    title: string
    price: number
    currency: string
    city: string
    department: string
    bedrooms: number | null
    bathrooms: number | null
    area: number | null
    status: string
    isHighlighted: boolean
    viewCount: number
    images: { webpPath: string }[]
    propertyType: { name: string }
    propertyCategory: { name: string }
    user: {
      id: string
      name: string
      avatar: string | null
      phone?: string | null
      email?: string | null
      whatsapp?: string | null
    } | null
    _count: { likes: number; comments: number }
    createdAt: string
  }
  featured?: boolean
}

export function PropertyCard({ property, featured = false }: PropertyCardProps) {
  const { data: session } = useSession()
  const [isFavorite, setIsFavorite] = useState(false)
  const [likesCount, setLikesCount] = useState(property._count.likes)
  const [showComments, setShowComments] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showLoginMessage, setShowLoginMessage] = useState(false)
  const [comentarios, setComentarios] = useState<Comentario[]>([])
  const [newComment, setNewComment] = useState('')
  const [sendingComment, setSendingComment] = useState(false)
  const [showShareMenu, setShowShareMenu] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isHovering, setIsHovering] = useState(false)

  const imageUrl = property.images[0]?.webpPath || '/images/property-placeholder.jpg'
  const priceFormatted = property.price.toLocaleString()

  const user = property.user || {
    id: 'unknown',
    name: 'Usuario',
    avatar: null,
    phone: null,
    email: null,
    whatsapp: null,
  }

  useEffect(() => {
    if (session?.user) {
      fetchLikeStatus()
    }
    if (showComments) {
      cargarComentarios()
    }
  }, [session, showComments])

  const fetchLikeStatus = async () => {
    try {
      const res = await fetch(`/api/propiedades/${property.id}/like`)
      const data = await res.json()
      setIsFavorite(data.liked)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const cargarComentarios = async () => {
    try {
      const res = await fetch(`/api/propiedades/${property.id}/comentarios`)
      const data = await res.json()
      setComentarios(data.slice(0, 2))
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!session?.user) {
      setShowLoginMessage(true)
      setTimeout(() => setShowLoginMessage(false), 3000)
      return
    }

    if (loading) return
    setLoading(true)

    try {
      const res = await fetch(`/api/propiedades/${property.id}/like`, {
        method: 'POST',
      })
      const data = await res.json()
      setIsFavorite(data.liked)
      setLikesCount((prev) => (data.liked ? prev + 1 : prev - 1))
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session?.user) {
      setShowLoginMessage(true)
      setTimeout(() => setShowLoginMessage(false), 3000)
      return
    }
    if (!newComment.trim()) return

    setSendingComment(true)
    try {
      const res = await fetch(`/api/propiedades/${property.id}/comentarios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newComment, parentId: null }),
      })
      if (res.ok) {
        const nuevoComentario = await res.json()
        setComentarios((prev) => [nuevoComentario, ...prev])
        setNewComment('')
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setSendingComment(false)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const timeAgo = formatDistanceToNow(new Date(property.createdAt), {
    addSuffix: true,
    locale: es,
  })

  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/full-propiedades/${property.id}` : ''

  const currentImage = property.images[currentImageIndex]?.webpPath || imageUrl
  const totalImages = property.images.length

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (totalImages > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % totalImages)
    }
  }

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (totalImages > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + totalImages) % totalImages)
    }
  }

  const cleanWhatsAppNumber = (number: string) => {
    return number.replace(/\D/g, '')
  }

  return (
    <div
      className="bg-white rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border-0 flex flex-col h-full group hover:-translate-y-0.5"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Badges superiores */}
      <div className="px-4 pt-3 pb-1 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {property.propertyCategory?.name === 'PROYECTO' && (
            <Badge className="bg-primary/10 text-primary border border-primary/20 text-[10px] font-medium rounded-full px-3 py-0.5">
              PROYECTO
            </Badge>
          )}
          {property.status === 'PUBLISHED' && (
            <Badge className="bg-green-100 text-green-700 text-[10px] font-medium rounded-full px-3 py-0.5 border border-green-200">
              EN VENTA
            </Badge>
          )}
          {property.isHighlighted && (
            <Badge className="bg-amber-100 text-amber-700 text-[10px] font-medium rounded-full px-3 py-0.5 border border-amber-200">
              <FontAwesomeIcon icon={faStar} className="w-3 h-3 mr-1" />
              DESTACADA
            </Badge>
          )}
        </div>
        {totalImages > 1 && (
          <span className="text-[10px] text-gray-400 font-medium">
            {currentImageIndex + 1}/{totalImages}
          </span>
        )}
      </div>

      {/* ========== IMAGEN CON CARRUSEL (REDUCIDA 35% MÁS) ========== */}
      <div className="relative overflow-hidden bg-gray-100 aspect-[8/3]">
        <Link href={`/full-propiedades/${property.id}`} className="block w-full h-full">
          <Image
            src={currentImage}
            alt={property.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
          />
        </Link>

        {/* Navegación del carrusel */}
        {totalImages > 1 && (
          <>
            <button
              onClick={prevImage}
              className={cn(
                "absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-all",
                isHovering ? "opacity-100" : "opacity-0"
              )}
              aria-label="Imagen anterior"
            >
              <FontAwesomeIcon icon={faChevronLeft} className="w-4 h-4" />
            </button>
            <button
              onClick={nextImage}
              className={cn(
                "absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-all",
                isHovering ? "opacity-100" : "opacity-0"
              )}
              aria-label="Siguiente imagen"
            >
              <FontAwesomeIcon icon={faChevronRight} className="w-4 h-4" />
            </button>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
              {Array.from({ length: Math.min(totalImages, 5) }).map((_, idx) => (
                <span
                  key={idx}
                  className={cn(
                    "w-1.5 h-1.5 rounded-full transition-all",
                    idx === currentImageIndex ? "bg-white w-3" : "bg-white/50"
                  )}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* ========== CONTENIDO ========== */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Cabecera: agente + inmobiliaria */}
        <div className="flex items-center gap-2 mb-1">
          <Avatar className="w-5 h-5">
            <AvatarFallback className="text-[9px] bg-gray-200 text-gray-700">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs font-medium text-gray-700 truncate">{user.name}</span>
          <span className="text-[10px] text-gray-400">·</span>
          <span className="text-[10px] text-gray-400">Century 21 Norte</span>
          <span className="text-[10px] text-gray-400 ml-auto flex items-center gap-1">
            <FontAwesomeIcon icon={faClock} className="w-3 h-3" />
            {timeAgo}
          </span>
        </div>

        {/* Precio */}
        <div className="mt-1">
          <span className="text-2xl font-bold text-gray-900">${priceFormatted}</span>
          <span className="text-sm ml-1 text-gray-500">{property.currency}</span>
        </div>

        {/* Ubicación */}
        <div className="flex items-center gap-1 text-gray-500 mt-0.5">
          <FontAwesomeIcon icon={faMapPin} className="w-3 h-3 text-primary flex-shrink-0" />
          <span className="text-xs truncate">{property.city}, {property.department}</span>
        </div>

        {/* Área */}
        {property.area && (
          <div className="text-xs text-gray-600 mt-0.5">
            {property.area} m²
          </div>
        )}

        {/* Descripción corta */}
        {property.description && (
          <div className="text-xs text-gray-600 line-clamp-1 mt-1">
            {property.description}
          </div>
        )}

        {/* Características */}
        <div className="flex items-center gap-4 text-gray-600 mt-2">
          {property.bedrooms && (
            <div className="flex items-center gap-1.5">
              <FontAwesomeIcon icon={faBed} className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium">{property.bedrooms}</span>
            </div>
          )}
          {property.bathrooms && (
            <div className="flex items-center gap-1.5">
              <FontAwesomeIcon icon={faBath} className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium">{property.bathrooms}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5 ml-auto text-gray-400">
            <FontAwesomeIcon icon={faEye} className="w-4 h-4" />
            <span className="text-xs">{property.viewCount}</span>
          </div>
        </div>

        {/* Botones de contacto */}
        <div className="flex gap-2 mt-3">
          <Button
            className="flex-1 bg-primary hover:bg-primary/90 text-white text-xs h-8 rounded-lg shadow-sm"
            onClick={(e) => {
              e.preventDefault()
              if (user.email) {
                window.location.href = `mailto:${user.email}?subject=Interés en ${property.title}`
              } else {
                alert('El vendedor no ha proporcionado un correo electrónico.')
              }
            }}
          >
            <FontAwesomeIcon icon={faEnvelope} className="w-3 h-3 mr-1.5" />
            Contactar
          </Button>

          <Button
            variant="outline"
            className="flex-1 text-xs h-8 rounded-lg border-gray-300 hover:border-primary/50"
            onClick={(e) => {
              e.preventDefault()
              if (user.phone) {
                window.location.href = `tel:${user.phone}`
              } else {
                alert('El vendedor no ha proporcionado un número de teléfono.')
              }
            }}
          >
            <FontAwesomeIcon icon={faPhone} className="w-3 h-3 mr-1.5" />
            Llamar
          </Button>

          <Button
            variant="outline"
            className="flex-1 text-xs h-8 rounded-lg border-green-300 text-green-600 hover:bg-green-50"
            onClick={(e) => {
              e.preventDefault()
              if (user.whatsapp) {
                const cleanNumber = cleanWhatsAppNumber(user.whatsapp)
                window.open(
                  `https://wa.me/${cleanNumber}?text=Hola, estoy interesado en la propiedad ${property.title}`,
                  '_blank'
                )
              } else {
                alert('El vendedor no ha proporcionado un número de WhatsApp.')
              }
            }}
          >
            <FontAwesomeIcon icon={faWhatsapp} className="w-3 h-3 mr-1.5" />
            WhatsApp
          </Button>
        </div>

        {/* Acciones sociales */}
        <div className="flex items-center justify-between pt-3 mt-3 border-t border-gray-100">
          <button
            onClick={handleLike}
            disabled={loading}
            className={`flex items-center gap-1.5 text-sm transition-all hover:scale-110 ${
              isFavorite ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
            }`}
          >
            <FontAwesomeIcon
              icon={isFavorite ? faHeart : faHeartRegular}
              className={`w-4 h-4 ${isFavorite ? 'fill-red-500' : ''}`}
            />
            <span className="text-xs">{likesCount}</span>
          </button>

          <button
            onClick={(e) => {
              e.preventDefault()
              setShowComments(!showComments)
            }}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary transition-all hover:scale-110"
          >
            <FontAwesomeIcon icon={faMessage} className="w-4 h-4" />
            <span className="text-xs">{property._count.comments}</span>
          </button>

          <button
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary transition-all hover:scale-110"
            onClick={() => setShowShareMenu(!showShareMenu)}
          >
            <FontAwesomeIcon icon={faShare} className="w-4 h-4" />
            <span className="text-xs">Compartir</span>
          </button>
        </div>
      </div>

      {/* Secciones expandibles (login, comentarios, compartir) - sin cambios */}
      {showLoginMessage && (
        <div className="mx-4 mb-4 bg-amber-50 border border-amber-200 rounded-xl p-3 text-amber-700 text-sm flex items-center gap-2">
          <FontAwesomeIcon icon={faStar} className="w-4 h-4 text-amber-500" />
          <span>
            Debes <a href="/login" className="font-semibold underline hover:text-amber-800">iniciar sesión</a> para interactuar
          </span>
        </div>
      )}

      {showComments && (
        <div className="px-4 pb-4 pt-2 border-t border-gray-100">
          <div className="space-y-3">
            {comentarios.map((comentario) => (
              <div key={comentario.id} className="flex gap-2">
                <Avatar className="w-7 h-7">
                  <AvatarFallback className="text-[10px] bg-gray-200">
                    {getInitials(comentario.user.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="bg-gray-100 rounded-2xl px-3 py-1.5">
                    <p className="font-semibold text-[10px]">{comentario.user.name}</p>
                    <p className="text-sm">{comentario.content}</p>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-[10px] text-muted-foreground px-2">
                    <span>
                      {formatDistanceToNow(new Date(comentario.createdAt), { addSuffix: true, locale: es })}
                    </span>
                    <button className="hover:text-primary">Responder</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleComment} className="flex gap-2 mt-3">
            <Avatar className="w-7 h-7">
              <AvatarFallback className="text-[10px] bg-gray-200">
                {session?.user?.name ? getInitials(session.user.name) : '?'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder={session?.user ? 'Escribe un comentario...' : 'Inicia sesión para comentar'}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                disabled={!session?.user || sendingComment}
                className="w-full bg-gray-100 rounded-full px-4 py-1.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50 transition-colors"
              />
              {newComment.trim() && session?.user && (
                <button
                  type="submit"
                  disabled={sendingComment}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-primary hover:text-primary/80 transition-colors"
                >
                  <FontAwesomeIcon icon={faPaperPlane} className="w-4 h-4" />
                </button>
              )}
            </div>
          </form>
          {!session?.user && (
            <p className="text-[10px] text-muted-foreground mt-2 text-center">
              <a href="/login" className="text-primary hover:underline">Inicia sesión</a> para comentar
            </p>
          )}
        </div>
      )}

      {showShareMenu && (
        <div className="px-4 pb-4">
          <div className="mt-2 p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
            <p className="text-[10px] font-semibold text-muted-foreground flex items-center gap-2">
              <FontAwesomeIcon icon={faShare} className="w-3 h-3" />
              Compartir en:
            </p>
            <div className="flex gap-2 flex-wrap">
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1877f2] text-white text-xs rounded-lg hover:bg-[#166fe5] transition-colors"
              >
                <FontAwesomeIcon icon={faFacebook} className="w-3 h-3" />
                Facebook
              </a>
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(property.title)}&url=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1da1f2] text-white text-xs rounded-lg hover:bg-[#1a91da] transition-colors"
              >
                <FontAwesomeIcon icon={faTwitter} className="w-3 h-3" />
                Twitter
              </a>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`${property.title} - ${shareUrl}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#25d366] text-white text-xs rounded-lg hover:bg-[#20bd5a] transition-colors"
              >
                <FontAwesomeIcon icon={faWhatsapp} className="w-3 h-3" />
                WhatsApp
              </a>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(shareUrl)
                  alert('¡Enlace copiado al portapapeles!')
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-200 text-gray-700 text-xs rounded-lg hover:bg-gray-300 transition-colors"
              >
                <FontAwesomeIcon icon={faPaperPlane} className="w-3 h-3" />
                Copiar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}