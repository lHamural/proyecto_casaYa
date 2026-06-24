// components/web/PropertyFilters.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { Filter, X, Search, SlidersHorizontal } from 'lucide-react'

const operations = [
  { value: 'todos', label: 'Todas las operaciones' },
  { value: 'venta', label: 'Venta' },
  { value: 'alquiler', label: 'Alquiler' },
  { value: 'anticretico', label: 'Anticrético' },
]

const propertyTypes = [
  { value: 'todos', label: 'Todos los tipos' },
  { value: 'casa', label: 'Casa' },
  { value: 'departamento', label: 'Departamento' },
  { value: 'terreno', label: 'Terreno' },
  { value: 'oficina', label: 'Oficina' },
  { value: 'local_comercial', label: 'Local Comercial' },
]

export function PropertyFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isOpen, setIsOpen] = useState(false)
  const [filters, setFilters] = useState({
    q: searchParams.get('q') || '',
    operacion: searchParams.get('operacion') || 'todos',
    tipo: searchParams.get('tipo') || 'todos',
    ciudad: searchParams.get('ciudad') || '',
    precioMin: searchParams.get('precioMin') || '',
    precioMax: searchParams.get('precioMax') || '',
  })

  const hasActiveFilters = filters.q || filters.operacion !== 'todos' || 
    filters.tipo !== 'todos' || filters.ciudad || filters.precioMin || filters.precioMax

  const applyFilters = () => {
    const params = new URLSearchParams()
    if (filters.q) params.set('q', filters.q)
    if (filters.operacion && filters.operacion !== 'todos') params.set('operacion', filters.operacion)
    if (filters.tipo && filters.tipo !== 'todos') params.set('tipo', filters.tipo)
    if (filters.ciudad) params.set('ciudad', filters.ciudad)
    if (filters.precioMin) params.set('precioMin', filters.precioMin)
    if (filters.precioMax) params.set('precioMax', filters.precioMax)
    router.push(`/full-propiedades?${params.toString()}`)
  }

  const clearFilters = () => {
    setFilters({
      q: '',
      operacion: 'todos',
      tipo: 'todos',
      ciudad: '',
      precioMin: '',
      precioMax: '',
    })
    router.push('/full-propiedades')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') applyFilters()
  }

  return (
    <div className="mb-6">
      {/* Header con filtros */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="lg:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            Filtros {hasActiveFilters && <span className="ml-1 w-2 h-2 rounded-full bg-primary" />}
          </Button>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground">
              <X className="w-4 h-4 mr-1" />
              Limpiar filtros
            </Button>
          )}
        </div>
        {hasActiveFilters && (
          <Badge variant="secondary" className="text-xs">
            Filtros aplicados
          </Badge>
        )}
      </div>

      {/* Búsqueda rápida - siempre visible */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por título, ciudad o ubicación..."
          value={filters.q}
          onChange={(e) => setFilters({ ...filters, q: e.target.value })}
          onKeyDown={handleKeyDown}
          className="pl-10 pr-20 h-12 rounded-xl border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
        <Button 
          size="sm" 
          onClick={applyFilters}
          className="absolute right-1 top-1 h-10"
        >
          Buscar
        </Button>
      </div>

      {/* Filtros avanzados */}
      <Card className={`${isOpen ? 'block' : 'hidden lg:block'} border-0 shadow-sm bg-white/80 backdrop-blur`}>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                Operación
              </Label>
              <Select
                value={filters.operacion}
                onValueChange={(value) => setFilters({ ...filters, operacion: value })}
              >
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Operación" />
                </SelectTrigger>
                <SelectContent>
                  {operations.map((op) => (
                    <SelectItem key={op.value} value={op.value}>
                      {op.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                Tipo
              </Label>
              <Select
                value={filters.tipo}
                onValueChange={(value) => setFilters({ ...filters, tipo: value })}
              >
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  {propertyTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                Ciudad
              </Label>
              <Input
                placeholder="Ciudad..."
                value={filters.ciudad}
                onChange={(e) => setFilters({ ...filters, ciudad: e.target.value })}
                onKeyDown={handleKeyDown}
                className="h-10"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                Precio mínimo
              </Label>
              <Input
                type="number"
                placeholder="Min"
                value={filters.precioMin}
                onChange={(e) => setFilters({ ...filters, precioMin: e.target.value })}
                className="h-10"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                Precio máximo
              </Label>
              <Input
                type="number"
                placeholder="Max"
                value={filters.precioMax}
                onChange={(e) => setFilters({ ...filters, precioMax: e.target.value })}
                className="h-10"
              />
            </div>
          </div>

          <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100">
            <Button onClick={applyFilters} className="flex-1 sm:flex-none">
              <Filter className="w-4 h-4 mr-2" />
              Aplicar filtros
            </Button>
            <Button variant="ghost" onClick={clearFilters} className="flex-1 sm:flex-none">
              <X className="w-4 h-4 mr-2" />
              Limpiar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}