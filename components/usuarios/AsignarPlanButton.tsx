// components/usuarios/AsignarPlanButton.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Crown, Loader2, CheckCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface Plan {
  id: string
  name: string
  price: number
  currency: string
  maxProperties: number
  maxImages: number
  durationDays: number
}

interface AsignarPlanButtonProps {
  usuarioId: string
  usuarioName: string
  planActual: string | null
}

export function AsignarPlanButton({ 
  usuarioId, 
  usuarioName,
  planActual 
}: AsignarPlanButtonProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loadingPlanes, setLoadingPlanes] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [planes, setPlanes] = useState<Plan[]>([])
  const [selectedPlan, setSelectedPlan] = useState<string>('')

  useEffect(() => {
    if (open) {
      cargarPlanes()
    }
  }, [open])

  const cargarPlanes = async () => {
    setLoadingPlanes(true)
    setError('')
    try {
      const res = await fetch('/api/admin/planes')
      
      if (!res.ok) {
        const text = await res.text()
        console.error('Respuesta no JSON:', text)
        throw new Error('Error al cargar planes')
      }
      
      const data = await res.json()
      setPlanes(data)
    } catch (error) {
      console.error('Error:', error)
      setError('Error al cargar planes')
    } finally {
      setLoadingPlanes(false)
    }
  }

  const handleAsignar = async () => {
    if (!selectedPlan) {
      setError('Selecciona un plan')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const res = await fetch('/api/usuario/asignar-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuarioId,
          planId: selectedPlan,
        }),
      })

      // Verificar si la respuesta es JSON
      const contentType = res.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        const text = await res.text()
        console.error('Respuesta no JSON:', text)
        throw new Error('El servidor no devolvió una respuesta válida')
      }

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Error al asignar plan')
      }

      setSuccess(`✅ Plan asignado correctamente a ${usuarioName}`)
      
      setTimeout(() => {
        setOpen(false)
        router.refresh()
      }, 1500)
    } catch (error) {
      console.error('Error:', error)
      setError(error instanceof Error ? error.message : 'Error al asignar plan')
    } finally {
      setLoading(false)
    }
  }

  const planSeleccionado = planes.find(p => p.id === selectedPlan)

  return (
    <Dialog open={open} onOpenChange={setOpen} >
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-amber-500 hover:text-amber-600 hover:bg-amber-50">
          <Crown className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-amber-500" />
            Asignar Plan a {usuarioName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Plan actual */}
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Plan actual:</span>
            {planActual ? (
              <Badge variant="outline" className="text-success">{planActual}</Badge>
            ) : (
              <Badge variant="secondary">Sin plan</Badge>
            )}
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 border border-red-200 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 text-green-700 border border-green-200 p-3 rounded-lg text-sm flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              {success}
            </div>
          )}

          {/* Selector de planes */}
          <div className="space-y-2">
            <Label>Seleccionar Plan</Label>
            {loadingPlanes ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                Cargando planes...
              </div>
            ) : (
              <Select value={selectedPlan} onValueChange={setSelectedPlan}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un plan..." />
                </SelectTrigger>
                <SelectContent className='bg-white'>
                  {planes.map((plan) => (
                    <SelectItem key={plan.id} value={plan.id}>
                      <div className="flex items-center gap-2">
                        <span>{plan.name}</span>
                        <span className="text-xs text-muted-foreground">
                          ${plan.price} {plan.currency}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Detalles del plan seleccionado */}
          {planSeleccionado && (
            <div className="bg-muted/30 p-3 rounded-lg space-y-1 text-sm">
              <p className="font-medium">{planSeleccionado.name}</p>
              <p className="text-muted-foreground text-xs">
                💰 {planSeleccionado.price} {planSeleccionado.currency} / {planSeleccionado.durationDays} días
              </p>
              <p className="text-muted-foreground text-xs">
                🏠 {planSeleccionado.maxProperties} propiedades máximas
              </p>
              <p className="text-muted-foreground text-xs">
                🖼️ {planSeleccionado.maxImages} imágenes por propiedad
              </p>
            </div>
          )}

          {/* Botones */}
          <div className="flex gap-2 pt-2">
            <Button
              onClick={handleAsignar}
              disabled={loading || !selectedPlan}
              className="flex-1"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Asignando...
                </>
              ) : (
                <>
                  <Crown className="w-4 h-4 mr-2" />
                  Asignar Plan
                </>
              )}
            </Button>
            <Button className='text-primary'
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}