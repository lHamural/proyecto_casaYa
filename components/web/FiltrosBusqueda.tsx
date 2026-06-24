// components/web/FiltrosBusqueda.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function FiltrosBusqueda() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [q, setQ] = useState(searchParams.get('q') || '')
  const [operacion, setOperacion] = useState(searchParams.get('operacion') || 'todos')
  const [tipo, setTipo] = useState(searchParams.get('tipo') || 'todos')
  const [ciudad, setCiudad] = useState(searchParams.get('ciudad') || '')
  const [precioMin, setPrecioMin] = useState(searchParams.get('precioMin') || '')
  const [precioMax, setPrecioMax] = useState(searchParams.get('precioMax') || '')

  const aplicarFiltros = () => {
    const params = new URLSearchParams()
    if (q) params.set('q', q)
    if (operacion && operacion !== 'todos') params.set('operacion', operacion)
    if (tipo && tipo !== 'todos') params.set('tipo', tipo)
    if (ciudad) params.set('ciudad', ciudad)
    if (precioMin) params.set('precioMin', precioMin)
    if (precioMax) params.set('precioMax', precioMax)
    router.push(`/full-propiedades?${params.toString()}`)
  }

  const limpiarFiltros = () => {
    setQ('')
    setOperacion('todos')
    setTipo('todos')
    setCiudad('')
    setPrecioMin('')
    setPrecioMax('')
    router.push('/full-propiedades')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') aplicarFiltros()
  }

  const hasFilters = q || operacion !== 'todos' || tipo !== 'todos' || ciudad || precioMin || precioMax

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
      <div className="flex flex-wrap items-center gap-3">
        {/* Búsqueda rápida */}
        <div className="flex-1 min-w-[150px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Buscar propiedades..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={handleKeyDown}
            className="pl-9 h-9 bg-gray-50 border-0 rounded-full"
          />
        </div>

        <div className="flex-1 min-w-[150px]">
          <Select value={operacion} onValueChange={setOperacion}>
            <SelectTrigger className="h-9 bg-gray-50 border-0">
              <SelectValue placeholder="Operación" />
            </SelectTrigger>
            <SelectContent className="bg-primary text-white shadow-lg rounded-lg border border-gray-200">
              <SelectItem value="todos">Todas las operaciones</SelectItem>
              <SelectItem value="venta">Venta</SelectItem>
              <SelectItem value="alquiler">Alquiler</SelectItem>
              <SelectItem value="anticretico">Anticrético</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1 min-w-[150px]">
          <Select value={tipo} onValueChange={setTipo}>
            <SelectTrigger className="h-9 bg-gray-50 border-0">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent className="bg-primary text-white shadow-lg rounded-lg border border-gray-200">
              <SelectItem value="todos">Todos los tipos</SelectItem>
              <SelectItem value="casa">Casa</SelectItem>
              <SelectItem value="departamento">Departamento</SelectItem>
              <SelectItem value="terreno">Terreno</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1 min-w-[150px]">
          <Input
            placeholder="Ciudad"
            value={ciudad}
            onChange={(e) => setCiudad(e.target.value)}
            onKeyDown={handleKeyDown}
            className="h-9 bg-gray-50 border-0"
          />
        </div>

        <div className="flex-1 min-w-[100px]">
          <Input
            type="number"
            placeholder="Precio min"
            value={precioMin}
            onChange={(e) => setPrecioMin(e.target.value)}
            className="h-9 bg-gray-50 border-0"
          />
        </div>

        <div className="flex-1 min-w-[100px]">
          <Input
            type="number"
            placeholder="Precio max"
            value={precioMax}
            onChange={(e) => setPrecioMax(e.target.value)}
            className="h-9 bg-gray-50 border-0"
          />
        </div>

        <Button 
          size="sm" 
          className="h-9 rounded-full px-6 bg-primary hover:bg-primary/90"
          onClick={aplicarFiltros}
        >
          <Search className="w-4 h-4 mr-2" />
          Buscar
        </Button>

        {hasFilters && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-9 px-3 text-muted-foreground"
            onClick={limpiarFiltros}
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  )
} 