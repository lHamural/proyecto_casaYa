// app/(public)/full-propiedades/[id]/page.tsx
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faMapMarkerAlt,
  faPhone,
  faEnvelope,
  faCalendarAlt,
  faHeart,
  faShareAlt,
  faBed,
  faBath,
  faRulerCombined,
  faCar,
  faHome,
  faBuilding,
  faEye,
  faStar,
  faUser,
  faClock,
  faTag,
  faDollarSign,
  faVrCardboard,
  faMap,
  faExpand,
  faArrowLeft,
  faPlay,
} from '@fortawesome/free-solid-svg-icons'
import VirtualToursSection from '@/components/propiedades/VirtualToursSection'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function FullPropiedadDetailPage({ params }: PageProps) {
  const { id } = await params

  const propiedad = await prisma.property.findFirst({
    where: {
      id: id,
      status: 'PUBLISHED'
    },
    include: {
      images: { orderBy: { order: 'asc' } },
      propertyType: true,
      propertyCategory: true,
      user: { select: { name: true, phone: true, email: true } },
      features: { include: { feature: true } },
      virtualTours: { orderBy: { order: 'asc' } },
    },
  })

  if (!propiedad) {
    notFound()
  }

  await prisma.property.update({
    where: { id: propiedad.id },
    data: { viewCount: { increment: 1 } },
  })

  const imagenPrincipal = propiedad.images.find(img => img.isPrimary) || propiedad.images[0]
  const hasCoordinates = propiedad.latitude && propiedad.longitude
  const mapUrl = hasCoordinates
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${propiedad.longitude! - 0.01},${propiedad.latitude! - 0.01},${propiedad.longitude! + 0.01},${propiedad.latitude! + 0.01}&layer=mapnik&marker=${propiedad.latitude},${propiedad.longitude}`
    : null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 text-white py-10 md:py-16 lg:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(at_top_right,#4f46e520_0%,transparent_50%)]" />
        
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <Link 
            href="/full-propiedades" 
            className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm mb-4 md:hidden"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="w-4 h-4" />
            Volver a propiedades
          </Link>

          <div className="flex flex-col gap-3">
            <div className="hidden sm:flex items-center gap-2 text-xs md:text-sm text-white/60 flex-wrap">
              <Link href="/" className="hover:text-white transition-colors">Inicio</Link>
              <span className="text-white/30">/</span>
              <Link href="/full-propiedades" className="hover:text-white transition-colors">Propiedades</Link>
              <span className="text-white/30">/</span>
              <span className="text-white/80 truncate max-w-[200px] md:max-w-sm">{propiedad.title}</span>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 md:gap-6 mt-2">
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight break-words">
                  {propiedad.title}
                </h1>
                <div className="flex items-start gap-2 mt-2 text-white/70 text-sm sm:text-base">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="text-blue-400 mt-0.5 flex-shrink-0 w-4 h-4" />
                  <span className="break-words">
                    {propiedad.address ? `${propiedad.address}, ` : ''}
                    {propiedad.city}, {propiedad.department}
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 flex-shrink-0">
                <Badge className="bg-white/10 text-white border border-white/20 px-3 py-1.5 text-xs sm:text-sm backdrop-blur-sm">
                  <FontAwesomeIcon icon={faTag} className="mr-1.5 w-3 h-3" />
                  {propiedad.propertyType.name}
                </Badge>
                <Badge className="bg-accent/20 text-white border border-accent/30 px-3 py-1.5 text-xs sm:text-sm backdrop-blur-sm">
                  <FontAwesomeIcon icon={faStar} className="mr-1.5 text-accent w-3 h-3" />
                  {propiedad.propertyCategory.name.replace('_', ' ')}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-6 md:py-10 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
          {/* Columna izquierda */}
          <div className="lg:col-span-2 space-y-6 md:space-y-8">
            {/* Galería */}
            <Card className="border-0 shadow-xl rounded-2xl md:rounded-3xl overflow-hidden">
              <CardContent className="p-0">
                <div className="relative aspect-[4/3] sm:aspect-[16/10] md:aspect-[16/9] lg:h-[450px] xl:h-[550px] bg-gradient-to-br from-gray-100 to-gray-200">
                  {imagenPrincipal ? (
                    <Image
                      src={imagenPrincipal.webpPath}
                      alt={propiedad.title}
                      fill
                      className="object-cover"
                      priority
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 800px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FontAwesomeIcon icon={faHome} className="text-gray-300 w-16 h-16" />
                    </div>
                  )}
                  {propiedad.isHighlighted && (
                    <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
                      <span className="inline-flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[10px] sm:text-xs font-bold px-3 py-1.5 sm:px-4 sm:py-2 rounded-full shadow-lg shadow-amber-500/25">
                        <FontAwesomeIcon icon={faStar} className="w-3 h-3 sm:w-4 sm:h-4" />
                        Destacada
                      </span>
                    </div>
                  )}
                  <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4">
                    <span className="inline-flex items-center gap-1.5 sm:gap-2 bg-black/60 backdrop-blur-sm text-white text-[10px] sm:text-xs font-medium px-3 py-1.5 sm:px-4 sm:py-2 rounded-full">
                      <FontAwesomeIcon icon={faEye} className="w-3 h-3 sm:w-4 sm:h-4" />
                      {propiedad.viewCount} vistas
                    </span>
                  </div>
                </div>
                {propiedad.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-1.5 sm:gap-2 p-2 sm:p-3">
                    {propiedad.images.slice(1, 5).map((img) => (
                      <div key={img.id} className="relative aspect-video sm:h-20 md:h-24 rounded-lg sm:rounded-xl overflow-hidden cursor-pointer hover:opacity-80 transition-opacity">
                        <Image
                          src={img.thumbPath}
                          alt={propiedad.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 25vw, 150px"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Descripción */}
            <Card className="border-0 shadow-xl rounded-2xl md:rounded-3xl overflow-hidden">
              <CardContent className="p-5 sm:p-6 md:p-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2 mb-3 sm:mb-4">
                  <span className="w-1 h-5 sm:h-6 bg-primary rounded-full" />
                  Descripción
                </h2>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed whitespace-pre-line">
                  {propiedad.description}
                </p>
              </CardContent>
            </Card>

            {/* Características */}
            <Card className="border-0 shadow-xl rounded-2xl md:rounded-3xl overflow-hidden">
              <CardContent className="p-5 sm:p-6 md:p-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2 mb-4 sm:mb-6">
                  <span className="w-1 h-5 sm:h-6 bg-primary rounded-full" />
                  Características
                </h2>
                <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                  {propiedad.bedrooms && (
                    <div className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-gray-50 rounded-lg sm:rounded-xl">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FontAwesomeIcon icon={faBed} className="text-blue-600 w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] sm:text-xs text-gray-400">Dormitorios</p>
                        <p className="font-semibold text-sm sm:text-base">{propiedad.bedrooms}</p>
                      </div>
                    </div>
                  )}
                  {propiedad.bathrooms && (
                    <div className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-gray-50 rounded-lg sm:rounded-xl">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FontAwesomeIcon icon={faBath} className="text-blue-600 w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] sm:text-xs text-gray-400">Baños</p>
                        <p className="font-semibold text-sm sm:text-base">{propiedad.bathrooms}</p>
                      </div>
                    </div>
                  )}
                  {propiedad.area && (
                    <div className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-gray-50 rounded-lg sm:rounded-xl">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FontAwesomeIcon icon={faRulerCombined} className="text-blue-600 w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] sm:text-xs text-gray-400">Área</p>
                        <p className="font-semibold text-sm sm:text-base">{propiedad.area} m²</p>
                      </div>
                    </div>
                  )}
                  {propiedad.garage && (
                    <div className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-gray-50 rounded-lg sm:rounded-xl">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FontAwesomeIcon icon={faCar} className="text-blue-600 w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] sm:text-xs text-gray-400">Garaje</p>
                        <p className="font-semibold text-sm sm:text-base">Sí</p>
                      </div>
                    </div>
                  )}
                  {propiedad.floors && (
                    <div className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-gray-50 rounded-lg sm:rounded-xl">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FontAwesomeIcon icon={faBuilding} className="text-blue-600 w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] sm:text-xs text-gray-400">Pisos</p>
                        <p className="font-semibold text-sm sm:text-base">{propiedad.floors}</p>
                      </div>
                    </div>
                  )}
                  {propiedad.antiquity && (
                    <div className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-gray-50 rounded-lg sm:rounded-xl">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FontAwesomeIcon icon={faCalendarAlt} className="text-blue-600 w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] sm:text-xs text-gray-400">Antigüedad</p>
                        <p className="font-semibold text-sm sm:text-base">{propiedad.antiquity} años</p>
                      </div>
                    </div>
                  )}
                  {propiedad.furnished && (
                    <div className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-gray-50 rounded-lg sm:rounded-xl">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FontAwesomeIcon icon={faHome} className="text-blue-600 w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] sm:text-xs text-gray-400">Amoblado</p>
                        <p className="font-semibold text-sm sm:text-base">Sí</p>
                      </div>
                    </div>
                  )}
                </div>

                {propiedad.features.length > 0 && (
                  <div className="mt-4 sm:mt-6 flex flex-wrap gap-1.5 sm:gap-2">
                    {propiedad.features.map((f) => (
                      <Badge key={f.feature.id} variant="secondary" className="px-2.5 py-1 sm:px-3 sm:py-1.5 text-[10px] sm:text-xs font-normal rounded-full">
                        {f.feature.icon} {f.feature.name}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Mapa */}
            <Card className="border-0 shadow-xl rounded-2xl md:rounded-3xl overflow-hidden">
              <CardContent className="p-5 sm:p-6 md:p-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2 mb-3 sm:mb-4">
                  <span className="w-1 h-5 sm:h-6 bg-emerald-500 rounded-full" />
                  <FontAwesomeIcon icon={faMap} className="text-emerald-600 w-5 h-5 sm:w-6 sm:h-6" />
                  Ubicación
                </h2>
                {hasCoordinates ? (
                  <div className="space-y-3 sm:space-y-4">
                    <div className="relative aspect-video rounded-xl sm:rounded-2xl overflow-hidden border border-gray-200">
                      <iframe
                        src={mapUrl!}
                        width="100%"
                        height="100%"
                        className="absolute inset-0"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Ubicación de la propiedad"
                      />
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 text-sm">
                      <p className="text-gray-600 flex items-center gap-2 break-words">
                        <FontAwesomeIcon icon={faMapMarkerAlt} className="text-primary w-4 h-4 flex-shrink-0" />
                        <span>{propiedad.address || propiedad.city}, {propiedad.department}</span>
                      </p>
                      <Button variant="outline" size="sm" className="rounded-xl w-full sm:w-auto" asChild>
                        <a
                          href={`https://www.openstreetmap.org/?mlat=${propiedad.latitude}&mlon=${propiedad.longitude}#map=15/${propiedad.latitude}/${propiedad.longitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-1.5"
                        >
                          <FontAwesomeIcon icon={faExpand} className="w-4 h-4" />
                          Ver en mapa completo
                        </a>
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 sm:py-12 text-gray-400 bg-gray-50 rounded-xl sm:rounded-2xl">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="text-3xl sm:text-4xl mb-2 sm:mb-3 opacity-30 w-12 h-12 sm:w-16 sm:h-16" />
                    <p className="text-sm sm:text-base">Ubicación no disponible</p>
                    <p className="text-xs mt-1">El vendedor no ha especificado la ubicación exacta</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 👇 SECCIÓN DE TOURS REEMPLAZADA POR EL COMPONENTE CLIENTE */}
            <VirtualToursSection tours={propiedad.virtualTours} />
          </div>

          {/* Columna derecha - Sidebar (sin cambios) */}
          <div className="space-y-6">
            <Card className="sticky top-6 sm:top-20 border-0 shadow-xl rounded-2xl md:rounded-3xl overflow-hidden">
              <CardContent className="p-4 sm:p-5 md:p-6">
                <div className="text-center mb-4 sm:mb-6 pb-4 sm:pb-6 border-b border-gray-100">
                  <p className="text-xs sm:text-sm text-gray-500">Precio</p>
                  <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mt-1 break-words">
                    {propiedad.price.toLocaleString()}
                    <span className="text-base sm:text-lg font-normal text-gray-400 ml-1">{propiedad.currency}</span>
                  </p>
                  {propiedad.priceNegotiable && (
                    <Badge variant="outline" className="mt-2 text-xs sm:text-sm">Precio negociable</Badge>
                  )}
                </div>

                <div className="space-y-2.5 sm:space-y-3">
                  <Button className="w-full rounded-xl h-10 sm:h-12 text-sm sm:text-base" size="lg">
                    <FontAwesomeIcon icon={faHeart} className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
                    Me interesa
                  </Button>
                  <Button variant="outline" className="w-full rounded-xl h-10 sm:h-12 text-sm sm:text-base" size="lg">
                    <FontAwesomeIcon icon={faShareAlt} className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
                    Compartir
                  </Button>
                </div>

                <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-100">
                  <h3 className="font-semibold mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
                    <FontAwesomeIcon icon={faUser} className="text-primary w-4 h-4 sm:w-5 sm:h-5" />
                    Información del vendedor
                  </h3>
                  <div className="space-y-2.5 sm:space-y-3">
                    <div className="flex items-center gap-3 p-2.5 sm:p-3 bg-gray-50 rounded-xl">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-primary font-bold text-base sm:text-lg">
                          {propiedad.user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-sm sm:text-base truncate">{propiedad.user.name}</p>
                        <p className="text-[10px] sm:text-xs text-gray-400">Propietario</p>
                      </div>
                    </div>
                    {propiedad.user.phone && (
                      <a href={`tel:${propiedad.user.phone}`} className="flex items-center gap-3 p-2.5 sm:p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FontAwesomeIcon icon={faPhone} className="text-green-600 w-4 h-4 sm:w-5 sm:h-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] sm:text-xs text-gray-400">Teléfono</p>
                          <p className="font-medium text-sm sm:text-base truncate">{propiedad.user.phone}</p>
                        </div>
                      </a>
                    )}
                    <a href={`mailto:${propiedad.user.email}`} className="flex items-center gap-3 p-2.5 sm:p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FontAwesomeIcon icon={faEnvelope} className="text-blue-600 w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] sm:text-xs text-gray-400">Email</p>
                        <p className="font-medium text-sm sm:text-base truncate">{propiedad.user.email}</p>
                      </div>
                    </a>
                  </div>
                </div>

                <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-100 space-y-1">
                  <div className="flex items-center gap-2 text-[10px] sm:text-xs text-gray-400">
                    <FontAwesomeIcon icon={faClock} className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>Publicado: {new Date(propiedad.createdAt).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] sm:text-xs text-gray-400">
                    <FontAwesomeIcon icon={faEye} className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>{propiedad.viewCount} vistas</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}