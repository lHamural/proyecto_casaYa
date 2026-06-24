// app/(public)/cookies/page.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'  // ← Importar Badge

// FontAwesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faCookieBite, 
  faGear, 
  faShieldHalved, 
  faCircleExclamation,
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons'

export default function CookiesPage() {
  const [preferencias, setPreferencias] = useState({
    necesarias: true,
    analiticas: false,
    publicitarias: false,
  })

  const tiposCookies = [
    {
      id: 'necesarias',
      title: 'Cookies necesarias',
      description: 'Estas cookies son esenciales para el funcionamiento del sitio y no pueden desactivarse.',
      icon: faShieldHalved,
      required: true,
    },
    {
      id: 'analiticas',
      title: 'Cookies analíticas',
      description: 'Nos ayudan a entender cómo los usuarios interactúan con nuestro sitio para mejorar la experiencia.',
      icon: faGear,
      required: false,
    },
    {
      id: 'publicitarias',
      title: 'Cookies publicitarias',
      description: 'Permiten mostrar anuncios relevantes basados en tus intereses.',
      icon: faCookieBite,
      required: false,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
              <FontAwesomeIcon icon={faCookieBite} className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-primary">
              Política de Cookies
            </h1>
            <p className="text-muted-foreground mt-2">
              Última actualización: {new Date().toLocaleDateString('es-ES', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>

          {/* Introducción */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <div className="flex items-start gap-4">
              <FontAwesomeIcon icon={faCircleExclamation} className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
              <div>
                <p className="text-sm text-muted-foreground">
                  Esta página explica cómo utilizamos las cookies y cómo puedes controlarlas. 
                  Al continuar navegando, aceptas nuestro uso de cookies.
                </p>
              </div>
            </div>
          </div>

          {/* Preferencias de cookies */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <h2 className="text-lg font-semibold text-primary mb-4">
              Configuración de cookies
            </h2>
            
            <div className="space-y-4">
              {tiposCookies.map((tipo) => (
                <div key={tipo.id} className="flex items-start justify-between gap-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <FontAwesomeIcon icon={tipo.icon} className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{tipo.title}</p>
                      <p className="text-xs text-muted-foreground">{tipo.description}</p>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    {tipo.required ? (
                      <Badge variant="secondary" className="text-xs">Obligatoria</Badge>
                    ) : (
                      <Switch
                        checked={preferencias[tipo.id as keyof typeof preferencias]}
                        onCheckedChange={(checked) => 
                          setPreferencias(prev => ({ ...prev, [tipo.id]: checked }))
                        }
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex gap-3">
              <Button className="flex-1">Guardar preferencias</Button>
              <Button variant="outline" className="flex-1">Aceptar todas</Button>
            </div>
          </div>

          {/* Información adicional */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-primary mb-4">
              ¿Qué son las cookies?
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo cuando visitas un sitio web. 
              Nos ayudan a recordar tus preferencias y mejorar tu experiencia de navegación.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-sm mb-1">Cookies de sesión</h3>
                <p className="text-xs text-muted-foreground">
                  Se eliminan cuando cierras el navegador. Son esenciales para el funcionamiento básico.
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-sm mb-1">Cookies persistentes</h3>
                <p className="text-xs text-muted-foreground">
                  Permanecen en tu dispositivo por un período determinado o hasta que las elimines manualmente.
                </p>
              </div>
            </div>

            <div className="mt-6 flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
              <FontAwesomeIcon icon={faCheckCircle} className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-green-800 font-medium">Tu privacidad es importante</p>
                <p className="text-xs text-green-700">
                  Puedes cambiar tus preferencias de cookies en cualquier momento desde esta página.
                </p>
              </div>
            </div>
          </div>

          {/* Enlaces */}
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <Link href="/terminos" className="text-sm text-muted-foreground hover:text-primary hover:underline">
              Términos y Condiciones
            </Link>
            <span className="text-muted-foreground">|</span>
            <Link href="/privacidad" className="text-sm text-muted-foreground hover:text-primary hover:underline">
              Política de Privacidad
            </Link>
            <span className="text-muted-foreground">|</span>
            <Link href="/cookies" className="text-sm text-primary font-medium hover:underline">
              Política de Cookies
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}