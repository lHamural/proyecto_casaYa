export const dynamic = 'force-dynamic'

import { HeroCarousel } from '@/components/web/HeroCarousel'
import { PropertyCard } from '@/components/web/PropertyCard'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faHome,
  faBuilding,
  faKey,
  faArrowRight,
  faShieldAlt,
  faHandshake,
  faSearch,
  faMapMarkerAlt,
  faCheckCircle,
} from '@fortawesome/free-solid-svg-icons'

async function getFeatured() {
  const images = await prisma.property.findMany({
    where: {
      status: 'PUBLISHED',
      isHighlighted: true,
      images: { some: {} },
    },
    include: {
      images: {
        where: { isPrimary: true },
        take: 1,
        select: { webpPath: true },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 6,
  })

  return images
    .filter((p) => p.images.length > 0)
    .map((p) => ({
      webpPath: p.images[0].webpPath,
      title: p.title,
      id: p.id,
    }))
}

async function getDestacadas() {
  return prisma.property.findMany({
    where: { status: 'PUBLISHED', isHighlighted: true },
    include: {
      images: { where: { isPrimary: true }, take: 1 },
      propertyType: true,
      propertyCategory: true,
      user: { select: { id: true, name: true, avatar: true } },
      _count: { select: { likes: true, comments: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 6,
  })
}

async function getStats() {
  const [total, ciudades] = await Promise.all([
    prisma.property.count({ where: { status: 'PUBLISHED' } }),
    prisma.property.groupBy({
      by: ['city'],
      where: { status: 'PUBLISHED' },
      _count: true,
    }),
  ])
  return { total, ciudades: ciudades.length }
}

export default async function HomePage() {
  const [heroImages, destacadas, stats] = await Promise.all([
    getFeatured(),
    getDestacadas(),
    getStats(),
  ])

  return (
    <div className="min-h-screen">
      {/* === HERO CARROUSEL === */}
      <HeroCarousel images={heroImages} />

      {/* === STATS BAND === */}
      <section className="relative -mt-16 z-30 px-6">
        <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-100 grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100">
          <div className="p-6 text-center">
            <p className="text-3xl font-bold text-gray-900">{stats.total}+</p>
            <p className="text-sm text-gray-500 mt-1">Propiedades</p>
          </div>
          <div className="p-6 text-center">
            <p className="text-3xl font-bold text-gray-900">{stats.ciudades}</p>
            <p className="text-sm text-gray-500 mt-1">Ciudades</p>
          </div>
          <div className="p-6 text-center">
            <p className="text-3xl font-bold text-gray-900">{destacadas.length}</p>
            <p className="text-sm text-gray-500 mt-1">Destacadas</p>
          </div>
          <div className="p-6 text-center">
            <p className="text-3xl font-bold text-gray-900">100%</p>
            <p className="text-sm text-gray-500 mt-1">Confianza</p>
          </div>
        </div>
      </section>

      {/* === CATEGORÍAS === */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">¿Qué estás buscando?</h2>
            <p className="text-lg text-gray-500 max-w-xl mx-auto">
              Explora propiedades según el tipo de operación
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: faHome,
                title: 'Comprar',
                desc: 'Encuentra la casa o departamento de tus sueños',
                href: '/full-propiedades?operacion=venta',
                gradient: 'from-blue-600 to-blue-800',
              },
              {
                icon: faKey,
                title: 'Alquilar',
                desc: 'La mejor opción temporal con total flexibilidad',
                href: '/full-propiedades?operacion=alquiler',
                gradient: 'from-violet-600 to-violet-800',
              },
              {
                icon: faBuilding,
                title: 'Anticrético',
                desc: 'Invierte tu dinero sin pagar alquiler',
                href: '/full-propiedades?operacion=anticretico',
                gradient: 'from-indigo-600 to-indigo-800',
              },
            ].map((cat) => (
              <Link
                key={cat.title}
                href={cat.href}
                className="group relative overflow-hidden rounded-2xl p-8 text-white"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} transition-transform duration-500 group-hover:scale-105`} />
                <div className="absolute inset-0 bg-black/10" />
                <div className="relative z-10">
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-6">
                    <FontAwesomeIcon icon={cat.icon} className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{cat.title}</h3>
                  <p className="text-white/80 mb-6">{cat.desc}</p>
                  <span className="inline-flex items-center gap-2 text-sm font-semibold bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full group-hover:bg-white/30 transition-all">
                    Ver propiedades
                    <FontAwesomeIcon icon={faArrowRight} className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* === DESTACADAS === */}
      {destacadas.length > 0 && (
        <section className="pb-24 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-end justify-between mb-10">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-3">Propiedades Destacadas</h2>
                <p className="text-lg text-gray-500">
                  Las mejores opciones seleccionadas para ti
                </p>
              </div>
              <Link
                href="/full-propiedades"
                className="hidden md:inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
              >
                Ver todas
                <FontAwesomeIcon icon={faArrowRight} className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {destacadas.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={{
                    ...property,
                    createdAt: property.createdAt.toISOString(),
                  }}
                  featured
                />
              ))}
            </div>
            <div className="mt-10 text-center md:hidden">
              <Link
                href="/full-propiedades"
                className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-xl font-semibold hover:bg-primary/90 transition-all"
              >
                Ver todas las propiedades
                <FontAwesomeIcon icon={faArrowRight} className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* === CÓMO FUNCIONA === */}
      <section className="py-24 bg-gradient-to-br from-slate-50 to-blue-50/30 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">¿Cómo funciona?</h2>
            <p className="text-lg text-gray-500 max-w-xl mx-auto">
              Encuentra tu propiedad ideal en 3 simples pasos
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                step: '01',
                icon: faSearch,
                title: 'Busca',
                desc: 'Explora cientos de propiedades filtrando por ciudad, precio y tipo',
              },
              {
                step: '02',
                icon: faHandshake,
                title: 'Conecta',
                desc: 'Contacta directamente con el propietario o agente inmobiliario',
              },
              {
                step: '03',
                icon: faCheckCircle,
                title: 'Compra o Alquila',
                desc: 'Concreta la operación de forma segura y transparente',
              },
            ].map((item) => (
              <div key={item.step} className="text-center group">
                <div className="w-20 h-20 mx-auto mb-6 bg-primary/5 rounded-2xl flex items-center justify-center group-hover:bg-primary/10 transition-all group-hover:scale-110 duration-300">
                  <FontAwesomeIcon icon={item.icon} className="w-9 h-9 text-primary" />
                </div>
                <span className="text-sm font-bold text-primary/60 tracking-widest">{item.step}</span>
                <h3 className="text-xl font-bold text-gray-900 mt-2 mb-3">{item.title}</h3>
                <p className="text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === CTA BANNER === */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-12 md:p-20 text-center text-white">
          <div className="absolute inset-0 bg-[radial-gradient(at_top_right,#4f46e520_0%,transparent_60%)]" />
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tighter">
              ¿Tienes una propiedad para publicar?
            </h2>
            <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
              Llega a miles de compradores e inquilinos. Publica tu propiedad hoy y encuentra al mejor cliente.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/registro"
                className="bg-white text-slate-900 px-10 py-4 rounded-xl font-semibold text-lg hover:bg-white/90 transition-all shadow-xl"
              >
                Publicar mi propiedad
              </Link>
              <Link
                href="/funcion"
                className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-10 py-4 rounded-xl font-semibold text-lg hover:bg-white/20 transition-all"
              >
                Cómo funciona
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
