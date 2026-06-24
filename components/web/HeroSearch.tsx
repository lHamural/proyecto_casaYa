// app/(public)/components/HeroSearch.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, MapPin, Home, Building2, Warehouse } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'

const propertyTypes = [
  { value: 'casa', label: 'Casa', icon: Home },
  { value: 'departamento', label: 'Departamento', icon: Building2 },
  { value: 'terreno', label: 'Terreno', icon: Warehouse },
]

const operations = [
  { value: 'venta', label: 'Venta' },
  { value: 'alquiler', label: 'Alquiler' },
  { value: 'anticretico', label: 'Anticrético' },
]

const popularCities = ['La Paz', 'Santa Cruz', 'Cochabamba', 'Tarija', 'Oruro']

export function HeroSearch() {
  const router = useRouter()
  const [searchType, setSearchType] = useState('venta')
  const [searchQuery, setSearchQuery] = useState('')
  const [propertyType, setPropertyType] = useState('')
  const [city, setCity] = useState('')
  const [isFocused, setIsFocused] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (searchQuery) params.set('q', searchQuery)
    if (propertyType) params.set('tipo', propertyType)
    if (city) params.set('ciudad', city)
    if (searchType) params.set('operacion', searchType)
    router.push(`/full-propiedades?${params.toString()}`)
  }

  const quickSearch = (city: string) => {
    router.push(`/full-propiedades?ciudad=${encodeURIComponent(city)}&operacion=${searchType}`)
  }

  return (
    <div className="hero-section">
      <div className="hero-overlay" />
      <div className="hero-content">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            {/* Título */}
            <h1 className="hero-title">
              Encuentra la propiedad de tus sueños
            </h1>
            <p className="hero-subtitle">
              Miles de propiedades en venta y alquiler. Encuentra la tuya hoy.
            </p>

            {/* Buscador */}
            <div className="hero-search-container">
              {/* Tabs de operación */}
              <div className="search-tabs">
                {operations.map((op) => (
                  <button
                    key={op.value}
                    className={`search-tab ${searchType === op.value ? 'active' : ''}`}
                    onClick={() => setSearchType(op.value)}
                  >
                    {op.label}
                  </button>
                ))}
              </div>

              {/* Formulario de búsqueda */}
              <form onSubmit={handleSearch} className="search-form">
                <div className="search-input-group">
                  <div className="search-field">
                    <MapPin className="search-icon" />
                    <Input
                      type="text"
                      placeholder="¿Dónde? (Ciudad, Zona)"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="search-input"
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                    />
                  </div>

                  <div className="search-field">
                    <Select value={propertyType} onValueChange={setPropertyType}>
                      <SelectTrigger className="search-select">
                        <SelectValue placeholder="Tipo de propiedad" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todos">Todos los tipos</SelectItem>
                        {propertyTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button type="submit" className="search-button">
                    <Search className="w-4 h-4 mr-2" />
                    Buscar
                  </Button>
                </div>
              </form>

              {/* Ciudades populares */}
              <div className="popular-cities">
                <span className="text-sm text-white/70">Búsquedas populares:</span>
                <div className="flex flex-wrap gap-2">
                  {popularCities.map((city) => (
                    <button
                      key={city}
                      onClick={() => quickSearch(city)}
                      className="city-chip"
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Estadísticas */}
            <div className="hero-stats">
              <div className="hero-stat">
                <span className="hero-stat-number">2,500+</span>
                <span className="hero-stat-label">Propiedades</span>
              </div>
              <div className="hero-stat-divider" />
              <div className="hero-stat">
                <span className="hero-stat-number">1,200+</span>
                <span className="hero-stat-label">Propietarios</span>
              </div>
              <div className="hero-stat-divider" />
              <div className="hero-stat">
                <span className="hero-stat-number">98%</span>
                <span className="hero-stat-label">Satisfacción</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}