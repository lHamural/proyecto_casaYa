'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCrown,
  faDollarSign,
  faList,
  faImage,
  faClock,
  faVrCardboard,
  faStar,
  faChartLine,
  faCheckCircle,
  faCreditCard,
  faSave,
  faArrowLeft,
  faInfoCircle,
  faPlus,
  faGear,
  faBuilding,
} from '@fortawesome/free-solid-svg-icons'
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons'

interface PlanFormProps {
  initialData?: {
    id: string
    price: number
    currency: string
    description?: string | null
    maxProperties: number
    maxImages: number
    allowVirtualTour: boolean
    allowHighlight: boolean
    allowWhatsapp: boolean
    allowStats: boolean
    stripePriceId?: string | null
    durationDays: number
    isActive: boolean
  }
  planName?: string
  isEditing?: boolean
}

export default function PlanForm({
  initialData,
  planName,
  isEditing = false,
}: PlanFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    name: planName || 'GRATUITO',
    price: initialData?.price ?? 0,
    currency: initialData?.currency ?? 'USD',
    description: initialData?.description ?? '',
    maxProperties: initialData?.maxProperties ?? 3,
    maxImages: initialData?.maxImages ?? 5,
    allowVirtualTour: initialData?.allowVirtualTour ?? false,
    allowHighlight: initialData?.allowHighlight ?? false,
    allowWhatsapp: initialData?.allowWhatsapp ?? false,
    allowStats: initialData?.allowStats ?? false,
    stripePriceId: initialData?.stripePriceId ?? '',
    durationDays: initialData?.durationDays ?? 30,
    isActive: initialData?.isActive ?? true,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const url = isEditing
      ? `/api/admin/planes/${initialData?.id}`
      : '/api/admin/planes'
    const method = isEditing ? 'PUT' : 'POST'

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Ocurrió un error')
        return
      }

      router.push('/admin/planes')
      router.refresh()
    } catch {
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-full">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl px-5 py-4 text-red-700 text-sm flex items-center gap-3">
          <span className="text-lg">⚠️</span>
          {error}
        </div>
      )}

      {/* Información General */}
      <Card className="border-0 shadow-lg rounded-3xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
          <CardTitle className="flex items-center gap-2 text-xl">
            <FontAwesomeIcon icon={faCrown} className="text-primary" />
            Información General
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5 p-6">
          {!isEditing && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Nombre del Plan *</Label>
              <Select
                value={form.name}
                onValueChange={(val) => setForm({ ...form, name: val })}
              >
                <SelectTrigger className="h-12 rounded-xl border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all">
                  <SelectValue placeholder="Selecciona un plan" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-gray-200 shadow-lg bg-white p-1">
                  <SelectItem
                    value="GRATUITO"
                    className="flex items-center justify-between py-2.5 px-4 rounded-lg text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-700 focus:bg-blue-50 focus:text-blue-700 transition-colors cursor-pointer"
                  >
                    <span>Gratuito</span>
                    <span className="text-xs text-gray-400">$0</span>
                  </SelectItem>
                  <SelectItem
                    value="BASICO"
                    className="flex items-center justify-between py-2.5 px-4 rounded-lg text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-700 focus:bg-blue-50 focus:text-blue-700 transition-colors cursor-pointer"
                  >
                    <span>Básico</span>
                    <span className="text-xs text-gray-400">$9.99</span>
                  </SelectItem>
                  <SelectItem
                    value="PLATINO"
                    className="flex items-center justify-between py-2.5 px-4 rounded-lg text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-700 focus:bg-blue-50 focus:text-blue-700 transition-colors cursor-pointer"
                  >
                    <span>Platino</span>
                    <span className="text-xs text-gray-400">$29.99</span>
                  </SelectItem>
                  <SelectItem
                    value="PREMIUM"
                    className="flex items-center justify-between py-2.5 px-4 rounded-lg text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-700 focus:bg-blue-50 focus:text-blue-700 transition-colors cursor-pointer"
                  >
                    <span>Premium</span>
                    <span className="text-xs text-gray-400">$59.99</span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Precio *</Label>
              <Input
                type="number"
                min={0}
                step="0.01"
                value={form.price}
                onChange={(e) =>
                  setForm({ ...form, price: Number(e.target.value) })
                }
                required
                className="h-11 rounded-xl border-gray-200"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Moneda</Label>
              <Select
                value={form.currency}
                onValueChange={(val) => setForm({ ...form, currency: val })}
              >
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
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Descripción</Label>
            <Textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Descripción del plan..."
              rows={3}
              className="rounded-xl border-gray-200"
            />
          </div>
        </CardContent>
      </Card>

      {/* Límites */}
      <Card className="border-0 shadow-lg rounded-3xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
          <CardTitle className="flex items-center gap-2 text-xl">
            <FontAwesomeIcon icon={faList} className="text-primary" />
            Límites
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Máx. Propiedades</Label>
              <Input
                type="number"
                min={1}
                value={form.maxProperties}
                onChange={(e) =>
                  setForm({ ...form, maxProperties: Number(e.target.value) })
                }
                className="h-11 rounded-xl border-gray-200"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Máx. Imágenes</Label>
              <Input
                type="number"
                min={1}
                value={form.maxImages}
                onChange={(e) =>
                  setForm({ ...form, maxImages: Number(e.target.value) })
                }
                className="h-11 rounded-xl border-gray-200"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Duración (días)</Label>
              <Input
                type="number"
                min={1}
                value={form.durationDays}
                onChange={(e) =>
                  setForm({ ...form, durationDays: Number(e.target.value) })
                }
                className="h-11 rounded-xl border-gray-200"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Funcionalidades */}
      <Card className="border-0 shadow-lg rounded-3xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
          <CardTitle className="flex items-center gap-2 text-xl">
            <FontAwesomeIcon icon={faGear} className="text-primary" />
            Funcionalidades
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 p-6">
          {[
            { key: 'allowVirtualTour', label: 'Tour Virtual 360°', icon: faVrCardboard },
            { key: 'allowHighlight', label: 'Destacar Propiedad', icon: faStar },
            { key: 'allowWhatsapp', label: 'Contacto por WhatsApp', icon: faWhatsapp },
            { key: 'allowStats', label: 'Estadísticas Avanzadas', icon: faChartLine },
            { key: 'isActive', label: 'Plan Activo', icon: faCheckCircle },
          ].map(({ key, label, icon }) => (
            <div key={key} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={icon} className="text-gray-400" />
                <Label className="text-sm font-medium cursor-pointer">{label}</Label>
              </div>
              <Switch
                checked={form[key as keyof typeof form] as boolean}
                onCheckedChange={(val) => setForm({ ...form, [key]: val })}

                className="data-[state=checked]:bg-blue-600"
              /* className="data-[state=checked]:bg-blue-600" */
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Stripe */}
      <Card className="border-0 shadow-lg rounded-3xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
          <CardTitle className="flex items-center gap-2 text-xl">
            <FontAwesomeIcon icon={faCreditCard} className="text-primary" />
            Stripe
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 p-6">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Stripe Price ID</Label>
            <Input
              value={form.stripePriceId}
              onChange={(e) =>
                setForm({ ...form, stripePriceId: e.target.value })
              }
              placeholder="price_xxxxxxxxxxxxxxxx"
              className="h-11 rounded-xl border-gray-200"
            />
            <p className="text-xs text-gray-500">
              Se obtiene desde el dashboard de Stripe al crear el producto.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Botones */}
      <div className="flex flex-wrap gap-4 pb-8">
        <Button
          type="submit"
          disabled={loading}
          size="lg"
          className="rounded-2xl px-8 shadow-lg hover:shadow-xl transition-all bg-primary text-white"
        >
          {loading ? (
            'Guardando...'
          ) : isEditing ? (
            <>
              <FontAwesomeIcon icon={faPlus} className="mr-2" />
              Actualizar Plan
            </>
          ) : (
            <>
              <FontAwesomeIcon icon={faPlus} className="mr-2" />
              Crear Plan
            </>
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={() => router.push('/admin/planes')}
          className="rounded-2xl px-8 border-gray-200 hover:bg-gray-50"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
          Cancelar
        </Button>
      </div>
    </form>
  )
}
