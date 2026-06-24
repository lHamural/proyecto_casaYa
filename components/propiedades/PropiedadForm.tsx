// components/propiedades/PropiedadForm.tsx
'use client'

import { useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import dynamic from 'next/dynamic'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import {
  Card, CardContent, CardHeader,
  CardTitle, CardDescription,
} from '@/components/ui/card'
import {
  Select, SelectContent,
  SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faHome,
  faBuilding,
  faMapMarkerAlt,
  faDollarSign,
  faBed,
  faBath,
  faRulerCombined,
  faCar,
  faCalendarAlt,
  faInfoCircle,
  faStar,
  faCamera,
  faVrCardboard,
  faPlus,
  faArrowLeft
} from '@fortawesome/free-solid-svg-icons'
import ImageUploader from './ImageUploader'
import TourUploader from './TourUploader'  // ← componente para múltiples tours
import type { MapCoords } from './MapPicker'

// Carga dinámica para evitar error SSR con Leaflet
const MapPicker = dynamic(() => import('./MapPicker'), {
  ssr: false,
  loading: () => (
    <div className="h-96 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400 text-sm">
      Cargando mapa...
    </div>
  ),
})

const DEPARTAMENTOS = [
  'La Paz', 'Santa Cruz', 'Cochabamba', 'Oruro',
  'Potosí', 'Chuquisaca', 'Tarija', 'Beni', 'Pando',
]

interface PropiedadFormProps {
  tipos: { id: string; name: string }[]
  categorias: { id: string; name: string }[]
  caracteristicas: { id: string; name: string; icon?: string | null }[]
  planLimits: {
    plan: { name: string }
    maxImages: number
    allowVirtualTour: boolean
    allowHighlight: boolean
    canPublish: boolean
    remainingProperties: number
  }
  initialData?: any
  isEditing?: boolean
}

export default function PropiedadForm({
  tipos,
  categorias,
  caracteristicas,
  planLimits,
  initialData,
  isEditing = false,
}: PropiedadFormProps) {
  const router = useRouter()
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // ── Refs para inputs de texto ──
  const titleRef = useRef<HTMLInputElement>(null)
  const descriptionRef = useRef<HTMLTextAreaElement>(null)
  const priceRef = useRef<HTMLInputElement>(null)
  const areaRef = useRef<HTMLInputElement>(null)
  const bedroomsRef = useRef<HTMLInputElement>(null)
  const bathroomsRef = useRef<HTMLInputElement>(null)
  const floorsRef = useRef<HTMLInputElement>(null)
  const antiquityRef = useRef<HTMLInputElement>(null)
  const addressRef = useRef<HTMLInputElement>(null)
  const cityRef = useRef<HTMLInputElement>(null)
  const zoneRef = useRef<HTMLInputElement>(null)

  // ── Selects y switches ──
  const [currency, setCurrency] = useState(initialData?.currency || 'USD')
  const [department, setDepartment] = useState(initialData?.department || 'La Paz')
  const [propertyTypeId, setPropertyTypeId] = useState(initialData?.propertyTypeId || '')
  const [propertyCategoryId, setPropertyCategoryId] = useState(initialData?.propertyCategoryId || '')
  const [status, setStatus] = useState(initialData?.status || 'PUBLISHED')
  const [priceNegotiable, setPriceNegotiable] = useState(initialData?.priceNegotiable || false)
  const [garage, setGarage] = useState(initialData?.garage || false)
  const [furnished, setFurnished] = useState(initialData?.furnished || false)
  const [isHighlighted, setIsHighlighted] = useState(initialData?.isHighlighted || false)

  // ── Coordenadas del mapa ──
  const [latitude, setLatitude] = useState<number>(initialData?.latitude || 0)
  const [longitude, setLongitude] = useState<number>(initialData?.longitude || 0)

  // ── Características, imágenes y tours ──
  const [featuresSelected, setFeaturesSelected] = useState<string[]>(
    initialData?.features?.map((f: any) => f.featureId) || []
  )
  const [images, setImages] = useState<any[]>(initialData?.images || [])
  // ✅ ESTADO PARA MÚLTIPLES TOURS
  const [tours, setTours] = useState<any[]>(initialData?.virtualTours || [])

  // Handler del mapa — autocompleta campos de ubicación
  const handleMapChange = useCallback((coords: MapCoords) => {
    setLatitude(coords.lat)
    setLongitude(coords.lng)

    if (coords.city && cityRef.current && !cityRef.current.value) {
      cityRef.current.value = coords.city
    }
    if (coords.zone && zoneRef.current && !zoneRef.current.value) {
      zoneRef.current.value = coords.zone
    }
    if (coords.address && addressRef.current && !addressRef.current.value) {
      addressRef.current.value = coords.address
    }
    if (coords.department) {
      const match = DEPARTAMENTOS.find(d =>
        coords.department!.toLowerCase().includes(d.toLowerCase())
      )
      if (match) setDepartment(match)
    }
  }, [])

  const toggleFeature = useCallback((featureId: string) => {
    setFeaturesSelected(prev =>
      prev.includes(featureId)
        ? prev.filter(id => id !== featureId)
        : [...prev, featureId]
    )
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!propertyTypeId || !propertyCategoryId) {
      setError('Selecciona el tipo de operación y categoría')
      setLoading(false)
      return
    }

    if (images.length === 0) {
      setError('Debes subir al menos una imagen')
      setLoading(false)
      return
    }

    // ✅ PAYLOAD CON tours (array)
    const payload = {
      title: titleRef.current?.value || '',
      description: descriptionRef.current?.value || '',
      price: priceRef.current?.value || '',
      area: areaRef.current?.value || '',
      bedrooms: bedroomsRef.current?.value || '',
      bathrooms: bathroomsRef.current?.value || '',
      floors: floorsRef.current?.value || '',
      antiquity: antiquityRef.current?.value || '',
      address: addressRef.current?.value || '',
      city: cityRef.current?.value || '',
      zone: zoneRef.current?.value || '',
      latitude,
      longitude,
      currency,
      department,
      propertyTypeId,
      propertyCategoryId,
      status,
      priceNegotiable,
      garage,
      furnished,
      isHighlighted,
      images,
      featureIds: featuresSelected,
      tours: tours.map(t => ({
        imagePath: t.imagePath,
        originalPath: t.originalPath || t.imagePath,
        title: t.title || 'Recorrido Virtual',
        order: t.order || 0,
      })),
    }

    if (!payload.title || !payload.description || !payload.price) {
      setError('Título, descripción y precio son obligatorios')
      setLoading(false)
      return
    }

    if (!payload.city) {
      setError('La ciudad es obligatoria')
      setLoading(false)
      return
    }

    const url = isEditing
      ? `/api/propiedades/${initialData?.id}`
      : '/api/propiedades'

    try {
      const res = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Ocurrió un error')
        return
      }

      // 🔹 Redirigir según el rol del usuario
      const isAdmin = session?.user?.role === 'SUPERADMIN'
      if (isAdmin) {
        router.push('/admin/propiedades')
      } else {
        router.push('/suscriptor/propiedades')
      }
      router.refresh()
    } catch {
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-full">
      {/* Alerta plan mejorada */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <FontAwesomeIcon icon={faInfoCircle} className="text-blue-600 text-xl" />
          </div>
          <div>
            <p className="text-sm font-medium text-blue-800">
              Plan activo: <span className="font-bold">{planLimits.plan.name}</span>
            </p>
            <p className="text-xs text-blue-600 mt-0.5">
              Puedes publicar {planLimits.remainingProperties} propiedad(es) más •
              Máx. {planLimits.maxImages} imágenes
            </p>
          </div>
        </div>
        <Badge variant="outline" className="text-blue-700 border-blue-300 px-4 py-1.5">
          {planLimits.plan.name}
        </Badge>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl px-5 py-4 text-red-700 text-sm flex items-center gap-3">
          <span className="text-lg">⚠️</span>
          {error}
        </div>
      )}

      {/* Tipo y Categoría */}
      <Card className="border-0 shadow-lg rounded-3xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
          <CardTitle className="flex items-center gap-2 text-xl">
            <FontAwesomeIcon icon={faBuilding} className="text-primary" />
            Tipo de Operación
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Operación *</Label>
            <Select value={propertyTypeId} onValueChange={setPropertyTypeId}>
              <SelectTrigger className="h-12 rounded-xl border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all">
                <SelectValue placeholder="Seleccionar..." />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-gray-200 shadow-lg bg-white p-1">
                {tipos.map((t) => (
                  <SelectItem
                    key={t.id}
                    value={t.id}
                    className="flex items-center justify-between py-2.5 px-4 rounded-lg text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-700 focus:bg-blue-50 focus:text-blue-700 transition-colors cursor-pointer"
                  >
                    <span>{t.name}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Categoría *</Label>
            <Select value={propertyCategoryId} onValueChange={setPropertyCategoryId}>
              <SelectTrigger className="h-12 rounded-xl border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all">
                <SelectValue placeholder="Seleccionar..." />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-gray-200 shadow-lg bg-white p-1">
                {categorias.map((c) => (
                  <SelectItem
                    key={c.id}
                    value={c.id}
                    className="flex items-center justify-between py-2.5 px-4 rounded-lg text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-700 focus:bg-blue-50 focus:text-blue-700 transition-colors cursor-pointer"
                  >
                    <span>{c.name.replace('_', ' ')}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Información Básica */}
      <Card className="border-0 shadow-lg rounded-3xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
          <CardTitle className="flex items-center gap-2 text-xl">
            <FontAwesomeIcon icon={faHome} className="text-primary" />
            Información Básica
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5 p-6">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Título *</Label>
            <Input
              ref={titleRef}
              defaultValue={initialData?.title || ''}
              placeholder="Ej: Casa moderna en zona sur con jardín"
              className="h-11 rounded-xl border-gray-200"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Descripción *</Label>
            <Textarea
              ref={descriptionRef}
              defaultValue={initialData?.description || ''}
              placeholder="Describe la propiedad con detalle..."
              rows={5}
              className="rounded-xl border-gray-200"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Precio *</Label>
              <Input
                ref={priceRef}
                type="number"
                min={0}
                defaultValue={initialData?.price || ''}
                placeholder="0"
                className="h-11 rounded-xl border-gray-200"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Moneda</Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger className="h-12 rounded-xl border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all">
                  <SelectValue placeholder="Seleccionar moneda" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-gray-200 shadow-lg bg-white p-1">
                  <SelectItem
                    value="USD"
                    className="flex items-center justify-between py-2.5 px-4 rounded-lg text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-700 focus:bg-blue-50 focus:text-blue-700 transition-colors cursor-pointer"
                  >
                    <span>USD ($)</span>
                  </SelectItem>
                  <SelectItem
                    value="BOB"
                    className="flex items-center justify-between py-2.5 px-4 rounded-lg text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-700 focus:bg-blue-50 focus:text-blue-700 transition-colors cursor-pointer"
                  >
                    <span>BOB (Bs.)</span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-3 h-11">
              <Switch checked={priceNegotiable} onCheckedChange={setPriceNegotiable}
                className="data-[state=checked]:bg-blue-600"
              />
              <Label className="text-sm">Precio negociable</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detalles del Inmueble */}
      <Card className="border-0 shadow-lg rounded-3xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
          <CardTitle className="flex items-center gap-2 text-xl">
            <FontAwesomeIcon icon={faBuilding} className="text-primary" />
            Detalles del Inmueble
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: 'Área (m²)', ref: areaRef, placeholder: '150', key: 'area', icon: faRulerCombined },
              { label: 'Dormitorios', ref: bedroomsRef, placeholder: '3', key: 'bedrooms', icon: faBed },
              { label: 'Baños', ref: bathroomsRef, placeholder: '2', key: 'bathrooms', icon: faBath },
            ].map(({ label, ref, placeholder, key, icon }) => (
              <div key={key} className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <FontAwesomeIcon icon={icon} className="text-gray-400" />
                  {label}
                </Label>
                <Input
                  ref={ref}
                  type="number"
                  min={0}
                  defaultValue={initialData?.[key] || ''}
                  placeholder={placeholder}
                  className="h-11 rounded-xl border-gray-200"
                />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: 'Pisos', ref: floorsRef, placeholder: '2', key: 'floors', icon: faBuilding },
              { label: 'Antigüedad (años)', ref: antiquityRef, placeholder: '5', key: 'antiquity', icon: faCalendarAlt },
            ].map(({ label, ref, placeholder, key, icon }) => (
              <div key={key} className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <FontAwesomeIcon icon={icon} className="text-gray-400" />
                  {label}
                </Label>
                <Input
                  ref={ref}
                  type="number"
                  min={0}
                  defaultValue={initialData?.[key] || ''}
                  placeholder={placeholder}
                  className="h-11 rounded-xl border-gray-200"
                />
              </div>
            ))}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Estado</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="h-12 rounded-xl border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all">
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-gray-200 shadow-lg bg-white p-1">
                  <SelectItem
                    value="PUBLISHED"
                    className="flex items-center justify-between py-2.5 px-4 rounded-lg text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-700 focus:bg-blue-50 focus:text-blue-700 transition-colors cursor-pointer"
                  >
                    <span>Publicado</span>
                  </SelectItem>
                  <SelectItem
                    value="DRAFT"
                    className="flex items-center justify-between py-2.5 px-4 rounded-lg text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-700 focus:bg-blue-50 focus:text-blue-700 transition-colors cursor-pointer"
                  >
                    <span>Borrador</span>
                  </SelectItem>
                  <SelectItem
                    value="PAUSED"
                    className="flex items-center justify-between py-2.5 px-4 rounded-lg text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-700 focus:bg-blue-50 focus:text-blue-700 transition-colors cursor-pointer"
                  >
                    <span>Pausado</span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-wrap gap-6 pt-2">
            <div className="flex items-center gap-3">
              <Switch checked={garage} onCheckedChange={setGarage}
                className="data-[state=checked]:bg-blue-600"
              />
              <Label className="flex items-center gap-2">
                <FontAwesomeIcon icon={faCar} className="text-gray-400" />
                Garaje
              </Label>
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={furnished} onCheckedChange={setFurnished}

                className="data-[state=checked]:bg-blue-600"

              />
              <Label className="flex items-center gap-2">
                <FontAwesomeIcon icon={faHome} className="text-gray-400" />
                Amoblado
              </Label>
            </div>
            {planLimits.allowHighlight && (
              <div className="flex items-center gap-3">
                <Switch checked={isHighlighted} onCheckedChange={setIsHighlighted}
                  className="data-[state=checked]:bg-blue-600" />
                <Label className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faStar} className="text-amber-500" />
                  Destacar propiedad
                </Label>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Ubicación con mapa */}
      <Card className="border-0 shadow-lg rounded-3xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
          <CardTitle className="flex items-center gap-2 text-xl">
            <FontAwesomeIcon icon={faMapMarkerAlt} className="text-primary" />
            Ubicación
          </CardTitle>
          <CardDescription>
            Busca una dirección o haz clic en el mapa para marcar la ubicación exacta.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5 p-6">
          <MapPicker
            onChange={handleMapChange}
            initialCoords={
              initialData?.latitude
                ? { lat: initialData.latitude, lng: initialData.longitude }
                : undefined
            }
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Departamento *</Label>
              <Select value={department} onValueChange={setDepartment}>
                <SelectTrigger className="h-12 rounded-xl border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all">
                  <SelectValue placeholder="Seleccionar departamento" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-gray-200 shadow-lg bg-white p-1">
                  {DEPARTAMENTOS.map((d) => (
                    <SelectItem
                      key={d}
                      value={d}
                      className="flex items-center justify-between py-2.5 px-4 rounded-lg text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-700 focus:bg-blue-50 focus:text-blue-700 transition-colors cursor-pointer"
                    >
                      <span>{d}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Ciudad *</Label>
              <Input
                ref={cityRef}
                defaultValue={initialData?.city || ''}
                placeholder="Se completa desde el mapa"
                className="h-11 rounded-xl border-gray-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Zona / Barrio</Label>
              <Input
                ref={zoneRef}
                defaultValue={initialData?.zone || ''}
                placeholder="Se completa desde el mapa"
                className="h-11 rounded-xl border-gray-200"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Dirección de referencia</Label>
              <Input
                ref={addressRef}
                defaultValue={initialData?.address || ''}
                placeholder="Ej: Av. Arce #123 esq. Campos"
                className="h-11 rounded-xl border-gray-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs text-gray-400">Latitud (automático)</Label>
              <Input
                value={latitude || ''}
                readOnly
                className="h-11 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed"
                placeholder="Selecciona en el mapa"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-gray-400">Longitud (automático)</Label>
              <Input
                value={longitude || ''}
                readOnly
                className="h-11 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed"
                placeholder="Selecciona en el mapa"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Características adicionales */}
      <Card className="border-0 shadow-lg rounded-3xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
          <CardTitle className="flex items-center gap-2 text-xl">
            <FontAwesomeIcon icon={faStar} className="text-primary" />
            Características Adicionales
          </CardTitle>
          <CardDescription>Selecciona las características de la propiedad</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-2">
            {caracteristicas.map(c => (
              <button
                key={c.id}
                type="button"
                onClick={() => toggleFeature(c.id)}
                className={`px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all ${featuresSelected.includes(c.id)
                  ? 'bg-primary text-white border-primary shadow-md'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-primary/50 hover:bg-primary/5'
                  }`}
              >
                {c.icon} {c.name}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Imágenes */}
      <Card className="border-0 shadow-lg rounded-3xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
          <CardTitle className="flex items-center gap-2 text-xl">
            <FontAwesomeIcon icon={faCamera} className="text-primary" />
            Imágenes de la Propiedad
          </CardTitle>
          <CardDescription>
            Máximo {planLimits.maxImages} imágenes. La primera será la principal.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <ImageUploader
            maxImages={planLimits.maxImages}
            onChange={setImages}
            value={images}
          />
        </CardContent>
      </Card>

      {/* ✅ Tour Virtual (múltiple) */}
      {planLimits.allowVirtualTour ? (
        <Card className="border-0 shadow-lg rounded-3xl overflow-hidden border-l-4 border-l-purple-500">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-white border-b border-gray-100">
            <CardTitle className="flex items-center gap-2 text-xl text-purple-700">
              <FontAwesomeIcon icon={faVrCardboard} className="text-purple-600" />
              Recorridos Virtuales 360°
            </CardTitle>
            <CardDescription>
              Sube hasta 5 imágenes equirectangulares 360° para crear recorridos virtuales interactivos.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {/* ✅ Aquí se usa `tours` y `setTours` */}
            <TourUploader value={tours} onChange={setTours} maxTours={5} />
          </CardContent>
        </Card>
      ) : (
        <Card className="border-0 shadow-lg rounded-3xl overflow-hidden bg-gray-50 border border-gray-200">
          <CardContent className="py-8 text-center">
            <div className="w-16 h-16 bg-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FontAwesomeIcon icon={faVrCardboard} className="text-gray-400 text-2xl" />
            </div>
            <p className="text-gray-500 text-sm">
              El recorrido virtual está disponible en el plan <strong className="text-purple-700">Premium</strong>.
            </p>
            <Button variant="outline" size="sm" className="mt-4 rounded-xl" asChild>
              <a href="/dashboard/suscripcion">Actualizar plan</a>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Botones */}
      <div className="flex flex-wrap gap-4 pb-8">
        <Button type="submit" disabled={loading} size="lg" className="rounded-2xl px-8 shadow-lg hover:shadow-xl transition-all">
          {loading ? (
            'Guardando...'
          ) : isEditing ? (
            <>
              <FontAwesomeIcon icon={faPlus} className="mr-2" />
              Actualizar Propiedad
            </>
          ) : (
            <>
              <FontAwesomeIcon icon={faPlus} className="mr-2" />
              Publicar Propiedad
            </>
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={() => {
            const isAdmin = session?.user?.role === 'SUPERADMIN'
            router.push(isAdmin ? '/admin/propiedades' : '/suscriptor/propiedades')
          }}
          className="rounded-2xl px-8"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
          Cancelar
        </Button>
      </div>
    </form>
  )
}