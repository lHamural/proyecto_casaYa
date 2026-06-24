// app/(public)/full-propiedades/page.tsx
import { Pagination } from '@/components/web/Pagination'
import { PropertyCard } from '@/components/web/PropertyCard'
import { FiltrosBusqueda } from '@/components/web/FiltrosBusqueda'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faHome,
  faSearch,
  faThLarge,
  faList,
  faBuilding,
  faChevronLeft,
  faChevronRight,
  faFilter,
  faStar,
  faChartLine,
  faBars,
  faTable
} from '@fortawesome/free-solid-svg-icons'

interface PageProps {
  searchParams: Promise<{
    q?: string
    operacion?: string
    tipo?: string
    ciudad?: string
    precioMin?: string
    precioMax?: string
    page?: string
  }>
}

export default async function FullPropiedadesPage({ searchParams }: PageProps) {
  const params = await searchParams
  const page = Number(params.page) || 1
  const limit = 9
  const skip = (page - 1) * limit

  const where: any = { status: 'PUBLISHED' }

  if (params.q) {
    where.OR = [
      { title: { contains: params.q, mode: 'insensitive' } },
      { description: { contains: params.q, mode: 'insensitive' } },
      { city: { contains: params.q, mode: 'insensitive' } },
      { zone: { contains: params.q, mode: 'insensitive' } },
    ]
  }

  if (params.operacion) {
    where.propertyType = { name: params.operacion.toUpperCase() as any }
  }

  if (params.tipo && params.tipo !== 'todos') {
    where.propertyCategory = { name: params.tipo.toUpperCase() as any }
  }

  if (params.ciudad) {
    where.city = { contains: params.ciudad, mode: 'insensitive' }
  }

  if (params.precioMin || params.precioMax) {
    where.price = {}
    if (params.precioMin) where.price.gte = Number(params.precioMin)
    if (params.precioMax) where.price.lte = Number(params.precioMax)
  }

  const [propiedades, total] = await Promise.all([
    prisma.property.findMany({
      where,
      include: {
        images: { where: { isPrimary: true }, take: 1 },
        propertyType: true,
        propertyCategory: true,
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        _count: { select: { likes: true, comments: true } },
      },
      orderBy: [
        { isHighlighted: 'desc' },
        { createdAt: 'desc' },
      ],
      skip,
      take: limit,
    }),
    prisma.property.count({ where }),
  ])

  const totalPages = Math.ceil(total / limit)

  const stats = {
    total,
    destacadas: propiedades.filter(p => p.isHighlighted).length,
    enVenta: propiedades.filter(p => p.propertyType.name === 'VENTA').length,
    enAlquiler: propiedades.filter(p => p.propertyType.name === 'ALQUILER').length,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section - Más impactante */}
      <div className="relative bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 text-white py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(at_top_right,#4f46e520_0%,transparent_50%)]" />
        
        <div className="container-custom relative z-10 max-w-6xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10">
            <div className="max-w-2xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-4 bg-white/10 rounded-3xl backdrop-blur-xl border border-white/20">
                  <FontAwesomeIcon icon={faBuilding} className="w-9 h-9 text-blue-400" />
                </div>
                <h1 className="text-5xl lg:text-6xl font-bold tracking-tighter">
                  Propiedades
                </h1>
              </div>
              <p className="text-xl text-slate-300">
                Encuentra tu hogar ideal con las mejores opciones del mercado
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Badge className="bg-white/10 hover:bg-white/20 text-white border border-white/30 px-6 py-4 text-lg backdrop-blur-xl transition-all">
                <FontAwesomeIcon icon={faHome} className="mr-3" />
                {stats.total} propiedades
              </Badge>
              <Badge className="bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 border border-amber-400/30 px-6 py-4 text-lg backdrop-blur-xl transition-all">
                <FontAwesomeIcon icon={faStar} className="mr-3" />
                {stats.destacadas} destacadas
              </Badge>
            </div>
          </div>

          {/* Barra de progreso */}
          <div className="mt-12 max-w-md">
            <div className="flex justify-between text-sm text-white/70 mb-3">
              <span>Propiedades disponibles</span>
              <span className="font-medium">{total}</span>
            </div>
            <div className="h-2.5 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 rounded-full transition-all duration-1000"
                style={{ width: `${Math.min(100, (total / (total + 15)) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container-custom py-12">
        <FiltrosBusqueda />

        {propiedades.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-20 text-center max-w-2xl mx-auto">
            <div className="mx-auto w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-8">
              <FontAwesomeIcon icon={faSearch} className="w-12 h-12 text-slate-400" />
            </div>
            <h3 className="text-4xl font-bold text-gray-800 mb-4">No se encontraron propiedades</h3>
            <p className="text-gray-500 text-lg">
              No hay resultados que coincidan con tu búsqueda.<br />
              Intenta ajustar los filtros.
            </p>
            <Link 
              href="/full-propiedades" 
              className="inline-flex items-center gap-3 mt-10 bg-primary text-white px-8 py-4 rounded-2xl hover:bg-primary/90 transition-all font-medium"
            >
              <FontAwesomeIcon icon={faFilter} />
              Limpiar todos los filtros
            </Link>
          </div>
        ) : (
          <>
            {/* Header de resultados */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-10 gap-6">
              <p className="text-lg text-gray-600">
                Mostrando <span className="font-bold text-gray-900">{propiedades.length}</span> de{' '}
                <span className="font-bold text-gray-900">{total}</span> propiedades
              </p>

            </div>

            {/* Grid de Propiedades */}
            <div className="max-w-4xl mx-auto flex flex-col gap-10">
  {propiedades.map((property) => (
    <PropertyCard 
      key={property.id} 
      property={property} 
    />
  ))}
</div>
            {/* Paginación */}
            {totalPages > 1 && (
              <div className="mt-16 flex justify-center">
                <div className="bg-white rounded-3xl shadow border border-gray-100 p-3 flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === 1}
                    className="rounded-2xl px-7"
                  >
                    <FontAwesomeIcon icon={faChevronLeft} className="mr-2" />
                    Anterior
                  </Button>

                  <div className="flex gap-2 px-4">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let p = i + 1
                      if (totalPages > 5 && page > 3) p = page - 2 + i
                      if (p > totalPages) return null
                      return (
                        <Button
                          key={p}
                          variant={p === page ? "default" : "ghost"}
                          className={`w-11 h-11 rounded-2xl ${p === page ? 'shadow-md' : ''}`}
                        >
                          {p}
                        </Button>
                      )
                    })}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === totalPages}
                    className="rounded-2xl px-7"
                  >
                    Siguiente
                    <FontAwesomeIcon icon={faChevronRight} className="ml-2" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}