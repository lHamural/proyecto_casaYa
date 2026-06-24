import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Eye, Phone, Home, Image, Clock } from 'lucide-react'

interface EstadisticasUsoProps {
  stats: {
    propiedadesPublicadas: number
    propiedadesTotal: number
    maxPropiedades: number
    imagenesUsadas: number
    maxImagenesPorProp: number
    diasRestantes: number | null
    totalVistas: number
    totalContactos: number
  }
}

function ProgressBar({ value, max, color = 'bg-blue-500' }: {
  value: number
  max: number
  color?: string
}) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0
  const isWarning = pct >= 80
  const barColor = isWarning ? 'bg-orange-500' : color

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-gray-500">
        <span>{value} usados</span>
        <span>{max} máximo</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {isWarning && (
        <p className="text-xs text-orange-600">
          ⚠️ Estás usando el {Math.round(pct)}% de tu límite
        </p>
      )}
    </div>
  )
}

export default function EstadisticasUso({ stats }: EstadisticasUsoProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Uso del Plan</h2>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {/* Vistas totales */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Eye className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalVistas.toLocaleString()}</p>
                <p className="text-xs text-gray-500">Vistas totales</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contactos */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <Phone className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalContactos}</p>
                <p className="text-xs text-gray-500">Contactos recibidos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Propiedades */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 p-2 rounded-lg">
                <Home className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.propiedadesPublicadas}</p>
                <p className="text-xs text-gray-500">Propiedades activas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Días restantes */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="bg-orange-100 p-2 rounded-lg">
                <Clock className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {stats.diasRestantes !== null ? stats.diasRestantes : '∞'}
                </p>
                <p className="text-xs text-gray-500">Días restantes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Barras de progreso */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Límites del Plan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Home className="w-4 h-4 text-gray-500" />
              <p className="text-sm font-medium">Propiedades publicadas</p>
            </div>
            <ProgressBar
              value={stats.propiedadesPublicadas}
              max={stats.maxPropiedades}
              color="bg-purple-500"
            />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <Image className="w-4 h-4 text-gray-500" />
              <p className="text-sm font-medium">Imágenes subidas</p>
            </div>
            <ProgressBar
              value={stats.imagenesUsadas}
              max={stats.maxPropiedades * stats.maxImagenesPorProp}
              color="bg-blue-500"
            />
          </div>

          {stats.diasRestantes !== null && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <p className="text-sm font-medium">Días restantes del plan</p>
              </div>
              <ProgressBar
                value={30 - stats.diasRestantes}
                max={30}
                color="bg-green-500"
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}