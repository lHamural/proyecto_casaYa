import { Pagination } from '@/components/web/Pagination'
import { PropertyCard } from '@/components/web/PropertyCard'
import { FiltrosBusqueda } from '@/components/web/FiltrosBusqueda'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faHome,
  faSearch,
  faBuilding,
  faChevronLeft,
  faChevronRight,
  faFilter,
  faStar,
  faSliders,
  faTimes,
  faTag,
  faMapMarkerAlt,
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

function buildUrl(base: string, params: Record<string, string | undefined>) {
  const sp = new URLSearchParams()
  for (const [k, v] of Object.entries(params)) {
    if (v) sp.set(k, v)
  }
  const qs = sp.toString()
  return qs ? `${base}?${qs}` : base
}

export default async function FullPropiedadesPage({ searchParams }: PageProps) {
  const params = await searchParams
  const page = Number(params.page) || 1
  const limit = 12
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
          select: { id: true, name: true, avatar: true },
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

  const activeFilters = [
    { label: params.operacion, param: 'operacion' },
    { label: params.tipo && params.tipo !== 'todos' ? params.tipo : undefined, param: 'tipo' },
    { label: params.ciudad, param: 'ciudad' },
    params.precioMin || params.precioMax
      ? { label: `$${params.precioMin || '0'} - $${params.precioMax || '∞'}`, param: 'precioMin' }
      : undefined,
  ].filter((f): f is { label: string; param: string } => !!f?.label)

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* === HERO COMPACTO === */}
      <div className="bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 text-white">
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-20">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-white/10 rounded-2xl backdrop-blur">
                  <FontAwesomeIcon icon={faBuilding} className="w-6 h-6 text-blue-400" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">
                  Propiedades
                </h1>
              </div>
              <p className="text-lg text-slate-300 max-w-xl">
                {params.q
                  ? `Resultados para "${params.q}"`
                  : 'Encuentra tu hogar ideal con las mejores opciones del mercado'}
              </p>
            </div>
            <div className="flex flex-wrap gap-3 shrink-0">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 rounded-xl px-5 py-3">
                <FontAwesomeIcon icon={faHome} className="w-4 h-4 text-blue-400" />
                <span className="font-semibold">{total}</span>
                <span className="text-white/60 text-sm">propiedades</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* === CUERPO === */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* FILTROS */}
        <div className="mb-10">
          <FiltrosBusqueda />

          {activeFilters.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mt-4">
              <span className="text-sm text-gray-500 flex items-center gap-1">
                <FontAwesomeIcon icon={faFilter} className="w-3 h-3" />
                Filtros:
              </span>
              {activeFilters.map((f) => (
                <span
                  key={f.param}
                  className="inline-flex items-center gap-1.5 bg-white border border-gray-200 rounded-full px-3.5 py-1.5 text-sm text-gray-700"
                >
                  <FontAwesomeIcon icon={faTag} className="w-3 h-3 text-gray-400" />
                  {f.label}
                  <Link
                    href={buildUrl('/full-propiedades', {
                      ...params,
                      [f.param]: undefined,
                      page: undefined,
                    })}
                    className="ml-1 text-gray-400 hover:text-gray-700 transition-colors"
                  >
                    <FontAwesomeIcon icon={faTimes} className="w-3 h-3" />
                  </Link>
                </span>
              ))}
              <Link
                href="/full-propiedades"
                className="text-sm text-primary hover:underline ml-1"
              >
                Limpiar todo
              </Link>
            </div>
          )}
        </div>

        {/* RESULTADOS */}
        {propiedades.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-16 md:p-20 text-center max-w-2xl mx-auto">
            <div className="mx-auto w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
              <FontAwesomeIcon icon={faSearch} className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-3xl font-bold text-gray-800 mb-3">Sin resultados</h3>
            <p className="text-gray-500 text-lg">
              No hay propiedades que coincidan con tu búsqueda.
              <br />
              Intenta ajustar los filtros.
            </p>
            <Link
              href="/full-propiedades"
              className="inline-flex items-center gap-2 mt-8 bg-primary text-white px-8 py-4 rounded-xl hover:bg-primary/90 transition-all font-semibold"
            >
              <FontAwesomeIcon icon={faSliders} />
              Limpiar filtros
            </Link>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <p className="text-gray-500">
                Mostrando{' '}
                <span className="font-semibold text-gray-900">{propiedades.length}</span> de{' '}
                <span className="font-semibold text-gray-900">{total}</span> propiedades
              </p>
            </div>

            {/* Grid responsive */}
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {propiedades.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={{
                    ...property,
                    createdAt: property.createdAt.toISOString(),
                  }}
                />
              ))}
            </div>

            {/* Paginación */}
            {totalPages > 1 && (
              <div className="mt-16 flex justify-center">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2 flex items-center gap-1">
                  {page === 1 ? (
                    <span className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-300 cursor-not-allowed">
                      <FontAwesomeIcon icon={faChevronLeft} className="w-3.5 h-3.5" />
                      Anterior
                    </span>
                  ) : (
                    <Link
                      href={buildUrl('/full-propiedades', { ...params, page: String(page - 1) })}
                      className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-all"
                    >
                      <FontAwesomeIcon icon={faChevronLeft} className="w-3.5 h-3.5" />
                      Anterior
                    </Link>
                  )}

                  <div className="flex gap-1 px-2">
                    {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
                      let p = i + 1
                      if (totalPages > 7 && page > 4) p = page - 3 + i
                      if (p > totalPages) return null
                      return (
                        <Link
                          key={p}
                          href={buildUrl('/full-propiedades', { ...params, page: String(p) })}
                          className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-medium transition-all ${
                            p === page
                              ? 'bg-primary text-white shadow-md'
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          {p}
                        </Link>
                      )
                    })}
                  </div>

                  {page === totalPages ? (
                    <span className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-300 cursor-not-allowed">
                      Siguiente
                      <FontAwesomeIcon icon={faChevronRight} className="w-3.5 h-3.5" />
                    </span>
                  ) : (
                    <Link
                      href={buildUrl('/full-propiedades', { ...params, page: String(page + 1) })}
                      className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-all"
                    >
                      Siguiente
                      <FontAwesomeIcon icon={faChevronRight} className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
