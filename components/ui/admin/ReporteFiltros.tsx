// components/admin/ReporteFiltros.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faFilter, 
  faXmark, 
  faCalendarAlt, 
  faClock,
  faRotateRight,
  faCalendarDays,
  faCalendarWeek,
  faCalendar,
  faLayerGroup,
  faBolt,
  faHourglass,
  faArrowRotateRight
} from '@fortawesome/free-solid-svg-icons'
import { cn } from '@/lib/utils'

interface ReporteFiltrosProps {
  planes: { id: string; name: string }[]
  fechaInicio: Date
  fechaFin: Date
  planFiltro: string
}

export function ReporteFiltros({ 
  planes, 
  fechaInicio, 
  fechaFin, 
  planFiltro 
}: ReporteFiltrosProps) {
  const router = useRouter()
  const [fechaInicioState, setFechaInicioState] = useState(
    fechaInicio.toISOString().split('T')[0]
  )
  const [fechaFinState, setFechaFinState] = useState(
    fechaFin.toISOString().split('T')[0]
  )
  const [planFiltroState, setPlanFiltroState] = useState(planFiltro)

  const aplicarFiltros = () => {
    const params = new URLSearchParams()
    if (fechaInicioState) params.set('fechaInicio', fechaInicioState)
    if (fechaFinState) params.set('fechaFin', fechaFinState)
    if (planFiltroState && planFiltroState !== 'todos') {
      params.set('plan', planFiltroState)
    }
    router.push(`/admin/reportes?${params.toString()}`)
  }

  const limpiarFiltros = () => {
    router.push('/admin/reportes')
  }

  const presetFechas = (tipo: 'mes' | 'trimestre' | 'anio' | 'todo') => {
    const hoy = new Date()
    let inicio = new Date()
    let fin = new Date()

    switch (tipo) {
      case 'mes':
        inicio = new Date(hoy.getFullYear(), hoy.getMonth(), 1)
        fin = hoy
        break
      case 'trimestre':
        inicio = new Date(hoy.getFullYear(), hoy.getMonth() - 3, 1)
        fin = hoy
        break
      case 'anio':
        inicio = new Date(hoy.getFullYear(), 0, 1)
        fin = hoy
        break
      case 'todo':
        inicio = new Date(2020, 0, 1)
        fin = hoy
        break
    }

    setFechaInicioState(inicio.toISOString().split('T')[0])
    setFechaFinState(fin.toISOString().split('T')[0])
  }

  const presetButtons = [
    { 
      id: 'mes', 
      label: 'Mes', 
      icon: faCalendar,
      onClick: () => presetFechas('mes')
    },
    { 
      id: 'trimestre', 
      label: 'Trimestre', 
      icon: faCalendarWeek,
      onClick: () => presetFechas('trimestre')
    },
    { 
      id: 'anio', 
      label: 'Año', 
      icon: faCalendarDays,
      onClick: () => presetFechas('anio')
    },
    { 
      id: 'todo', 
      label: 'Todo', 
      icon: faClock,
      onClick: () => presetFechas('todo')
    },
  ]

  const hasFiltros = fechaInicioState || fechaFinState || (planFiltroState && planFiltroState !== 'todos')

  return (
    <Card className="border-2 border-gray-100 hover:border-gray-200 transition-colors">
      <CardContent className="p-5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Presets */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <FontAwesomeIcon icon={faBolt} className="w-3 h-3 text-primary" />
              Rápido
            </Label>
            <div className="flex flex-wrap gap-1.5">
              {presetButtons.map((btn) => (
                <Button
                  key={btn.id}
                  variant="outline"
                  size="sm"
                  onClick={btn.onClick}
                  className="text-xs h-8 px-3 border-gray-200 hover:border-primary hover:bg-primary/5 transition-all"
                >
                  <FontAwesomeIcon icon={btn.icon} className="w-3 h-3 mr-1.5" />
                  {btn.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Fecha inicio */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <FontAwesomeIcon icon={faCalendarAlt} className="w-3 h-3 text-blue-500" />
              Fecha inicio
            </Label>
            <Input
              type="date"
              value={fechaInicioState}
              onChange={(e) => setFechaInicioState(e.target.value)}
              className="focus:ring-primary focus:border-primary"
            />
          </div>

          {/* Fecha fin */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <FontAwesomeIcon icon={faCalendarAlt} className="w-3 h-3 text-red-500" />
              Fecha fin
            </Label>
            <Input
              type="date"
              value={fechaFinState}
              onChange={(e) => setFechaFinState(e.target.value)}
              className="focus:ring-primary focus:border-primary"
            />
          </div>

          {/* Plan */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <FontAwesomeIcon icon={faLayerGroup} className="w-3 h-3 text-purple-500" />
              Plan
            </Label>
            <Select value={planFiltroState} onValueChange={setPlanFiltroState}>
              <SelectTrigger className="focus:ring-primary focus:border-primary">
                <SelectValue placeholder="Todos los planes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faLayerGroup} className="w-3 h-3 text-muted-foreground" />
                    Todos los planes
                  </div>
                </SelectItem>
                {planes.map((plan) => (
                  <SelectItem key={plan.id} value={plan.id}>
                    {plan.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Botones */}
        <div className="flex flex-wrap gap-2 mt-5 pt-4 border-t border-gray-100">
          <Button 
            onClick={aplicarFiltros} 
            size="sm"
            className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
          >
            <FontAwesomeIcon icon={faFilter} className="w-4 h-4 mr-2" />
            Aplicar Filtros
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={limpiarFiltros}
            className="border-gray-200 hover:border-red-200 hover:bg-red-50 hover:text-red-600 transition-all"
          >
            <FontAwesomeIcon icon={faXmark} className="w-4 h-4 mr-2" />
            Limpiar
          </Button>
          
          {hasFiltros && (
            <div className="flex items-center gap-1 ml-auto text-xs text-muted-foreground">
              <FontAwesomeIcon icon={faHourglass} className="w-3 h-3" />
              <span>Filtros activos</span>
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse ml-1" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}