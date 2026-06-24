'use client'

import { useEffect, useState, useCallback } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, MapPin } from 'lucide-react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix icono por defecto de Leaflet en Next.js
const DEFAULT_ICON = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
})

export interface MapCoords {
  lat: number
  lng: number
  address?: string
  city?: string
  zone?: string
  department?: string
}

interface MapPickerProps {
  onChange: (coords: MapCoords) => void
  initialCoords?: { lat: number; lng: number }
}

// Componente interno que escucha clicks en el mapa
function ClickHandler({
  onMapClick,
}: {
  onMapClick: (lat: number, lng: number) => void
}) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng)
    },
  })
  return null
}

// Componente que mueve el mapa cuando cambian las coords
function MapMover({ coords }: { coords: { lat: number; lng: number } | null }) {
  const map = useMapEvents({})
  useEffect(() => {
    if (coords) {
      map.flyTo([coords.lat, coords.lng], 16, { duration: 1 })
    }
  }, [coords, map])
  return null
}

export default function MapPicker({ onChange, initialCoords }: MapPickerProps) {
  // Bolivia centro por defecto
  const DEFAULT_CENTER = { lat: -16.5, lng: -68.15 }

  const [marker, setMarker] = useState<{ lat: number; lng: number } | null>(
    initialCoords || null
  )
  const [search, setSearch] = useState('')
  const [searching, setSearching] = useState(false)
  const [searchError, setSearchError] = useState('')
  const [flyTo, setFlyTo] = useState<{ lat: number; lng: number } | null>(null)

  // Obtener dirección a partir de coordenadas (reverse geocoding)
  const reverseGeocode = useCallback(
    async (lat: number, lng: number) => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=es`,
          { headers: { 'User-Agent': 'CasaYa/1.0' } }
        )
        const data = await res.json()

        const address = data.display_name || ''
        const city =
          data.address?.city ||
          data.address?.town ||
          data.address?.village ||
          ''
        const zone =
          data.address?.suburb ||
          data.address?.neighbourhood ||
          data.address?.quarter ||
          ''
        const department = data.address?.state || ''

        onChange({ lat, lng, address, city, zone, department })
      } catch {
        onChange({ lat, lng })
      }
    },
    [onChange]
  )

  // Click en el mapa
  const handleMapClick = useCallback(
    (lat: number, lng: number) => {
      setMarker({ lat, lng })
      reverseGeocode(lat, lng)
    },
    [reverseGeocode]
  )

  // Buscar dirección
  const handleSearch = async () => {
    if (!search.trim()) return
    setSearching(true)
    setSearchError('')

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          search + ', Bolivia'
        )}&format=json&limit=1&accept-language=es`,
        { headers: { 'User-Agent': 'CasaYa/1.0' } }
      )
      const data = await res.json()

      if (!data.length) {
        setSearchError('No se encontró la dirección. Intenta con otra búsqueda.')
        return
      }

      const { lat, lon } = data[0]
      const coords = { lat: Number(lat), lng: Number(lon) }
      setMarker(coords)
      setFlyTo(coords)
      reverseGeocode(coords.lat, coords.lng)
    } catch {
      setSearchError('Error al buscar la dirección')
    } finally {
      setSearching(false)
    }
  }

  return (
    <div className="space-y-3">
      {/* Buscador de dirección */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleSearch())}
            placeholder="Buscar dirección, zona o ciudad..."
            className="pl-9"
          />
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={handleSearch}
          disabled={searching}
        >
          {searching ? 'Buscando...' : 'Buscar'}
        </Button>
      </div>

      {searchError && (
        <p className="text-xs text-red-500">{searchError}</p>
      )}

      {/* Instrucción */}
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <MapPin className="w-3 h-3" />
        <span>Haz clic en el mapa para seleccionar la ubicación exacta</span>
      </div>

      {/* Mapa */}
      <div className="rounded-lg overflow-hidden border border-gray-200" style={{ height: '380px' }}>
        <MapContainer
          center={initialCoords || DEFAULT_CENTER}
          zoom={initialCoords ? 15 : 12}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          <ClickHandler onMapClick={handleMapClick} />
          {flyTo && <MapMover coords={flyTo} />}
          {marker && (
            <Marker position={[marker.lat, marker.lng]} icon={DEFAULT_ICON} />
          )}
        </MapContainer>
      </div>

      {/* Coordenadas seleccionadas */}
      {marker && (
        <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 flex items-center gap-3">
          <MapPin className="w-4 h-4 text-green-600 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-green-800">
              Ubicación seleccionada
            </p>
            <p className="text-xs text-green-600 font-mono">
              Lat: {marker.lat.toFixed(6)} — Lng: {marker.lng.toFixed(6)}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setMarker(null)
              onChange({ lat: 0, lng: 0 })
            }}
            className="ml-auto text-xs text-green-700 underline"
          >
            Limpiar
          </button>
        </div>
      )}
    </div>
  )
}